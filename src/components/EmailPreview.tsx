"use client";

import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Card, CardContent } from "../components/ui/card";

interface SuspiciousElement {
  text: string;
  reason: string;
  severity: "low" | "medium" | "high";
  startIndex: number;
  endIndex: number;
}

interface EmailPreviewProps {
  emailContent: string;
  suspiciousElements?: SuspiciousElement[];
}

const EmailPreview = ({
  emailContent = "This is a sample email content. Please click on this link: http://suspicious-link.com to verify your account immediately or your account will be suspended.",
  suspiciousElements = [
    {
      text: "click on this link",
      reason: "Encouraging users to click on links is a common phishing tactic",
      severity: "medium",
      startIndex: 27,
      endIndex: 44,
    },
    {
      text: "http://suspicious-link.com",
      reason:
        "This URL appears to be suspicious and may lead to a phishing site",
      severity: "high",
      startIndex: 46,
      endIndex: 73,
    },
    {
      text: "immediately or your account will be suspended",
      reason:
        "Creating urgency is a common manipulation tactic in phishing emails",
      severity: "high",
      startIndex: 93,
      endIndex: 138,
    },
  ],
}: EmailPreviewProps) => {
  // Function to render email content with highlighted suspicious elements
  const renderEmailContent = () => {
    if (!suspiciousElements || suspiciousElements.length === 0) {
      return <p className="whitespace-pre-wrap">{emailContent}</p>;
    }

    // Sort suspicious elements by their start index to process them in order
    const sortedElements = [...suspiciousElements].sort(
      (a, b) => a.startIndex - b.startIndex,
    );

    const result: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedElements.forEach((element, idx) => {
      // Add text before the suspicious element
      if (element.startIndex > lastIndex) {
        result.push(
          <span key={`text-${idx}`}>
            {emailContent.substring(lastIndex, element.startIndex)}
          </span>,
        );
      }

      // Add the highlighted suspicious element with tooltip
      result.push(
        <TooltipProvider key={`tooltip-${idx}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={`cursor-help font-medium ${getSeverityColor(element.severity)}`}
              >
                {emailContent.substring(element.startIndex, element.endIndex)}
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                <strong>Issue:</strong> {element.reason}
              </p>
              <p className="mt-1">
                <strong>Severity:</strong> {element.severity}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>,
      );

      lastIndex = element.endIndex;
    });

    // Add any remaining text after the last suspicious element
    if (lastIndex < emailContent.length) {
      result.push(
        <span key="text-end">{emailContent.substring(lastIndex)}</span>,
      );
    }

    return <p className="whitespace-pre-wrap">{result}</p>;
  };

  // Helper function to get color based on severity
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500 bg-red-100 px-1 rounded";
      case "medium":
        return "text-orange-500 bg-orange-100 px-1 rounded";
      case "low":
        return "text-yellow-500 bg-yellow-100 px-1 rounded";
      default:
        return "";
    }
  };

  return (
    <Card className="w-full bg-white border-gray-200">
      <CardContent className="p-6">
        <div className="mb-4 pb-2 border-b border-gray-200">
          <h3 className="text-lg font-medium">Email Preview</h3>
          <p className="text-sm text-gray-500">
            Hover over highlighted text to see details about suspicious elements
          </p>
        </div>
        <div className="email-content text-sm">{renderEmailContent()}</div>
      </CardContent>
    </Card>
  );
};

export default EmailPreview;
