import React, { useEffect, useRef, useState } from "react";

export default function AnimatedBackground({ type = "first" }) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);

  // smoothing for parallax
  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  const [hasVideos, setHasVideos] = useState(true);

  const mapping = {
    first: ["first_layer0.mp4"],
    clear: ["sunny_layer1.mp4", "sunny_layer2.mp4", "sunny_layer3.mp4"],
    cloud: ["cloud_layer1.mp4", "cloud_layer2.mp4", "cloud_layer3.mp4"],
    rain: ["rain_layer1.mp4", "rain_layer2.mp4", "rain_layer3.mp4"],
    snow: ["snow_layer1.mp4", "snow_layer2.mp4", "snow_layer3.mp4"],
    thunder: ["thunder_layer1.mp4", "thunder_layer2.mp4", "thunder_layer3.mp4"],
    fog: ["fog_layer1.mp4", "fog_layer2.mp4", "fog_layer3.mp4"],
  };

  const layerFiles = mapping[type] || mapping["first"];

  /* ---------------------------
      CHECK IF VIDEOS EXIST
  --------------------------- */
  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch(`/videos/${layerFiles[0]}`, { method: "HEAD" });
        if (!cancelled) setHasVideos(res.ok);
      } catch {
        setHasVideos(false);
      }
    }

    check();
    return () => (cancelled = true);
  }, [type]);

  /* ---------------------------
      MOUSE + TOUCH PARALLAX
  --------------------------- */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function pointer(e) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRef.current.x = x * 18;
      targetRef.current.y = y * 10;
    }

    function touch(e) {
      const t = e.touches?.[0];
      if (!t) return;
      const rect = container.getBoundingClientRect();
      const x = (t.clientX - rect.left) / rect.width - 0.5;
      const y = (t.clientY - rect.top) / rect.height - 0.5;
      targetRef.current.x = x * 18;
      targetRef.current.y = y * 10;
    }

    function reset() {
      targetRef.current.x = 0;
      targetRef.current.y = 0;
    }

    container.addEventListener("pointermove", pointer);
    container.addEventListener("pointerleave", reset);
    window.addEventListener("touchmove", touch, { passive: true });
    window.addEventListener("touchend", reset);

    return () => {
      container.removeEventListener("pointermove", pointer);
      container.removeEventListener("pointerleave", reset);
      window.removeEventListener("touchmove", touch);
      window.removeEventListener("touchend", reset);
    };
  }, []);

  /* ---------------------------
      SMOOTHING / RAF LOOP
  --------------------------- */
  useEffect(() => {
    function animate() {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.12;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.12;

      if (containerRef.current) {
        containerRef.current.style.setProperty(
          "--parallax-x",
          `${posRef.current.x.toFixed(2)}px`
        );
        containerRef.current.style.setProperty(
          "--parallax-y",
          `${posRef.current.y.toFixed(2)}px`
        );
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ---------------------------
      RENDER
  --------------------------- */
  return (
    <div
      ref={containerRef}
      className="bg-video-container"
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      {hasVideos ? (
        <>
          <video
            className="bg-video layer layer-1"
            src={`/videos/${layerFiles[0]}`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />

          <video
            className="bg-video layer layer-2"
            src={`/videos/${layerFiles[1]}`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />

          <video
            className="bg-video layer layer-3"
            src={`/videos/${layerFiles[2]}`}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
        </>
      ) : (
        <div className={`bg-gradient-fallback bg-${type}`}></div>
      )}
    </div>
  );
}
