'use server';
/**
 * @fileOverview A Genkit flow for matching student/worker profiles to job postings.
 *
 * - matchCandidatesToJobs - A function that handles the candidate matching process.
 * - MatchCandidatesToJobsInput - The input type for the matchCandidatesToJobs function.
 * - MatchCandidatesToJobsOutput - The return type for the matchCandidatesToJobs function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CandidateProfileSchema = z.object({
  studentId: z.string().describe('The unique identifier for the student/worker.'),
  fullName: z.string().describe('The full name of the candidate.'),
  education: z.string().describe('The education background of the candidate.'),
  skills: z.array(z.string()).describe('A list of skills possessed by the candidate.'),
  experienceYears: z.number().describe('Years of relevant work experience.'),
  profileCompletionPercentage: z.number().describe('The completion percentage of the candidate profile.'),
});

const MatchCandidatesToJobsInputSchema = z.object({
  jobTitle: z.string().describe('The title of the job posting.'),
  jobDescription: z.string().describe('A detailed description of the job requirements.'),
  jobSkillsRequired: z.array(z.string()).describe('A list of skills required for the job.'),
  candidateProfiles: z.array(CandidateProfileSchema).describe('A list of candidate profiles to evaluate.'),
});
export type MatchCandidatesToJobsInput = z.infer<typeof MatchCandidatesToJobsInputSchema>;

const MatchedCandidateSchema = z.object({
  studentId: z.string().describe('The unique identifier for the matched student/worker.'),
  fullName: z.string().describe('The full name of the matched candidate.'),
  matchScore: z.number().min(0).max(100).describe('A score from 0-100 indicating how well the candidate matches the job requirements.'),
  reasoning: z.string().describe('A brief explanation of why the candidate is a good match, highlighting relevant skills and experience.'),
});

const MatchCandidatesToJobsOutputSchema = z.object({
  matchedCandidates: z.array(MatchedCandidateSchema).describe('A list of candidates matched to the job, ordered by match score (highest first).'),
});
export type MatchCandidatesToJobsOutput = z.infer<typeof MatchCandidatesToJobsOutputSchema>;

export async function matchCandidatesToJobs(input: MatchCandidatesToJobsInput): Promise<MatchCandidatesToJobsOutput> {
  return matchCandidatesToJobsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchCandidatesToJobsPrompt',
  input: { schema: MatchCandidatesToJobsInputSchema },
  output: { schema: MatchCandidatesToJobsOutputSchema },
  prompt: `You are an expert HR recruiter assistant specializing in matching job applicants to job postings.

Given a job description and a list of candidate profiles, your task is to evaluate each candidate's suitability for the job.
For each candidate, assign a match score from 0 to 100 and provide a concise reasoning for that score.
The reasoning should highlight specific skills, education, and experience from the candidate's profile that are relevant to the job.
Order the matched candidates by their match score in descending order.

Job Title: {{{jobTitle}}}
Job Description: {{{jobDescription}}}
Required Skills: {{#each jobSkillsRequired}}- {{{this}}}
{{/each}}

Candidate Profiles:
{{#each candidateProfiles}}
  Candidate ID: {{{studentId}}}
  Full Name: {{{fullName}}}
  Education: {{{education}}}
  Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Experience (Years): {{{experienceYears}}}
  Profile Completion: {{{profileCompletionPercentage}}}%

{{/each}}

Evaluate each candidate against the job requirements and return a JSON object containing an array of matched candidates.
`,
});

const matchCandidatesToJobsFlow = ai.defineFlow(
  {
    name: 'matchCandidatesToJobsFlow',
    inputSchema: MatchCandidatesToJobsInputSchema,
    outputSchema: MatchCandidatesToJobsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI model.');
    }
    // Sort candidates by matchScore in descending order as requested by the prompt instructions
    output.matchedCandidates.sort((a, b) => b.matchScore - a.matchScore);
    return output;
  }
);
