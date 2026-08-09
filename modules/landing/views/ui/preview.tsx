"use client";

import {
  CheckCircle2,
  Code2,
  Database,
  GitBranch,
  Key,
  Lock,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FramedSection } from "@/components/ui/framed-section";

const envVars = [
  { key: "DATABASE_URL", value: "postgresql://***", icon: Database },
  { key: "API_SECRET_KEY", value: "••••••••••••••••", icon: Key },
  { key: "STRIPE_API_KEY", value: "sk_live_••••••••", icon: Lock },
  { key: "GITHUB_TOKEN", value: "ghp_••••••••••••", icon: GitBranch },
];

export default function Preview() {
  return (
    <FramedSection label="Preview">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col gap-4 p-4 sm:p-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-secondary p-2.5">
              <Database className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-mono text-sm font-semibold sm:text-base">
                My Cool App
              </h3>
              <p className="text-xs text-muted-foreground">
                12 variables configured
              </p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1 rounded-none">
            <Shield className="size-3" />
            Encrypted
          </Badge>
        </div>

        {/* Environment Variables List */}
        <div className="flex flex-col gap-2">
          {envVars.map((env) => {
            const Icon = env.icon;
            return (
              <div
                key={env.key}
                className="group relative flex items-center justify-between border border-border p-3 transition-colors duration-200 hover:border-primary/30 hover:bg-accent/50"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Icon className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-mono text-sm font-medium">
                      {env.key}
                    </div>
                    <div className="truncate font-mono text-xs text-muted-foreground">
                      {env.value}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-none transition-opacity duration-200 group-hover:opacity-100 sm:opacity-0"
                  aria-label={`Copy ${env.key}`}
                >
                  <Code2 className="size-4" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            variant="secondary"
            className="min-w-[120px] flex-1 rounded-none"
          >
            Add Variable
          </Button>
          <Button
            variant="secondary"
            className="min-w-[120px] flex-1 rounded-none"
          >
            Import .env
          </Button>
          <Button
            variant="default"
            className="min-w-[120px] flex-1 rounded-none"
          >
            Deploy
          </Button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-green-500" />
            <span>All systems operational</span>
          </div>
          <span className="hidden sm:inline">Last synced: 2 min ago</span>
        </div>
      </motion.div>
    </FramedSection>
  );
}
