"use client";
import { Container } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/ui/framed-section";
import StarBorder from "@/components/ui/star-border";

const VaultLogo = ({ className }: { className?: string }) => {
  return (
    <span className={`flex items-center gap-1 ${className}`}>
      <Container className="h-5 w-5" />
      <span className="text-2xl font-bold tracking-tight">Vault</span>
    </span>
  );
};

export default function Footer() {
  return (
    <>
      <SectionHeader label="Footer" />
      <div className="grid w-full grid-cols-1 border-b border-border sm:grid-cols-[auto_1fr]">
        <div className="grid grid-rows border-b border-r-0 border-border sm:border-b-0 sm:border-r">
          <div className="relative overflow-hidden">
            <div className="p-6 flex flex-col justify-center">
              <div className="flex items-center pb-2">
                <StarBorder />
                <VaultLogo className="w-auto" />
              </div>
              <div className="text-xs text-muted-foreground">
                <div className="text-sm">
                  Encrypted cloud for your environment variables. <br /> Secure,
                  self-hostable, and team-ready.
                </div>
                <div className="mt-3 flex flex-wrap gap-2 pb-2">
                  <Button asChild size="sm" className="rounded-none">
                    <Link href="/auth/login-or-create-account">
                      Get Started
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="rounded-none"
                  >
                    <Link href="https://github.com/VA5UDEV/vault">
                      Self Host
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex items-center justify-center overflow-hidden border-b border-border p-6 text-muted max-sm:p-3">
          <StarBorder />
          <span className="font-pixelify text-[15vw] font-bold leading-none tracking-tighter sm:text-[6vw]">
            VAULT
          </span>
        </div>
      </div>
      <motion.div
        className="relative h-12 w-full border-y border-border bg-[repeating-linear-gradient(315deg,currentColor_0,currentColor_1px,transparent_0,transparent_50%)] opacity-10"
        style={{ backgroundSize: "10px 10px" }}
        animate={{ backgroundPositionX: "10px" }}
        transition={{ ease: "linear", duration: 0.25, repeat: Infinity }}
      />
    </>
  );
}
