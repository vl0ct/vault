import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import z from "zod";
import { db } from "@/db/client";
import { organization, teamProject } from "@/db/schema";
import { auth } from "@/lib/auth";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

const createTeamSchema = z.object({
  name: z.string().min(4).max(100),
});

const updateTeamSchema = z.object({
  teamId: z.string(),
  description: z.string().optional(),
});

async function hasOrgPermission(
  organizationId: string,
  permissions: Record<string, string[]>,
) {
  const result = await auth.api.hasPermission({
    headers: await headers(),
    body: {
      organizationId,
      permissions,
    },
  });
  if (!result.success) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You do not have permission to perform this action.",
    });
  }
}

export const teamRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createTeamSchema)
    .mutation(async ({ input, ctx }) => {
      const random = Math.random().toString(36).slice(2, 6);
      const slug = [
        input.name.trim().toLowerCase().replace(/\s+/g, ""),
        ctx.auth.session.userId.slice(0, 5),
        random,
        new Date().toISOString().slice(0, 10).split("-").join(""),
      ].join("-");

      const data = await auth.api.createOrganization({
        body: {
          name: input.name,
          slug,
          logo: `https://az-avatar.vercel.app/api/avatar?text=${input.name.slice(0, 2)}&textColor=#111111&fontSize=20&bgColor=#fafafa&height=50&width=50`,
        },
        headers: await headers(),
      });
      return data;
    }),

  get_all: protectedProcedure.query(async () => {
    const data = await auth.api.listOrganizations({
      headers: await headers(),
    });

    return data;
  }),

  invite: protectedProcedure
    .input(
      z.object({
        email: z.email(),
        teamId: z.string(),
        role: z.enum(["admin", "member", "owner"]),
      }),
    )
    .mutation(async ({ input }) => {
      await hasOrgPermission(input.teamId, {
        organization: ["invite"],
      });
      const data = await auth.api.createInvitation({
        body: {
          email: input.email,
          role: input.role,
          organizationId: input.teamId,
          resend: true,
        },
        headers: await headers(),
      });
      return data;
    }),
  get_active_team: protectedProcedure.query(async () => {
    const data = await auth.api.getFullOrganization({
      headers: await headers(),
    });

    return data;
  }),
  get_members: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .query(async ({ input }) => {
      const data = await auth.api.listMembers({
        query: {
          organizationId: input.teamId,
          sortBy: "createdAt",
        },
        headers: await headers(),
      });
      return data;
    }),
  delete: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ input }) => {
      await hasOrgPermission(input.teamId, {
        organization: ["delete"],
      });
      const data = await auth.api.deleteOrganization({
        body: {
          organizationId: input.teamId,
        },
        headers: await headers(),
      });
      return data;
    }),

  update: protectedProcedure
    .input(updateTeamSchema)
    .mutation(async ({ input }) => {
      await hasOrgPermission(input.teamId, {
        organization: ["update"],
      });

      const [org] = await db
        .select()
        .from(organization)
        .where(eq(organization.id, input.teamId));

      if (!org) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found.",
        });
      }

      const existingMetadata = org.metadata ? JSON.parse(org.metadata) : {};
      const newMetadata = {
        ...existingMetadata,
        description: input.description,
      };

      await db
        .update(organization)
        .set({
          metadata: JSON.stringify(newMetadata),
        })
        .where(eq(organization.id, input.teamId));
      return { success: true };
    }),

  delete_all_projects: protectedProcedure
    .input(z.object({ teamId: z.string() }))
    .mutation(async ({ input }) => {
      await hasOrgPermission(input.teamId, {
        organization: ["delete"],
      });
      await db.delete(teamProject).where(eq(teamProject.teamId, input.teamId));
      return { success: true };
    }),
});
