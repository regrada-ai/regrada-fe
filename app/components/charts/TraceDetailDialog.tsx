"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TraceRecord } from "../../data/dashboard";

interface TraceDetailDialogProps {
  trace: TraceRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TraceDetailDialog({
  trace,
  open,
  onOpenChange,
}: TraceDetailDialogProps) {
  if (!trace) return null;

  const latency = trace.metrics.latency_ms || 0;
  const totalTokens = (trace.metrics.tokens_in || 0) + (trace.metrics.tokens_out || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Trace Details
            <Badge variant="outline">
              {trace.provider}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            ID: {trace.trace_id} • {new Date(trace.timestamp).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Metrics Overview */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-(--text-muted)">
                  Latency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-accent">
                  {latency}ms
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-(--text-muted)">
                  Total Tokens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-accent">
                  {totalTokens.toLocaleString()}
                </p>
                <div className="mt-1 flex gap-2 text-xs text-(--text-muted)">
                  <span>In: {trace.metrics.tokens_in || 0}</span>
                  <span>Out: {trace.metrics.tokens_out || 0}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-(--text-muted)">
                  Model
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-(--text-primary)">
                  {trace.model || "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-start gap-3 border-b border-(--border-color) pb-2">
                  <span className="text-sm font-semibold text-(--text-secondary) min-w-30">
                    Provider:
                  </span>
                  <span className="text-sm text-(--text-primary)">
                    {trace.provider}
                  </span>
                </div>
                {trace.environment && (
                  <div className="flex items-start gap-3 border-b border-(--border-color) pb-2">
                    <span className="text-sm font-semibold text-(--text-secondary) min-w-30">
                      Environment:
                    </span>
                    <span className="text-sm text-(--text-primary)">
                      {trace.environment}
                    </span>
                  </div>
                )}
                {trace.git_sha && (
                  <div className="flex items-start gap-3 border-b border-(--border-color) pb-2">
                    <span className="text-sm font-semibold text-(--text-secondary) min-w-30">
                      Git SHA:
                    </span>
                    <code className="text-sm text-accent">
                      {trace.git_sha.slice(0, 7)}
                    </code>
                  </div>
                )}
                {trace.tags && trace.tags.length > 0 && (
                  <div className="flex items-start gap-3 pb-2">
                    <span className="text-sm font-semibold text-(--text-secondary) min-w-30">
                      Tags:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {trace.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
