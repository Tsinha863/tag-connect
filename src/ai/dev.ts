import { config } from 'dotenv';
config();

import '@/ai/flows/match-candidates-to-jobs-flow.ts';
import '@/ai/flows/generate-job-description-flow.ts';
import '@/ai/flows/recommend-jobs-to-students-flow.ts';