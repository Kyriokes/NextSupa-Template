import { ContentPage, contentPageMetadata } from "@/components/content-page";

export const generateMetadata = () => contentPageMetadata("faq");

// Preguntas frecuentes. El texto se edita en /admin/content.
export default function FaqPage() {
  return <ContentPage slug="faq" />;
}
