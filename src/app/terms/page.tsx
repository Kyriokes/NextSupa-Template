import { ContentPage, contentPageMetadata } from "@/components/content-page";

export const generateMetadata = () => contentPageMetadata("terms");

// Términos y condiciones. El texto se edita en /admin/content.
export default function TermsPage() {
  return <ContentPage slug="terms" />;
}
