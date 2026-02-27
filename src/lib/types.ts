
export type UserRole = 'student' | 'company' | 'admin';

export type User = {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: any;
};

export type StudentProfile = {
  uid: string;
  fullName: string;
  education: string;
  stream: string;
  skills: string[];
  experienceYears: number;
  city: string;
  state: string;
  jobType: 'Full-time' | 'Part-time' | 'Internship';
  expectedSalary: number;
  cvUrl?: string;
  verified: boolean;
  profileCompletionPercentage: number;
  searchKeywords: string[];
  createdAt: any;
};

export type CompanyProfile = {
  uid: string;
  companyName: string;
  industry: string;
  location: string;
  description: string;
  verified: boolean;
  createdAt: any;
};

export type Job = {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  slug: string;
  description: string;
  skillsRequired: string[];
  educationRequired: string;
  experienceRequired: number;
  salaryMin?: number;
  salaryMax?: number;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Internship';
  status: 'open' | 'closed' | 'draft';
  searchKeywords: string[];
  createdAt: any;
  updatedAt?: any;
  applied?: boolean;
};

export type Application = {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  companyId: string;
  status: 'applied' | 'shortlisted' | 'hired' | 'rejected';
  appliedAt: any;
};

export type Placement = {
  id: string;
  studentId: string;
  companyId: string;
  jobId: string;
  salary: number;
  commissionPercent: number;
  commissionAmount: number;
  joiningDate: Date;
  createdAt: any;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: any;
};
