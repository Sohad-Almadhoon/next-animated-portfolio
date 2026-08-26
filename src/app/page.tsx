import Hero from "@/components/home/hero";
import { getCvHref } from "@/lib/cv";

const HomePage = () => <Hero cvHref={getCvHref()} />;

export default HomePage;
