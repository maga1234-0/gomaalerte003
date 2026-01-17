'use server';

/**
 * @fileOverview A tool to analyze pending incident reports for potential fake or duplicate submissions.
 *
 * - analyzeReport - Analyzes an incident report for potential misinformation.
 * - AnalyzeReportInput - The input type for the analyzeReport function.
 * - AnalyzeReportOutput - The return type for the analyzeReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeReportInputSchema = z.object({
  title: z.string().describe('The title of the incident report.'),
  description: z.string().describe('The description of the incident report.'),
});

export type AnalyzeReportInput = z.infer<typeof AnalyzeReportInputSchema>;

const AnalyzeReportOutputSchema = z.object({
  isPotentiallyFake: z.boolean().describe('Whether the incident report is potentially fake or duplicate.'),
  reason: z.string().describe('The reason why the incident report is potentially fake or duplicate.'),
});

export type AnalyzeReportOutput = z.infer<typeof AnalyzeReportOutputSchema>;

export async function analyzeReport(input: AnalyzeReportInput): Promise<AnalyzeReportOutput> {
  return analyzeReportFlow(input);
}

const analyzeReportPrompt = ai.definePrompt({
  name: 'analyzeReportPrompt',
  input: {schema: AnalyzeReportInputSchema},
  output: {schema: AnalyzeReportOutputSchema},
  prompt: `You are an expert in identifying fake and duplicate incident reports.

  Analyze the following incident report and determine if it is potentially fake or a duplicate of another report. Provide a reason for your determination.

  Title: {{{title}}}
  Description: {{{description}}}

  Consider factors such as:
  - Use of sensational language
  - Inconsistencies in the report
  - Similarity to other recent reports
  - Lack of specific details
  - Source credibility (if available)
  - Keyword analysis to detect duplicated reports

  Output your analysis in JSON format.
`,
});

const analyzeReportFlow = ai.defineFlow(
  {
    name: 'analyzeReportFlow',
    inputSchema: AnalyzeReportInputSchema,
    outputSchema: AnalyzeReportOutputSchema,
  },
  async input => {
    const {output} = await analyzeReportPrompt(input);
    return output!;
  }
);
