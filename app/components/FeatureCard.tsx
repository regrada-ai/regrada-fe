import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

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
    <Card className="space-y-4 overflow-hidden h-full flex flex-col w-full">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-(--accent)/10 border border-(--accent) flex items-center justify-center text-(--accent) text-xl">
            {icon}
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold text-(--accent) break-words">
            {title}
          </CardTitle>
        </div>
        <CardDescription className="text-(--text-secondary) mt-3">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-(--text-muted) text-sm">
          {items.map((item, index) => (
            <li key={index} className="break-words">
              <span className="text-(--accent)">•</span> {item}
            </li>
          ))}
        </ul>
        {codeExample && <div className="overflow-x-auto">{codeExample}</div>}
        {footer && <p className="text-(--text-secondary) text-sm">{footer}</p>}
      </CardContent>
    </Card>
  );
}
