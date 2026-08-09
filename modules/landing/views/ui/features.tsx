"use client";

import { motion } from "motion/react";
import { FramedSection } from "@/components/ui/framed-section";

const featureCards = [
  {
    title: "Encrypted by default",
    description:
      "Every variable is encrypted end-to-end, so your secrets stay safe at rest and in transit.",
  },
  {
    title: "Syncs across your stack",
    description:
      "Manage environment variables for all your projects and services from a single source.",
  },
  {
    title: "Private and secure",
    description:
      "Enterprise-grade encryption, granular permissions, and audit trails you can review.",
  },
  {
    title: "Team-ready collaboration",
    description:
      "Share secrets safely across your team with role-based access and full history.",
  },
  {
    title: "Get started with one command",
    description:
      "Install in seconds, connect your projects, and sync your first variable.",
  },
  {
    title: "Self-hostable",
    description:
      "Deploy Vault on your own infrastructure to stay fully in control of your data.",
  },
];

export default function Features() {
  return (
    <FramedSection label="Features">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.28 }}
            className="relative flex min-h-[180px] flex-col justify-between overflow-hidden border border-border p-6"
          >
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {card.title}
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-5 text-muted-foreground">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>
    </FramedSection>
  );
}
