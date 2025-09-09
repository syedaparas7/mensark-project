import CategoriesPage from "./categories/page";
import FeaturedProducts from "./featuredproduct/page";
import HeroSectionPage from "./herosection/page";
import Testimonials from "./testimonials/page";
import VideoPage from "./video/page";

export default function Home() {
  return (
    <>
    <HeroSectionPage />
    <CategoriesPage />
    <FeaturedProducts />
    <VideoPage />
    <Testimonials />
    </>
  );
}
