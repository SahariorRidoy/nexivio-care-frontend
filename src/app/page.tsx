import HeroBanner from "@/components/home/HeroBanner";
import QuickServices from "@/components/home/QuickServices";
import NoticeBoard from "@/components/home/NoticeBoard";
import MainServices from "@/components/home/MainServices";
import HomeMiddleSection from "@/components/home/HomeMiddleSection";
import HomeGallery from "@/components/home/HomeGallery";
import HomeBottomSection from "@/components/home/HomeBottomSection";
import ContactCTA from "@/components/home/ContactCTA";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <QuickServices />
      <NoticeBoard />
      <MainServices />
      <HomeMiddleSection />
      <HomeGallery />
      <HomeBottomSection />
      <ContactCTA />
    </>
  );
}
