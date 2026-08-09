import Link from "next/link";
import { Button } from "@/components/ui/button";
import StarBorder from "@/components/ui/star-border";
import { ThemeChanger } from "@/components/ui/theme-changer";
import { Logo } from "./logo";

export default function Header() {
  return (
    <nav className="relative flex w-full items-center justify-between overflow-hidden border-b border-border px-6 py-4">
      <StarBorder />
      <Logo className="h-10 w-auto" />

      <div className="flex items-center gap-4">
        <ThemeChanger />
        <Button asChild className="rounded-none px-3 py-1">
          <Link href="/auth/login-or-create-account">Get Started</Link>
        </Button>
      </div>
    </nav>
  );
}