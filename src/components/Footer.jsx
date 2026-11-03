import { useRef } from "react";
import { couple } from "../weddingData.js";
import { useReveal } from "../hooks/useReveal.js";
import { useSectionScale } from "../hooks/useSectionScale.js";

export default function Footer() {
  const namesRef = useReveal(0.3);
  const dateRef = useReveal(0.3);
  const groupRef = useRef(null);
  const { containerRef } = useSectionScale({
    scaleRef: groupRef,
    fadeEnd: 0,
    speed: 0.002,
    fillRatio: 0.96,
    isFirst: false,
    transformOrigin: "center center",
  });

  return (
    <footer className="footer" ref={containerRef}>
      <div className="footer-scale-group" ref={groupRef}>
        <p className="footer-names footer-shimmer" ref={namesRef}>
          {couple.groom.shortName} <br />
          &amp;
          <br /> {couple.bride.shortName}
        </p>
        <p className="footer-date reveal-fade-up" ref={dateRef}>
          24 November 2026
        </p>
        <p className="footer-made">Made with ♥ for our special day</p>
      </div>
    </footer>
  );
}
