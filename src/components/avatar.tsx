import Image from "next/image";
import { isAllowedPhotoUrl } from "@/modules/users/photo";

// Foto de perfil, o la inicial del nombre si no hay foto o viene de un
// dominio que next/image no acepta.
export function Avatar({ name, photoUrl, size }: { name: string; photoUrl: string | null | undefined; size: number }) {
  if (isAllowedPhotoUrl(photoUrl, process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")) {
    return <Image src={photoUrl} alt="" width={size} height={size} className="rounded-full" />;
  }
  return (
    <span
      className="flex items-center justify-center rounded-full bg-muted font-medium"
      style={{ width: size, height: size, fontSize: size * 0.45 }}
      aria-hidden
    >
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}
