"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

type AnimateInViewProps = {
  children: ReactNode;
  /** CSS animation class when in view (e.g. animate-fade-in-up, animate-scale-in) */
  className?: string;
  /** Delay in ms before applying animation (for stagger) */
  delay?: number;
  /** Root margin for Intersection Observer (e.g. "0px 0px -80px 0px" to trigger earlier) */
  rootMargin?: string;
};

export function AnimateInView({
  children,
  className = "animate-fade-in-up",
  delay = 0,
  rootMargin = "0px 0px 0px 0px",
}: AnimateInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
        } else {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay, rootMargin]);

  const style = delay && isVisible ? { animationDelay: `${delay}ms` } : undefined;

  return (
    <div
      ref={ref}
      className={isVisible ? className : "opacity-0"}
      style={style}
    >
      {children}
    </div>
  );
}
