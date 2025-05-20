"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Info,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface PhishingIndicator {
  name: string;
  severity: "high" | "medium" | "low" | "safe";
  description: string;
}

interface SuspiciousElement {
  text: string;
  reason: string;
  type: "link" | "text" | "sender" | "attachment";
  position: [number, number]; // start and end index in the email content
}

interface Recommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface AnalysisResultsProps {
  emailContent: string;
  riskScore: number;
  phishingIndicators: PhishingIndicator[];
  suspiciousElements: SuspiciousElement[];
  recommendations: Recommendation[];
  isLoading?: boolean;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  emailContent = "",
  riskScore = 65,
  phishingIndicators = [
    {
      name: "Urgent Language",
      severity: "high",
      description:
        "Email uses urgent language to pressure the recipient into taking immediate action.",
    },
    {
      name: "Suspicious Links",
      severity: "high",
      description:
        "Links in the email point to domains that don't match the claimed sender.",
    },
    {
      name: "Spelling Errors",
      severity: "medium",
      description:
        "Multiple spelling and grammar errors detected, common in phishing attempts.",
    },
    {
      name: "Requesting Personal Information",
      severity: "high",
      description:
        "Email asks for sensitive personal information like passwords or credit card details.",
    },
    {
      name: "Legitimate Branding",
      severity: "safe",
      description: "Email contains some legitimate branding elements.",
    },
  ],
  suspiciousElements = [
    {
      text: "Click here to verify your account immediately",
      reason: "Urgent language and suspicious link",
      type: "link",
      position: [120, 160],
    },
    {
      text: "Your account will be suspended in 24 hours",
      reason: "False urgency to pressure action",
      type: "text",
      position: [50, 90],
    },
    {
      text: "security@paypa1.com",
      reason: "Lookalike domain (number '1' instead of letter 'l')",
      type: "sender",
      position: [10, 30],
    },
    {
      text: "attachment.pdf.exe",
      reason: "Suspicious file extension",
      type: "attachment",
      position: [200, 220],
    },
  ],
  recommendations = [
    {
      title: "Do Not Click Links",
      description:
        "Avoid clicking any links in this email. Instead, go directly to the official website by typing the URL in your browser.",
      priority: "high",
    },
    {
      title: "Do Not Download Attachments",
      description:
        "The attachment in this email has a suspicious extension and may contain malware.",
      priority: "high",
    },
    {
      title: "Report as Phishing",
      description:
        "Report this email as phishing to your email provider and IT department if applicable.",
      priority: "medium",
    },
    {
      title: "Verify Sender",
      description:
        "Contact the supposed sender through official channels to verify if they sent this email.",
      priority: "medium",
    },
  ],
  isLoading = false,
}) => {
  // Function to get color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-blue-500 text-white";
      case "safe":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Function to get icon based on severity
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-4 w-4" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4" />;
      case "low":
        return <Info className="h-4 w-4" />;
      case "safe":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  // Function to get color for risk score
  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return "bg-red-600";
    if (score >= 60) return "bg-orange-500";
    if (score >= 40) return "bg-yellow-500";
    if (score >= 20) return "bg-blue-500";
    return "bg-green-500";
  };

  // Function to highlight suspicious elements in email content
  const renderEmailWithHighlights = () => {
    if (!emailContent)
      return (
        <p className="text-muted-foreground">No email content to display</p>
      );

    // Sort suspicious elements by position to process them in order
    const sortedElements = [...suspiciousElements].sort(
      (a, b) => a.position[0] - b.position[0],
    );

    let lastIndex = 0;
    const result: JSX.Element[] = [];

    sortedElements.forEach((element, idx) => {
      // Add text before the suspicious element
      if (element.position[0] > lastIndex) {
        result.push(
          <span key={`text-${idx}`}>
            {emailContent.substring(lastIndex, element.position[0])}
          </span>,
        );
      }

      // Add the highlighted suspicious element with tooltip
      result.push(
        <TooltipProvider key={`highlight-${idx}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={`px-1 rounded ${
                  element.type === "link"
                    ? "bg-blue-200 dark:bg-blue-900"
                    : element.type === "sender"
                      ? "bg-purple-200 dark:bg-purple-900"
                      : element.type === "attachment"
                        ? "bg-red-200 dark:bg-red-900"
                        : "bg-yellow-200 dark:bg-yellow-900"
                } cursor-help`}
              >
                {emailContent.substring(
                  element.position[0],
                  element.position[1],
                )}
                {element.type === "link" && (
                  <ExternalLink className="inline h-3 w-3 ml-1" />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">
                {element.type.charAt(0).toUpperCase() + element.type.slice(1)}{" "}
                Issue
              </p>
              <p>{element.reason}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );

      lastIndex = element.position[1];
    });

    // Add any remaining text after the last suspicious element
    if (lastIndex < emailContent.length) {
      result.push(
        <span key="text-end">{emailContent.substring(lastIndex)}</span>,
      );
    }

    return <div className="whitespace-pre-wrap">{result}</div>;
  };

  if (isLoading) {
    return (
      <div className="w-full p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 bg-background">
      {/* Risk Assessment Meter */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Phishing Risk Score</span>
              <span className="text-sm font-bold">{riskScore}/100</span>
            </div>
            <Progress
              value={riskScore}
              className="h-3"
              indicatorClassName={getRiskScoreColor(riskScore)}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Safe</span>
              <span>Low Risk</span>
              <span>Medium Risk</span>
              <span>High Risk</span>
              <span>Critical</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different analysis sections */}
      <Tabs defaultValue="indicators" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="indicators">Phishing Indicators</TabsTrigger>
          <TabsTrigger value="preview">Email Preview</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        {/* Phishing Indicators Tab */}
        <TabsContent value="indicators" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Detected Phishing Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {phishingIndicators.map((indicator, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-3 border-b last:border-0"
                  >
                    <Badge
                      className={`${getSeverityColor(indicator.severity)} mt-0.5`}
                      variant="outline"
                    >
                      {getSeverityIcon(indicator.severity)}
                    </Badge>
                    <div>
                      <h4 className="font-medium">{indicator.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {indicator.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Interactive Email Preview</CardTitle>
              <p className="text-sm text-muted-foreground">
                Hover over highlighted elements to see why they're suspicious
              </p>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 bg-card">
                {renderEmailWithHighlights()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Security Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="pb-3 border-b last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        className={`${getSeverityColor(recommendation.priority)}`}
                      >
                        {recommendation.priority}
                      </Badge>
                      <h4 className="font-medium">{recommendation.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {recommendation.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisResults;
