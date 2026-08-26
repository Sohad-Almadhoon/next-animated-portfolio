import PortfolioClient from "@/components/portfolio/portfolioClient";
import { getProjects } from "@/lib/portfolio";

// Server component: screenshots (and their real dimensions) are read from
// public/portfolio/<slug>/ at build time, so adding images to a folder is
// enough — no code change needed.
const PortfolioPage = async () => (
  <PortfolioClient projects={await getProjects()} />
);

export default PortfolioPage;
