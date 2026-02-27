'use server';
/**
 * @fileOverview This file implements a Genkit flow for recommending jobs to students.
 * It takes a student's profile information and a list of available jobs, then uses AI
 * to recommend the most relevant opportunities.
 *
 * - recommendJobsToStudents - A function that handles the job recommendation process.
 * - RecommendJobsToStudentsInput - The input type for the recommendJobsToStudents function (wrapper).
 * - RecommendJobsToStudentsOutput - The return type for the recommendJobsToStudents function (wrapper).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input for the wrapper function
const RecommendJobsToStudentsWrapperInputSchema = z.object({
  studentId: z.string().describe('The ID of the student for whom to recommend jobs.'),
});
export type RecommendJobsToStudentsInput = z.infer<typeof RecommendJobsToStudentsWrapperInputSchema>;

// Output for the wrapper function and flow
const RecommendedJobSchema = z.object({
  jobId: z.string().describe('The unique identifier of the job.'),
  title: z.string().describe('The title of the job.'),
  companyName: z.string().describe('The name of the company offering the job.'),
  location: z.string().describe('The location of the job.'),
  description: z.string().describe('A brief description of the job.'),
  skillsRequired: z.array(z.string()).describe('A list of skills required for the job.'),
  reasonForRecommendation: z.string().describe('A brief explanation from the AI why this job is recommended for the student.'),
});

const RecommendJobsToStudentsOutputSchema = z.object({
  recommendedJobs: z.array(RecommendedJobSchema).describe('A list of jobs recommended for the student.'),
});
export type RecommendJobsToStudentsOutput = z.infer<typeof RecommendJobsToStudentsOutputSchema>;


// Input for the prompt (which will be passed from the flow after fetching data)
const StudentProfileForPromptSchema = z.object({
  uid: z.string(),
  fullName: z.string().describe("The student's full name."),
  education: z.string().describe("The student's highest education."),
  stream: z.string().describe("The student's academic stream or major."),
  skills: z.array(z.string()).describe('A list of skills the student possesses.'),
  experienceYears: z.number().describe('Number of years of experience the student has.'),
  city: z.string().describe("The student's preferred city for work."),
  state: z.string().describe("The student's preferred state for work."),
  jobType: z.string().describe('Preferred job type (e.g., full-time, part-time, internship).'),
  expectedSalary: z.number().describe('The student\'s expected annual salary in USD.'),
});

const AvailableJobForPromptSchema = z.object({
  jobId: z.string().describe('The unique identifier of the job.'),
  companyId: z.string(),
  title: z.string().describe('The title of the job.'),
  slug: z.string(),
  description: z.string().describe('A detailed description of the job.'),
  skillsRequired: z.array(z.string()).describe('A list of skills required for the job.'),
  educationRequired: z.string().describe('Minimum education required for the job.'),
  experienceRequired: z.number().describe('Minimum years of experience required for the job.'),
  salaryMin: z.number().describe('Minimum annual salary for the job in USD.'),
  salaryMax: z.number().describe('Maximum annual salary for the job in USD.'),
  location: z.string().describe('The location of the job.'),
  jobType: z.string().describe('The type of employment (e.g., full-time, part-time).'),
  status: z.string(),
});

const RecommendJobsPromptInputSchema = z.object({
  studentProfile: StudentProfileForPromptSchema.describe('The profile of the student requesting job recommendations.'),
  availableJobs: z.array(AvailableJobForPromptSchema).describe('A list of currently available job postings.'),
});


const recommendJobsPrompt = ai.definePrompt({
  name: 'recommendJobsPrompt',
  input: {schema: RecommendJobsPromptInputSchema},
  output: {schema: RecommendJobsToStudentsOutputSchema},
  prompt: `You are an AI-powered job recommendation engine for TAG MEDIA. Your task is to recommend the top 3-5 most relevant job opportunities to a student based on their profile and a list of available jobs.

Carefully consider the student's skills, experience, education, preferred job type, expected salary, and location when matching them with job requirements, descriptions, and salary ranges.
Prioritize jobs that are a strong match across multiple criteria.

Student Profile:
Full Name: {{{studentProfile.fullName}}}
Education: {{{studentProfile.education}}}
Stream: {{{studentProfile.stream}}}
Skills: {{#each studentProfile.skills}}- {{{this}}}
{{/each}}
Experience: {{{studentProfile.experienceYears}}} years
Preferred Job Type: {{{studentProfile.jobType}}}
Expected Salary: $ {{{studentProfile.expectedSalary}}}
Preferred City: {{{studentProfile.city}}}
Preferred State: {{{studentProfile.state}}}

Available Jobs:
{{#each availableJobs}}
---
Job ID: {{{jobId}}}
Title: {{{title}}}
Company: {{{companyName}}}
Location: {{{location}}}
Description: {{{description}}}
Skills Required: {{#each skillsRequired}}- {{{this}}}
{{/each}}
Education Required: {{{educationRequired}}}
Experience Required: {{{experienceRequired}}} years
Salary Range: $ {{{salaryMin}}} - $ {{{salaryMax}}}
Job Type: {{{jobType}}}
---
{{/each}}

Recommend up to 5 jobs that are the best fit, providing a clear reason for each recommendation based on the student's profile. If there are fewer than 5 suitable jobs, recommend all that are a good fit. If no jobs are suitable, return an empty list.`,
});

const recommendJobsToStudentsFlow = ai.defineFlow(
  {
    name: 'recommendJobsToStudentsFlow',
    inputSchema: RecommendJobsToStudentsWrapperInputSchema,
    outputSchema: RecommendJobsToStudentsOutputSchema,
  },
  async (input) => {
    // Simulate fetching student profile and available jobs from Firestore
    // In a real application, replace these with actual Firestore queries.

    // Dummy student profile for demonstration
    const studentProfile: z.infer<typeof StudentProfileForPromptSchema> = {
      uid: input.studentId,
      fullName: 'Jane Doe',
      education: 'B.Sc. Computer Science',
      stream: 'Software Engineering',
      skills: ['JavaScript', 'React', 'Node.js', 'Firebase', 'AWS'],
      experienceYears: 3,
      city: 'Delhi',
      state: 'Delhi',
      jobType: 'Full-time',
      expectedSalary: 75000,
    };

    // Dummy list of available jobs for demonstration
    const availableJobs: z.infer<typeof AvailableJobForPromptSchema>[] = [
      {
        jobId: 'job1',
        companyId: 'compA',
        title: 'Senior Software Engineer',
        slug: 'senior-software-engineer-delhi',
        description: 'We are looking for a skilled Senior Software Engineer with experience in web development using React and Node.js.',
        skillsRequired: ['JavaScript', 'React', 'Node.js', 'AWS', 'MongoDB'],
        educationRequired: 'Bachelor\'s',
        experienceRequired: 5,
        salaryMin: 90000,
        salaryMax: 120000,
        location: 'Delhi',
        jobType: 'Full-time',
        status: 'active',
      },
      {
        jobId: 'job2',
        companyId: 'compB',
        title: 'Junior Frontend Developer',
        slug: 'junior-frontend-developer-mumbai',
        description: 'Entry-level position for a frontend developer passionate about React.',
        skillsRequired: ['JavaScript', 'React', 'HTML', 'CSS'],
        educationRequired: 'Bachelor\'s',
        experienceRequired: 1,
        salaryMin: 40000,
        salaryMax: 60000,
        location: 'Mumbai',
        jobType: 'Full-time',
        status: 'active',
      },
      {
        jobId: 'job3',
        companyId: 'compC',
        title: 'Firebase Backend Developer',
        slug: 'firebase-backend-developer-delhi',
        description: 'Experienced backend developer needed for Firebase-centric projects. Strong Node.js skills a plus.',
        skillsRequired: ['Firebase', 'Node.js', 'GCP', 'JavaScript', 'TypeScript'],
        educationRequired: 'Bachelor\'s',
        experienceRequired: 3,
        salaryMin: 70000,
        salaryMax: 95000,
        location: 'Delhi',
        jobType: 'Full-time',
        status: 'active',
      },
      {
        jobId: 'job4',
        companyId: 'compD',
        title: 'HR Assistant',
        slug: 'hr-assistant-pune',
        description: 'Assists HR department with administrative tasks. No coding experience needed.',
        skillsRequired: ['Microsoft Office', 'Communication', 'HR Management'],
        educationRequired: 'Associate\'s',
        experienceRequired: 2,
        salaryMin: 30000,
        salaryMax: 45000,
        location: 'Pune',
        jobType: 'Full-time',
        status: 'active',
      },
      {
        jobId: 'job5',
        companyId: 'compE',
        title: 'Fullstack Developer (Next.js/Firebase)',
        slug: 'fullstack-developer-nextjs-firebase-bangalore',
        description: 'Seeking a fullstack developer proficient in Next.js, React, and Firebase for our new product.',
        skillsRequired: ['Next.js', 'React', 'Firebase', 'TypeScript', 'JavaScript'],
        educationRequired: 'Bachelor\'s',
        experienceRequired: 4,
        salaryMin: 80000,
        salaryMax: 110000,
        location: 'Bangalore',
        jobType: 'Full-time',
        status: 'active',
      },
      {
        jobId: 'job6',
        companyId: 'compF',
        title: 'Data Scientist',
        slug: 'data-scientist-delhi',
        description: 'Analyze large datasets and build machine learning models.',
        skillsRequired: ['Python', 'SQL', 'Machine Learning', 'Data Analysis', 'TensorFlow'],
        educationRequired: 'Master\'s',
        experienceRequired: 4,
        salaryMin: 100000,
        salaryMax: 150000,
        location: 'Delhi',
        jobType: 'Full-time',
        status: 'active',
      },
    ];

    const {output} = await recommendJobsPrompt({
      studentProfile,
      availableJobs,
    });

    return output!;
  }
);

export async function recommendJobsToStudents(input: RecommendJobsToStudentsInput): Promise<RecommendJobsToStudentsOutput> {
  return recommendJobsToStudentsFlow(input);
}
