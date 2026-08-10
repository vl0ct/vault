"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import ResponsiveModal from "./responsive-modal";

interface CreateProjectProps {
  children: React.ReactNode;
  projectType: "PERSONAL" | "TEAM";
  teamId?: string;
}

export default function CreateProject({
  children,
  projectType,
  teamId,
}: CreateProjectProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const trpc = useTRPC();
  const { mutate, isPending, error, status } = useMutation(
    trpc.projects.create_project.mutationOptions(),
  );
  const queryClient = useQueryClient();

  const handleProjectCreation = () => {
    mutate(
      {
        name,
        description,
        type: projectType,
        teamId: projectType === "TEAM" ? teamId : undefined,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(
            trpc.projects.get_all.queryOptions({
              type: projectType,
              teamId: projectType === "TEAM" ? teamId : undefined,
            }),
          );
          setModalOpen(false);
          setName("");
          setDescription("");
          toast.success("Project created successfully");
        },
      },
    );
  };

  if (error) {
    let parsedMessage: string | null = null;
    try {
      const parsed = JSON.parse(error.message);
      if (Array.isArray(parsed) && parsed[0]?.code === "too_small") {
        parsedMessage = "Project name must be at least 2 characters long";
      }
    } catch {
      // error.message wasn't JSON; fall back to the raw message below
    }
    toast.error(
      parsedMessage ?? "An error occurred while creating the project",
    );
  }

  const content = (
    <div className="py-2 grid gap-2">
      <Label htmlFor="project-name">Project Name</Label>
      <Input
        id="project-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full"
        placeholder="My Cool Project"
      />
      <Label htmlFor="project-description" className="mt-1.5">
        Description{" "}
        <span className="text-xs text-foreground/80">Optional*</span>
      </Label>
      <Textarea
        id="project-description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full"
        placeholder="This project is for, about ..."
      />
    </div>
  );

  return (
    <ResponsiveModal
      open={modalOpen}
      onOpenChange={setModalOpen}
      title="Creating Project"
      description="A project can have multiple variables and can be used to organize, store and share variables."
      content={content}
      confirmText={
        <>
          {isPending && <Loader />}
          Continue
        </>
      }
      cancelText="Cancel"
      onConfirm={handleProjectCreation}
      confirmDisabled={isPending}
      cancelDisabled={isPending}
    >
      {children}
    </ResponsiveModal>
  );
}
