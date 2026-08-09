import { Container } from "lucide-react";
import Link from "next/link";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <span className={`${className}`}>
      <Link href="/" className="flex items-center gap-1">
        <Container className="h-7 w-7 mr-1" />
        <span className="text-3xl font-bold tracking-tight">Vault</span>
      </Link>
    </span>
  );
};
