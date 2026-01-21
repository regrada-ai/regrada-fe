"use client";

import React, { useState, useEffect, useRef } from "react";

interface FlowStep {
  number: number;
  label: string;
  description: string;
  canFail?: boolean;
}

interface FlowDiagramProps {
  steps: FlowStep[];
}

export default function FlowDiagram({ steps }: FlowDiagramProps) {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => [...prev, index]);
              }, index * 600);
            });
          }
        });
      },
      { threshold: 0.2 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [steps, isVisible]);

  return (
    <div ref={containerRef}>
      {steps.map((step, index) => {
        const isStepVisible = visibleSteps.includes(index);
        const isLastStep = index === steps.length - 1;

        return (
          <div key={index} className="relative flex gap-4 min-h-35">
            {/* Left side: Circle and Line */}
            <div className="relative flex flex-col items-center">
              {/* Circle Number */}
              <div
                className={`shrink-0 h-12 w-12 rounded-full border-2 flex items-center justify-center text-xl font-bold transition-all duration-500 ${
                  isStepVisible
                    ? "border-(--accent) bg-(--accent)/10 text-(--accent) scale-100 opacity-100"
                    : "border-(--border-color) bg-transparent text-(--text-muted) scale-75 opacity-0"
                }`}
              >
                {step.number}
              </div>

              {/* Connecting Line (for non-branching steps) */}
              {!isLastStep && !step.canFail && (
                <div className="flex-1 w-0.5 mt-2 mb-2">
                  <div
                    className={`w-full h-full bg-(--accent) transition-all duration-500 delay-300 origin-top ${
                      isStepVisible
                        ? "scale-y-100 opacity-100"
                        : "scale-y-0 opacity-0"
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Right side: Step Text and Branch Outcomes */}
            <div className="flex-1 pt-2">
              {/* Step Text */}
              <div
                className={`transition-all duration-500 delay-200 ${
                  isStepVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-4"
                }`}
              >
                <p className="text-lg font-medium text-(--text-primary)">
                  {step.label}
                </p>
                <p className="text-sm text-(--text-secondary)">
                  {step.description}
                </p>
              </div>

              {/* Branch outcomes (only for canFail step) */}
              {step.canFail && (
                <div className="relative mt-8 space-y-6">
                  {/* Pass outcome */}
                  <div className="flex items-center">
                    <div
                      className={`flex items-center gap-3 transition-all duration-500 delay-700 ${
                        isStepVisible
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-4"
                      }`}
                    >
                      <div className="h-10 w-10 rounded-full bg-(--status-success-bg) border-2 border-(--status-success-border) flex items-center justify-center shrink-0">
                        <svg
                          className="h-6 w-6 text-(--status-success)"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base font-medium text-(--status-success)">
                          Tests Pass
                        </p>
                        <p className="text-sm text-(--status-success)">
                          All checks successful, ready to deploy
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Fail outcome */}
                  <div className="flex items-center">
                    <div
                      className={`flex items-center gap-3 transition-all duration-500 delay-900 ${
                        isStepVisible
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-4"
                      }`}
                    >
                      <div className="h-10 w-10 rounded-full bg-(--status-error-bg) border-2 border-(--status-error-border) flex items-center justify-center shrink-0">
                        <svg
                          className="h-6 w-6 text-(--status-error)"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-base font-medium text-(--status-error)">
                          Tests Fail
                        </p>
                        <p className="text-sm text-(--text-secondary)">
                          Regression detected, review changes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
