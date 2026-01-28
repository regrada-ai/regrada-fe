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
import TestResultsChart from "./TestResultsChart";
import { TestRunRecord } from "../../data/dashboard";

interface TestRunDetailDialogProps {
  testRun: TestRunRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TestRunDetailDialog({
  testRun,
  open,
  onOpenChange,
}: TestRunDetailDialogProps) {
  if (!testRun) return null;

  const statusVariant = testRun.status === "passed"
    ? "status-success"
    : testRun.status === "failed"
    ? "status-error"
    : "status-warning";

  const passRate = testRun.total_cases > 0
    ? Math.round((testRun.passed_cases / testRun.total_cases) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Test Run Details
            <Badge variant={statusVariant as any}>
              {testRun.status || "unknown"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            ID: {testRun.run_id} • {new Date(testRun.timestamp).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Metrics Overview */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-(--text-muted)">
                  Total Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-accent">
                  {testRun.total_cases}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-(--text-muted)">
                  Pass Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-(--status-success)">
                  {passRate}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-(--text-muted)">
                  Violations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-(--error)">
                  {testRun.violations?.length || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Git Info */}
          {(testRun.git_sha || testRun.git_branch) && (
            <Card>
              <CardHeader>
                <CardTitle>Git Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {testRun.git_branch && (
                  <div className="flex gap-2">
                    <span className="text-sm font-semibold text-(--text-secondary)">
                      Branch:
                    </span>
                    <span className="text-sm text-(--text-primary)">
                      {testRun.git_branch}
                    </span>
                  </div>
                )}
                {testRun.git_sha && (
                  <div className="flex gap-2">
                    <span className="text-sm font-semibold text-(--text-secondary)">
                      Commit:
                    </span>
                    <code className="text-sm text-accent">
                      {testRun.git_sha.slice(0, 7)}
                    </code>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Results Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Results Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <TestResultsChart
                passed={testRun.passed_cases}
                warning={testRun.warned_cases}
                failed={testRun.failed_cases}
              />
            </CardContent>
          </Card>

          {/* Policy Violations */}
          {testRun.violations && testRun.violations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Policy Violations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {testRun.violations.map((violation, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-(--error) bg-(--status-error-bg) p-3"
                    >
                      <div className="flex items-start gap-2">
                        <Badge variant="status-error" className="text-xs">
                          {violation.severity}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-sm text-(--error)">
                            {violation.message}
                          </p>
                          <p className="mt-1 text-xs text-(--text-muted)">
                            Policy: {violation.policy_id}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
