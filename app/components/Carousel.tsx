"use client";

import React, { useState, useEffect, useCallback } from "react";

interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
}

export default function Carousel({
  children,
  autoPlay = false,
  interval = 5000,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? children.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === children.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [children.length, currentIndex, goToSlide]);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      goToNext();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, goToNext]);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="relative w-full">
      {/* Carousel Container */}
      <div className="overflow-x-hidden py-12">
        {isMobile ? (
          // Mobile: Simple centered layout with swipe
          <div
            className="px-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex gap-4 transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 1}rem))`,
              }}
            >
              {children.map((child, index) => {
                return (
                  <div key={index} className="shrink-0 w-full">
                    <div className="h-full rounded-2xl border border-(--border-color) bg-(--surface-bg) p-6 shadow-xl">
                      {child}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // Desktop: Side cards visible
          <div className="flex justify-start ml-[calc(50%-225px)]">
            <div
              className="flex gap-6 transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${currentIndex * 474}px)`,
              }}
            >
              {children.map((child, index) => {
                const isActive = index === currentIndex;

                return (
                  <div
                    key={index}
                    className={`shrink-0 w-112.5 transition-all duration-700 ${
                      isActive ? "opacity-100 scale-100" : "opacity-50 scale-95"
                    }`}
                    onClick={() => !isActive && goToSlide(index)}
                    style={{ cursor: !isActive ? "pointer" : "default" }}
                  >
                    <div
                      className={`h-full rounded-2xl border border-(--border-color) bg-(--surface-bg) p-8 transition-shadow duration-700 ${
                        isActive ? "shadow-2xl" : "shadow-lg"
                      }`}
                    >
                      {child}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-8 bg-(--accent)"
                : "w-2 bg-(--border-color) hover:bg-(--accent)/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
