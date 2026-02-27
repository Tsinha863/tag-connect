
export type UserRole = 'student' | 'company' | 'admin';

export type User = {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  createdAt: Date;
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
  createdAt: Date;
};

export type CompanyProfile = {
  uid: string;
  companyName: string;
  industry: string;
  location: string;
  description: string;
  verified: boolean;
  createdAt: Date;
};

export type Job = {
  jobId: string;
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
  status: 'active' | 'closed' | 'expired';
  searchKeywords: string[];
  createdAt: Date;
  applied?: boolean;
};

export type Application = {
  applicationId: string;
  jobId: string;
  studentId: string;
  studentName: string;
  companyId: string;
  status: 'applied' | 'shortlisted' | 'hired' | 'rejected';
  appliedAt: Date;
};

export type Placement = {
  placementId: string;
  studentId: string;
  companyId: string;
  jobId: string;
  salary: number;
  commissionPercent: number;
  commissionAmount: number;
  joiningDate: Date;
};

export type Inquiry = {
  inquiryId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
};
