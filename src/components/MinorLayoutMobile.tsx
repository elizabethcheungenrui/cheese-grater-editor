import "./MinorLayoutMobile.css"

import type { HomepageSection } from "../api/getHomepageSection";

export default function MinorLayoutMobile({ data }: { data: HomepageSection }) {
  return (
    <div className={`minor-layout-mobile minor-layout-${data.section}`}>
    </div>
  );
}
