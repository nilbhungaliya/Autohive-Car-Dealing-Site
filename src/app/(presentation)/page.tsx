import { FeatureSection } from "@/components/homePage/feature-section";
import { HeroSection } from "@/components/homePage/hero-section";
import { LatestArrivals } from "@/components/homePage/latest-arrivals";
import { OurBrandsSection } from "@/components/homePage/our-brands-section";
import { PageProps } from "@/config/types";

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;

  return (
    <div className="w-full min-h-screen bg-background text-black">
      <HeroSection searchParams={searchParams} />
      <FeatureSection />
      <LatestArrivals />
      <OurBrandsSection />
    </div>
  );
}
