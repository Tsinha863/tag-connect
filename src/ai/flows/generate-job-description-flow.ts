'use server';

/**
 * @fileOverview A Genkit flow for generating comprehensive and SEO-optimized job descriptions.
 *
 * - generateJobDescription - A function that handles the job description generation process.
 * - GenerateJobDescriptionInput - The input type for the generateJobDescription function.
 * - GenerateJobDescriptionOutput - The return type for the generateJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJobDescriptionInputSchema = z.object({
  jobTitle: z.string().describe('The primary title of the job opening.'),
  companyIndustry: z.string().describe('The industry the company operates in.'),
  keyResponsibilities: z
    .string()
    .describe('A detailed description of the main responsibilities for this role.'),
  requiredQualifications: z
    .string()
    .describe('A detailed description of the required skills, education, and experience.'),
  jobLocation: z.string().describe('The primary work location for this job (e.g., city, remote).'),
  minSalary: z.number().optional().describe('The minimum annual salary for this position.'),
  maxSalary: z.number().optional().describe('The maximum annual salary for this position.'),
  jobType: z
    .enum(['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary', 'Freelance'])
    .describe('The type of employment for this job.'),
  companyCultureBenefits: z
    .string()
    .optional()
    .describe(
      'Optional: A brief description of the company culture or benefits to highlight in the job posting.'
    ),
});
export type GenerateJobDescriptionInput = z.infer<typeof GenerateJobDescriptionInputSchema>;

const GenerateJobDescriptionOutputSchema = z.object({
  title: z
    .string()
    .describe('A refined, SEO-friendly title for the job posting, optimized for search engines.'),
  description: z
    .string()
    .describe(
      'A comprehensive and compelling job description, including an introduction, responsibilities, qualifications, and company information.'
    ),
  skillsRequired: z
    .array(z.string())
    .describe('A list of key skills required for the role, suitable for filtering and search.'),
  educationRequired: z
    .string()
    .describe('The minimum educational requirement for the position (e.g., "Bachelor\'s Degree", "High School Diploma").'),
  experienceRequired: z
    .string()
    .describe('The minimum experience required for the position (e.g., "3+ Years", "Entry-Level").'),
  salaryMin: z.number().optional().describe('The minimum annual salary for this position.'),
  salaryMax: z.number().optional().describe('The maximum annual salary for this position.'),
  location: z.string().describe('The primary work location for this job.'),
  jobType: z.string().describe('The type of employment for this job.'),
  searchKeywords: z
    .array(z.string())
    .describe('A list of SEO keywords to improve the job posting\'s visibility in search engines.'),
});
export type GenerateJobDescriptionOutput = z.infer<typeof GenerateJobDescriptionOutputSchema>;

export async function generateJobDescription(
  input: GenerateJobDescriptionInput
): Promise<GenerateJobDescriptionOutput> {
  return generateJobDescriptionFlow(input);
}

const generateJobDescriptionPrompt = ai.definePrompt({
  name: 'generateJobDescriptionPrompt',
  input: {schema: GenerateJobDescriptionInputSchema},
  output: {schema: GenerateJobDescriptionOutputSchema},
  prompt: `You are an expert HR and SEO specialist. Your task is to generate a comprehensive and SEO-optimized job description based on the provided details. Ensure the description attracts suitable candidates and improves search engine visibility.\n\nGenerate a refined job title, a detailed job description, a list of required skills, educational requirements, experience requirements, salary range, location, job type, and a list of SEO keywords.\n\nUse the following information to generate the job description:\n\nJob Title: {{{jobTitle}}}\nCompany Industry: {{{companyIndustry}}}\nKey Responsibilities: {{{keyResponsibilities}}}\nRequired Qualifications (skills, education, experience): {{{requiredQualifications}}}\nJob Location: {{{jobLocation}}}\n{{#if minSalary}}Minimum Salary: {{{minSalary}}}{{/if}}\n{{#if maxSalary}}Maximum Salary: {{{maxSalary}}}{{/if}}\nJob Type: {{{jobType}}}\n{{#if companyCultureBenefits}}Company Culture and Benefits: {{{companyCultureBenefits}}}{{/if}}\n\nPlease format the output strictly as a JSON object matching the provided schema.\n`,
});

const generateJobDescriptionFlow = ai.defineFlow(
  {
    name: 'generateJobDescriptionFlow',
    inputSchema: GenerateJobDescriptionInputSchema,
    outputSchema: GenerateJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateJobDescriptionPrompt(input);
    if (!output) {
      throw new Error('Failed to generate job description.');
    }
    return output;
  }
);
