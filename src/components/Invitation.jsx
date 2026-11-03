import { useRef } from "react";
import { useReveal } from "../hooks/useReveal.js";
import { useSectionScale } from "../hooks/useSectionScale.js";

export default function Invitation() {
  const titleRef = useReveal(0.2);
  const textRef = useReveal(0.3);
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
    <section className="section invite" id="invite" ref={containerRef}>
      <div className="invite-scale-group" ref={groupRef}>
        <h2 className="section-title title-scale-reveal" ref={titleRef}>
          With <br />
          <span>Love &amp; Blessings</span>
        </h2>
        <p className="invite-text reveal reveal-ink" ref={textRef}>
          Your presence will make
          <br />
          our celebration complete.
          <br />
          We warmly invite you and
          <br /> your family to share in our joy.
        </p>
      </div>
    </section>
  );
}
