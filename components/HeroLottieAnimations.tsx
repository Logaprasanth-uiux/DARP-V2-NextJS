'use client';

import React, { useEffect, useRef } from 'react';
import currencypic from '@/assets/animations/currencypic.json';
import currencypicInv from '@/assets/animations/currencypic-inv.json';

interface HeroLottieAnimationsProps {
  classLeft: string;
  classRight: string;
}

export default function HeroLottieAnimations({ classLeft, classRight }: HeroLottieAnimationsProps) {
  const leftContainerRef = useRef<HTMLDivElement>(null);
  const rightContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    let animLeft: any = null;
    let animRight: any = null;

    // Detect OS preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Client-side dynamic import of lottie-web
    import('lottie-web').then((lottieModule) => {
      if (!active) return;

      const lottie = lottieModule.default;

      if (leftContainerRef.current) {
        leftContainerRef.current.innerHTML = '';
        animLeft = lottie.loadAnimation({
          container: leftContainerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: !prefersReducedMotion,
          animationData: currencypic,
        });
      }

      if (rightContainerRef.current) {
        rightContainerRef.current.innerHTML = '';
        animRight = lottie.loadAnimation({
          container: rightContainerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: !prefersReducedMotion,
          animationData: currencypicInv,
        });
      }
    }).catch((err) => {
      console.error('Failed to load lottie-web:', err);
    });

    // Cleanup animations on unmount to prevent memory leaks
    return () => {
      active = false;
      if (animLeft) {
        animLeft.destroy();
      }
      if (animRight) {
        animRight.destroy();
      }
    };
  }, []);

  return (
    <>
      <div ref={leftContainerRef} className={classLeft} aria-hidden="true" />
      <div ref={rightContainerRef} className={classRight} aria-hidden="true" />
    </>
  );
}
