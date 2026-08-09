"use client";
import { ArrowRight } from "lucide-react";
import type { Variants } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StarBorder from "@/components/ui/star-border";
import { AnimatedGroup } from "@/modules/landing/views/ui/animated-group";
import Header from "./header";

export default function Hero() {
  const transitionVariants: { container?: Variants; item?: Variants } = {
    item: {
      hidden: {
        opacity: 0,
        filter: "blur(12px)",
        y: 12,
      },
      visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
          type: "spring",
          bounce: 0.3,
          duration: 1,
        },
      },
    },
  };

  return (
    <div className="flex w-full flex-col bg-background text-foreground">
      <Header />

      {/* Upper Hero Section */}
      <div className="relative grid grid-cols-[50px_1fr_50px] max-sm:grid-cols-[30px_1fr_30px]">
        <div className="relative overflow-hidden border-r border-border">
          <StarBorder />
        </div>
        <div className="overflow-hidden">
          <div className="relative h-10 border-b border-border">
            <StarBorder />
          </div>
          <AnimatedGroup
            className="flex flex-col items-center px-6 py-8 text-center will-change-transform md:py-12"
            variants={transitionVariants}
          >
            {/* Announcement Chip */}
            <Link
              href="https://github.com/VA5UDEV/vault"
              className="group mb-8 inline-flex items-center gap-2 rounded-none border border-foreground/40 border-dashed py-1 pl-1 pr-2"
            >
              <span className="bg-muted text-muted-foreground group-hover:bg-primary/90 group-hover:text-primary-foreground py-0 px-2 text-sm transition-colors">
                OSS
              </span>
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                View on GitHub
              </span>

              <ArrowRight className="size-3 text-muted-foreground transition-all group-hover:text-foreground" />
            </Link>

            {/* Hero Text */}
            <h1 className="mb-3 text-3xl font-semibold tracking-tighter text-foreground md:mb-5 md:text-5xl">
              Encrypted Cloud For Your <br className="hidden md:block" />
              Environment Variables
            </h1>

            {/* Sub Heading */}
            <p className="mb-4 max-w-[400px] text-center text-sm text-muted-foreground md:mb-5 md:max-w-lg md:text-lg md:leading-relaxed">
              Securely store, sync, and manage environment variables across all
              your projects and teams with enterprise-grade encryption
            </p>

            {/* Two CTA Buttons */}
            <div className="mb-10 flex flex-row gap-4">
              <Button
                asChild
                variant="default"
                className="min-w-[100px] rounded-none md:min-w-[200px]"
              >
                <Link href="/auth/login-or-create-account">Get Started</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="min-w-[100px] rounded-none md:min-w-[200px]"
              >
                <Link href="https://github.com/VA5UDEV/vault">Self Host</Link>
              </Button>
            </div>
          </AnimatedGroup>
          <div className="relative h-10 border-t border-border">
            <StarBorder />
          </div>
        </div>
        <div className="relative overflow-hidden border-l border-border">
          <StarBorder />
        </div>
      </div>
    </div>
  );
}
