import React, { useEffect } from "react";
import { App } from "@/components/NavWithCenteredLogo/App";
import { CardGrid } from "@/components/ShowcaseGrid/CardGrid";
import { NewArrival } from "@/components/NewArrival/NewArrival";
import { Trending } from "@/components/NewArrival/Trending";
import { MarketingSection } from "@/components/MarketingSection/MarketingSection";
import { SubscribeSletter } from "@/components/SubscribeSletter/SubscribeSletter";
import { TopBrands } from "@/components/TopBrands/TopBrands";
import { Footer } from "@/components/Footer/Footer";
import AdBanner from "@/components/BannerForAd";
import { Testimonial, TestimonialMobile } from "@/components/Testimonial/Testimonial";
import { TopBanner } from "@/components/NavWithCenteredLogo/TopBanner";
import { HomeCategories } from "@/components/HomeCategories/App";
import HomeCarousel from "@/components/HomeCarousel";
import useTranslation from "@/hooks/useTranslation";

const Homepage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    const UID = localStorage.getItem("userId");
    UID && localStorage.removeItem("cartData");
  }, [])

  return (<>
    <div>
      <TopBanner />
      <App />
      <HomeCarousel />
      <CardGrid />
      <NewArrival heading={t('Home.NewArrival')} />
      <Trending />
      <AdBanner />
      <HomeCategories />
      <MarketingSection />
      <NewArrival heading={t('Home.AllProduct')} />
      <Testimonial />
      <TestimonialMobile />
      <TopBrands />
      {/* <SubscribeSletter /> */}
      <Footer />
    </div>
  </>);
};

export default Homepage;
