import { AboutUsSection } from "../modules/home/components/aboutUsSection";
import { BackToTopButton } from "../modules/home/components/backToTopButton";
import { HeroSection } from "../modules/home/components/heroSection";
import { HowItWorksSection } from "../modules/home/components/howItWorksSection";
import { RecommenderSection } from "../modules/recommender/components/recommenderSection";

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <HowItWorksSection />
            <RecommenderSection />
            <AboutUsSection />
            <BackToTopButton />
        </>
    );
}
