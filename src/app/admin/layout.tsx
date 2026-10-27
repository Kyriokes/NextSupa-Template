import type { Metadata } from "next";
import { privateMetadata } from "@/lib/metadata";

// Panel del admin, fuera de los buscadores. Solo pone el título.
export const metadata: Metadata = privateMetadata("Administración");

export default function Layout({ children }: LayoutProps<"/admin">) {
  return children;
}
