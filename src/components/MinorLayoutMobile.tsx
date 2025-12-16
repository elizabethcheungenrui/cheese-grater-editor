import "./MinorLayoutMobile.css"

import type { HomepageSection } from "../api/getHomepageSection";

export default function MinorLayoutMobile({ data }: { data: HomepageSection }) {
  return (
    <div className={`minor-layout minor-layout-${data.section}`}>
      <p>Hi</p> 
    </div>
  );
}
