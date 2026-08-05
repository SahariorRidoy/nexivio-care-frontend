import HeroBanner from "@/components/home/HeroBanner";
import HomeMiddleSection from "@/components/home/HomeMiddleSection";
import HomeBottomSection from "@/components/home/HomeBottomSection";
import HomeTeam from "@/components/home/HomeTeam";
import PaymentInfo from "@/components/home/PaymentInfo";
import ContactCTA from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <HomeMiddleSection />
      <HomeBottomSection />
      <HomeTeam />
      <PaymentInfo />
      <ContactCTA />
    </>
  );
}
