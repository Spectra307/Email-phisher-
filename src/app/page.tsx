import React from 'react';
import EmailAnalyzer from '@/components/EmailAnalyzer';
import AnalysisResults from '@/components/AnalysisResults';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// Place the interface definitions here:
interface Indicator {
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface AnalysisResultsType {
  riskScore: number;
  indicators: Indicator[];
  recommendations: string[];
  highlightedContent: string;
}
export default function Home() {
  const [emailContent, setEmailContent] = React.useState('');
  const [analysisResults, setAnalysisResults] = React.useState(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const handleAnalyzeEmail = async (content: string) => {
    setIsAnalyzing(true);
    setEmailContent(content);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock analysis results
      const mockResults = {
        riskScore: 78,
        indicators: [
          { name: 'Urgent Language', severity: 'high', description: 'Email contains urgent action phrases like "immediate action required"' },
          { name: 'Suspicious Links', severity: 'critical', description: 'Contains links that don\'t match their displayed text' },
          { name: 'Grammar Errors', severity: 'medium', description: 'Multiple grammar and spelling errors detected' },
          { name: 'Request for Personal Information', severity: 'high', description: 'Email asks for sensitive personal information' },
          { name: 'Mismatched Sender', severity: 'medium', description: 'Sender email doesn\'t match the claimed organization' }
        ],
        recommendations: [
          'Do not click on any links in this email',
          'Do not reply with any personal information',
          'Report this email to your IT department',
          'Block the sender in your email client'
        ],
        highlightedContent: content
      };
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-12 bg-background">
      <Card className="w-full max-w-6xl bg-card">
        <CardHeader className="text-center border-b pb-6">
          <CardTitle className="text-3xl font-bold text-primary">Real-Time Phishing Email Detector</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Analyze email content to identify potential phishing attempts and get security recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <EmailAnalyzer onAnalyze={handleAnalyzeEmail} isAnalyzing={isAnalyzing} />
          
          {analysisResults && (
            <div className="mt-8">
              <AnalysisResults 
                results={analysisResults} 
                emailContent={emailContent} 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
