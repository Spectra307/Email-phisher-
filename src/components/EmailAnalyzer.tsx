"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface EmailAnalyzerProps {
  onAnalyze: (emailContent: string) => void;
}

const EmailAnalyzer = ({ onAnalyze = () => {} }: EmailAnalyzerProps) => {
  const [emailContent, setEmailContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const placeholderText = `Paste your suspicious email here...

Example:
Subject: URGENT: Your account has been compromised
From: security-alert@g00gle-security.com

Dear Valued Customer,

We have detected unusual activity on your account. Your account will be suspended in 24 hours unless you verify your information immediately by clicking the link below:

http://security-google.com.verify.suspicious-domain.com/verify

Regards,
Security Team`;

  const handleAnalyze = () => {
    if (!emailContent.trim()) {
      setError("Please enter email content to analyze");
      return;
    }

    setError("");
    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      onAnalyze(emailContent);
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Email Content Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Textarea
          placeholder={placeholderText}
          className="min-h-[200px] font-mono text-sm"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleAnalyze} disabled={isAnalyzing} className="px-6">
          {isAnalyzing ? "Analyzing..." : "Analyze Email"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailAnalyzer;
