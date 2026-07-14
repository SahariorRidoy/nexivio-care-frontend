import Header from "./Header";
import Footer from "./Footer";
import FloatingButtons from "@/components/shared/FloatingButtons";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
