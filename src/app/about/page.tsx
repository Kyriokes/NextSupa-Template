import { ContentPage, contentPageMetadata } from "@/components/content-page";

export const generateMetadata = () => contentPageMetadata("about");

// Quiénes somos. El texto se edita en /admin/content.
export default function AboutPage() {
  return <ContentPage slug="about" />;
}
