import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";
import { db } from "@/db/client";
import { personalProject, teamProject } from "@/db/schema";
import { auth } from "@/lib/auth";
import { decrypt, encrypt } from "@/lib/crypto";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const createProjectSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  type: z.enum(["PERSONAL", "TEAM"]).default("PERSONAL"),
  teamId: z.string().optional(),
});

async function getFullOrganization(teamId: string) {
  try {
    const data = await auth.api.getFullOrganization({
      query: { organizationId: teamId },
      headers: await headers(),
    });
    if (!data) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a member of this team.",
      });
    }
    return data;
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not a member of this team.",
    });
  }
}

async function assertProjectPermission(
  teamId: string,
  permissions: Record<string, string[]>,
) {
  const result = await auth.api.hasPermission({
    headers: await headers(),
    body: {
      organizationId: teamId,
      permissions,
    },
  });
  if (!result.success) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You do not have permission to perform this action.",
    });
  }
}

function requireTeamId(teamId: string | undefined) {
  if (!teamId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "teamId is required for team projects.",
    });
  }
  return teamId;
}

async function decryptEnvs<T extends { envs?: unknown }>(
  project: T | null | undefined,
  notFoundMessage = "Project not found",
) {
  if (!project) {
    throw new TRPCError({ code: "NOT_FOUND", message: notFoundMessage });
  }
  const rawEnvs = project.envs as Record<string, string> | undefined;
  const envs = rawEnvs ?? {};
  const decryptedEnvs: Record<string, string> = {};
  for (const [key, value] of Object.entries(envs)) {
    try {
      decryptedEnvs[key] = await decrypt(String(value));
    } catch {
      decryptedEnvs[key] = String(value);
    }
  }
  return { ...project, envs: decryptedEnvs };
}

