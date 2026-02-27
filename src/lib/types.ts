
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
  id: string;
  uid: string;
  email: string;
  fullName: string;
  education: string;
  stream: string;
  skills: string[];
  experienceYears: number;
  city: string;
  state: string;
  jobType: 'Full-time' | 'Part-time' | 'Internship';
  expectedSalary?: number;
  cvUrl?: string;
  verified: boolean;
  profileCompletionPercentage: number;
  searchKeywords: string[];
  createdAt: any;
};

export type CompanyProfile = {
  id: string;
  uid: string;
  email: string;
  companyName: string;
  industry: string;
  location: string;
  description: string;
  verified: boolean;
  createdAt: any;
  subscriptionPlan?: 'free' | 'basic' | 'premium';
  subscriptionStatus?: 'active' | 'inactive' | 'trialing';
  subscriptionExpiresAt?: any;
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
  isFeatured?: boolean;
  searchKeywords: string[];
  createdAt: any;
  updatedAt?: any;
  applied?: boolean;
};

export type Application = {
  id: string;
  jobId: string;
  jobTitle: string;
  studentId: string;
  studentName: string;
  companyId: string;
  companyName: string;
  status: 'applied' | 'shortlisted' | 'hired' | 'rejected';
  appliedAt: any;
};

export type Placement = {
  id: string;
  studentId: string;
  companyId: string;
  jobId: string;
  studentName: string;
  companyName: string;
  jobTitle: string;
  salary: number;
  commissionPercent: number;
  commissionAmount: number;
  joiningDate: any;
  createdAt: any;
  status: 'pending_invoice' | 'invoiced' | 'paid';
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  phone: string;
  message: string;
  createdAt: any;
};

    