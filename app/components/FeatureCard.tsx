import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

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
    <Card className="space-y-4">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-(--accent)/10 border border-(--accent) flex items-center justify-center text-(--accent) text-xl">
            {icon}
          </div>
          <CardTitle className="text-2xl font-bold text-(--accent)">
            {title}
          </CardTitle>
        </div>
        <CardDescription className="text-(--text-secondary)">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-(--text-muted)">
          {items.map((item, index) => (
            <li key={index}>
              <span className="text-(--accent)">•</span> {item}
            </li>
          ))}
        </ul>
        {codeExample && <div>{codeExample}</div>}
        {footer && <p className="text-(--text-secondary)">{footer}</p>}
      </CardContent>
    </Card>
  );
}
