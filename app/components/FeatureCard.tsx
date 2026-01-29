// SPDX-License-Identifier: LicenseRef-Regrada-Proprietary
import React from "react";

export interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  items: string[];
  codeExample?: React.ReactNode;
  footer?: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  items,
  codeExample,
  footer,
}: FeatureCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-(--accent)/10 border border-(--accent) flex items-center justify-center text-(--accent) text-xl">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-(--accent)">
          {title}
        </h3>
      </div>
      <p className="text-(--text-secondary)">{description}</p>
      <ul className="space-y-2 text-(--text-muted)">
        {items.map((item, index) => (
          <li key={index}>
            <span className="text-(--accent)">•</span> {item}
          </li>
        ))}
      </ul>
      {codeExample && <div className="mt-4">{codeExample}</div>}
      {footer && <p className="text-(--text-secondary)">{footer}</p>}
    </div>
  );
}
