import AboutClient from "@/components/about/aboutClient";
import { getCvHref } from "@/lib/cv";

const AboutPage = () => <AboutClient cvHref={getCvHref()} />;

export default AboutPage;