export const projectRouter = createTRPCRouter({
  get_all: protectedProcedure
    .input(
      z.object({
        type: z.enum(["PERSONAL", "TEAM"]),
        teamId: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.session.userId;

      if (input.type === "PERSONAL") {
        return db
          .select()
          .from(personalProject)
          .where(eq(personalProject.userId, userId));
      }

      const teamId = requireTeamId(input.teamId);
      await getFullOrganization(teamId);
      return db
        .select()
        .from(teamProject)
        .where(eq(teamProject.teamId, teamId));
    }),

  create_project: protectedProcedure
    .input(createProjectSchema)
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.session.userId;
      const random = Math.random().toString(36).slice(2, 6);
      const slug = `${input.name.trim().toLowerCase().replace(/\s+/g, "-")}-${random}`;

      if (input.type === "PERSONAL") {
        const [createdProject] = await db
          .insert(personalProject)
          .values({
            name: input.name,
            slug,
            description: input.description,
            userId,
          })
          .returning();

        return createdProject;
      }

      const teamId = requireTeamId(input.teamId);
      await getFullOrganization(teamId);
      await assertProjectPermission(teamId, {
        project: ["create"],
      });

      const [createdProject] = await db
        .insert(teamProject)
        .values({
          name: input.name,
          slug,
          description: input.description,
          teamId,
        })
        .returning();

      return createdProject;
    }),

  get_by_slug: protectedProcedure
    .input(
      z.object({
        slug: z.string().min(4).max(100),
        type: z.enum(["PERSONAL", "TEAM"]),
        teamId: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.auth.session.userId;

      if (input.type === "PERSONAL") {
        const [project] = await db
          .select()
          .from(personalProject)
          .where(
            and(
              eq(personalProject.userId, userId),
              eq(personalProject.slug, input.slug),
            ),
          );

        return decryptEnvs(project);
      }

      const teamId = requireTeamId(input.teamId);
      await getFullOrganization(teamId);

      const [project] = await db
        .select()
        .from(teamProject)
        .where(
          and(eq(teamProject.teamId, teamId), eq(teamProject.slug, input.slug)),
        );

      return decryptEnvs(project);
    }),

  update_by_slug: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        name: z.string().optional(),
        description: z.string().max(200).optional(),
        projectType: z.enum(["PERSONAL", "TEAM"]).default("PERSONAL"),
        teamId: z.string().optional(),
        envs: z.record(z.string(), z.any()).optional(),
        deleteEnvKeys: z.array(z.string()).optional(),
        type: z.enum(["production", "development", "test"]).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.auth.session.userId;

      if (input.projectType === "PERSONAL") {
        const [existingProject] = await db
          .select()
          .from(personalProject)
          .where(
            and(
              eq(personalProject.userId, userId),
              eq(personalProject.slug, input.slug),
            ),
          );

        if (!existingProject)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });

        let mergedEnvs: Record<string, any> = existingProject.envs ?? {};

        // Handle environment variable deletions
        if (input.deleteEnvKeys && input.deleteEnvKeys.length > 0) {
          for (const keyToDelete of input.deleteEnvKeys) {
            delete mergedEnvs[keyToDelete];
          }
        }

        // Handle environment variable additions/updates
        if (input.envs) {
          const encryptedEnvs: Record<string, string> = {};
          for (const [key, value] of Object.entries(input.envs)) {
            if (typeof value === "string" && value.trim() !== "") {
              encryptedEnvs[key] = await encrypt(value);
            }
          }
          mergedEnvs = { ...mergedEnvs, ...encryptedEnvs };
        }

        const [updatedProject] = await db
          .update(personalProject)
          .set({
            name: input.name ?? existingProject.name,
            description: input.description ?? existingProject.description,
            type: input.type ?? existingProject.type,
            envs: mergedEnvs,
          })
          .where(
            and(
              eq(personalProject.userId, userId),
              eq(personalProject.slug, input.slug),
            ),
          )
          .returning();

        return updatedProject;
      }

      const teamId = requireTeamId(input.teamId);
      await getFullOrganization(teamId);
      await assertProjectPermission(teamId, {
        project: ["update"],
      });

      const [existingProject] = await db
        .select()
        .from(teamProject)
        .where(
          and(eq(teamProject.teamId, teamId), eq(teamProject.slug, input.slug)),
        );

      if (!existingProject)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });

      let mergedEnvs: Record<string, any> = existingProject.envs ?? {};

      // Handle environment variable deletions
      if (input.deleteEnvKeys && input.deleteEnvKeys.length > 0) {
        for (const keyToDelete of input.deleteEnvKeys) {
          delete mergedEnvs[keyToDelete];
        }
      }

      // Handle environment variable additions/updates
      if (input.envs) {
        const encryptedEnvs: Record<string, string> = {};
        for (const [key, value] of Object.entries(input.envs)) {
          if (typeof value === "string" && value.trim() !== "") {
            encryptedEnvs[key] = await encrypt(value);
          }
        }
        mergedEnvs = { ...mergedEnvs, ...encryptedEnvs };
      }

      const [updatedProject] = await db
        .update(teamProject)
        .set({
          name: input.name ?? existingProject.name,
          description: input.description ?? existingProject.description,
          type: input.type ?? existingProject.type,
          envs: mergedEnvs,
        })
        .where(
          and(eq(teamProject.teamId, teamId), eq(teamProject.slug, input.slug)),
        )
        .returning();

      return updatedProject;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        type: z.enum(["PERSONAL", "TEAM"]).default("PERSONAL"),
        teamId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.type == "TEAM") {
        const teamId = requireTeamId(input.teamId);
        await getFullOrganization(teamId);
        await assertProjectPermission(teamId, {
          project: ["delete"],
        });

        const [existingProject] = await db
          .select()
          .from(teamProject)
          .where(
            and(
              eq(teamProject.teamId, teamId),
              eq(teamProject.slug, input.slug),
            ),
          );

        if (!existingProject)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });

        const [deletedProject] = await db
          .delete(teamProject)
          .where(
            and(
              eq(teamProject.teamId, teamId),
              eq(teamProject.slug, input.slug),
            ),
          )
          .returning();

        return deletedProject;
      }

      const [existingProject] = await db
        .select()
        .from(personalProject)
        .where(
          and(
            eq(personalProject.slug, input.slug),
            eq(personalProject.userId, ctx.auth.session.userId),
          ),
        );

      if (!existingProject)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });

      const [deletedProject] = await db
        .delete(personalProject)
        .where(
          and(
            eq(personalProject.slug, input.slug),
            eq(personalProject.userId, ctx.auth.session.userId),
          ),
        )
        .returning();

      return deletedProject;
    }),
});
