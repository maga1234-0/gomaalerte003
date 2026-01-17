"use client";

import { useState, useTransition } from "react";
import type { Alert } from "@/lib/types";
import { AlertCard } from "../alert-card";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Bot, Check, ShieldCheck, X } from "lucide-react";
import { approveReport, rejectReport, runReportAnalysis } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface PendingReportCardProps {
  alert: Alert;
}

type AnalysisResult = {
  isPotentiallyFake: boolean;
  reason: string;
} | null;

export function PendingReportCard({ alert }: PendingReportCardProps) {
  const [isApprovePending, startApproveTransition] = useTransition();
  const [isRejectPending, startRejectTransition] = useTransition();
  const [isAnalyzing, startAnalysisTransition] = useTransition();
  const [analysis, setAnalysis] = useState<AnalysisResult>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const { toast } = useToast();

  const handleApprove = () => {
    startApproveTransition(async () => {
      await approveReport(alert.id);
      toast({ title: "Alert Approved", description: `"${alert.title}" is now public.` });
    });
  };

  const handleReject = () => {
    startRejectTransition(async () => {
      await rejectReport(alert.id);
      toast({ title: "Alert Rejected", description: `"${alert.title}" has been archived.` });
    });
  };

  const handleAnalysis = () => {
    startAnalysisTransition(async () => {
      setAnalysis(null);
      setAnalysisError(null);
      const result = await runReportAnalysis(alert.title, alert.description);
      if (result.data) {
        setAnalysis(result.data);
      } else {
        setAnalysisError(result.error || "An unknown error occurred.");
      }
    });
  };

  return (
    <div className="group">
      <AlertCard alert={alert} />
      <Card className="rounded-t-none border-t-0 -mt-2">
        <CardContent className="pt-4 space-y-4">
          <Separator />
          <div className="flex items-center gap-2">
            <Button onClick={handleAnalysis} disabled={isAnalyzing} size="sm">
              <Bot className="mr-2 h-4 w-4" />
              {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
            </Button>
            {analysis && (
              <div className="flex items-center gap-2 text-sm">
                {analysis.isPotentiallyFake ? (
                  <>
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <span className="font-semibold text-destructive">Potential Fake/Duplicate</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-600">Looks Genuine</span>
                  </>
                )}
              </div>
            )}
             {analysisError && <p className="text-sm text-destructive">{analysisError}</p>}
          </div>

          {analysis && (
            <div className="p-3 bg-muted/50 rounded-md text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">AI Reason:</strong> {analysis.reason}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isRejectPending || isApprovePending}
            size="sm"
          >
            <X className="mr-2 h-4 w-4" />
            {isRejectPending ? "Rejecting..." : "Reject"}
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleApprove}
            disabled={isApprovePending || isRejectPending}
            size="sm"
          >
            <Check className="mr-2 h-4 w-4" />
            {isApprovePending ? "Approving..." : "Approve"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
