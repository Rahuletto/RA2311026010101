"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./RocketBlast.module.css";

const FPS = 30;

const RocketBlast = () => {
  const [frames, setFrames] = useState<string[]>([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    fetch("/assets/data/rocket-ascii.json")
      .then((res) => res.json())
      .then((data) => setFrames(data))
      .catch((err) => console.error("Failed to load ASCII frames:", err));
  }, []);

  const updateScale = useCallback(() => {
    const outer = outerRef.current;
    const pre = preRef.current;
    if (!outer || !pre) return;

    const cw = outer.clientWidth;
    const ch = outer.clientHeight;
    if (cw < 4 || ch < 4) return;

    const pw = pre.scrollWidth;
    const ph = pre.scrollHeight;
    if (pw < 1 || ph < 1) return;

    const next = Math.min(cw / pw, ch / ph, 1) * 0.96;
    setScale((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
  }, []);

  useLayoutEffect(() => {
    if (frames.length === 0) return;
    const run = () => updateScale();
    run();
    requestAnimationFrame(() => requestAnimationFrame(run));
  }, [currentFrame, frames.length, updateScale]);

  useEffect(() => {
    if (frames.length === 0) return;
    const outer = outerRef.current;
    if (!outer) return;

    const ro = new ResizeObserver(() =>
      requestAnimationFrame(() => updateScale())
    );
    ro.observe(outer);
    return () => ro.disconnect();
  }, [frames.length, updateScale]);

  useEffect(() => {
    if (frames.length === 0) return;
    const el = containerRef.current;
    if (!el) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isVisible = false;

    const start = () => {
      if (intervalId) return;
      intervalId = setInterval(() => {
        setCurrentFrame((prev) => (prev + 1) % frames.length);
      }, 1000 / FPS);
    };

    const stop = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) start();
      else stop();
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [frames.length]);

  if (frames.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Establishing Satellite Link...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={outerRef} className={styles.asciiOuter}>
        <div className={styles.asciiInner}>
          <pre
            ref={preRef}
            className={styles.ascii}
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center center",
            }}
          >
            {frames[currentFrame]}
          </pre>
        </div>
      </div>
      <div className={styles.gradient} aria-hidden />
      <div className={styles.vignette} aria-hidden />
    </div>
  );
};

export default RocketBlast;
