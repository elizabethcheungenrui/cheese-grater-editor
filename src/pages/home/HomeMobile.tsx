import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import "./HomeMobile.css";

import { useHomepageSection } from "../../hooks/useHomepageSection";

import MajorLayoutMobile from "../../components/MajorLayoutMobile";
import MinorLayoutMobile from "../../components/MinorLayoutMobile";

export default function HomeMobile() {
  const [active, setActive] = useState<"voices" | "investigations" | "humour">(
    "investigations"
  );

  const { data: voicesData, loading: voicesLoading } =
    useHomepageSection("Voices", 3);

  const { data: investigationsData, loading: investigationsLoading } =
    useHomepageSection("News", 3);

  const { data: humourData, loading: humourLoading } =
    useHomepageSection("Humour", 3);

  const spring = {
    type: "spring" as const,
    stiffness: 120,
    damping: 20,
  };

  if (voicesLoading || investigationsLoading || humourLoading) {
    return <div>Loading…</div>;
  }

  return (
    <div>
      <div className="home-grid-mobile">
        {/* VOICES COLUMN */}
        <motion.aside
          layout
          onMouseEnter={() => setActive("voices")}
          initial={{ flexGrow: 1 }}
          animate={{ flexGrow: active === "voices" ? 9 : 1 }}
          transition={spring}
        >
          <div className="ghost" />

          <AnimatePresence mode="wait">
            <motion.div
              layout
              key={active === "voices" ? "voices-major" : "voices-minor"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {active === "voices" ? (
                <MajorLayoutMobile data={voicesData!} />
              ) : (
                <MinorLayoutMobile data={voicesData!} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.aside>

        {/* INVESTIGATIONS COLUMN */}
        <motion.main
          layout
          onMouseEnter={() => setActive("investigations")}
          initial={{ flexGrow: 9 }}
          animate={{ flexGrow: active === "investigations" ? 9 : 1 }}
          transition={spring}
        >
          <div className="ghost" />

          <AnimatePresence mode="wait">
            <motion.div
              layout
              key={
                active === "investigations"
                  ? "investigations-major"
                  : "investigations-minor"
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {active === "investigations" ? (
                <MajorLayoutMobile data={investigationsData!} />
              ) : (
                <MinorLayoutMobile data={investigationsData!} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.main>

        {/* HUMOUR COLUMN */}
        <motion.aside
          layout
          onMouseEnter={() => setActive("humour")}
          initial={{ flexGrow: 1 }}
          animate={{ flexGrow: active === "humour" ? 9 : 1 }}
          transition={spring}
        >
          <div className="ghost" />

          <AnimatePresence mode="wait">
            <motion.div
              layout
              key={active === "humour" ? "humour-major" : "humour-minor"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {active === "humour" ? (
                <MajorLayoutMobile data={humourData!} />
              ) : (
                <MinorLayoutMobile data={humourData!} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.aside>
      </div>
    </div>
  );
}
