import { getJobBySlug } from '@/lib/jobs-server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Calendar, CircleDollarSign, GraduationCap, Lightbulb, MapPin } from 'lucide-react';
import { JobApplyButton } from './JobApplyButton';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
    params: { slug: string };
};

// Generate metadata for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const job = await getJobBySlug(params.slug);

    if (!job) {
        return {
            title: 'Job Not Found',
        };
    }

    const title = `${job.title} Job in ${job.location} | TAG Connect`;
    const description = job.description.substring(0, 160);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            url: `/jobs/${job.slug}`,
        },
    };
}

// The page component
export default async function JobDetailsPage({ params }: Props) {
    const job = await getJobBySlug(params.slug);

    if (!job) {
        notFound();
    }
    
    // Structured data for SEO
    const jobPostingJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        'title': job.title,
        'description': job.description,
        'hiringOrganization': {
            '@type': 'Organization',
            'name': job.companyName,
        },
        'jobLocation': {
            '@type': 'Place',
            'address': {
                '@type': 'PostalAddress',
                'addressLocality': job.location,
            },
        },
        'baseSalary': job.salaryMin && job.salaryMax ? {
            '@type': 'MonetaryAmount',
            'currency': 'INR',
            'value': {
                '@type': 'QuantitativeValue',
                'minValue': job.salaryMin,
                'maxValue': job.salaryMax,
                'unitText': 'YEAR',
            },
        } : undefined,
        'employmentType': job.jobType.toUpperCase().replace('-', '_'),
        'datePosted': job.createdAt ? new Date((job.createdAt as any)._seconds * 1000).toISOString() : new Date().toISOString(),
        'validThrough': (job as any).expiresAt ? new Date((job as any).expiresAt._seconds * 1000).toISOString() : undefined,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
            />
            <div className="bg-muted/40">
                <div className="container py-10">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                <div className="flex-1">
                                    <Badge variant="outline" className="mb-2">{job.jobType}</Badge>
                                    <CardTitle className="text-3xl">{job.title}</CardTitle>
                                    <CardDescription className="mt-2 text-base">
                                        {job.location}
                                    </CardDescription>
                                </div>
                                <div className="flex-shrink-0">
                                   <Suspense fallback={<Skeleton className="h-11 w-32 rounded-md" />}>
                                     <JobApplyButton job={job} />
                                   </Suspense>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-6">
                                <h3 className="font-bold text-xl">Job Description</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                                
                                <h3 className="font-bold text-xl">Skills Required</h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.skillsRequired.map(skill => <Badge key={skill}>{skill}</Badge>)}
                                </div>
                            </div>
                            <div className="space-y-6">
                                 <Card className="bg-muted/50">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Job Overview</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 text-sm">
                                        {job.salaryMin && job.salaryMax && (
                                            <div className="flex items-center">
                                                <CircleDollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                                                <span>₹{job.salaryMin.toLocaleString()} - ₹{job.salaryMax.toLocaleString()} per year</span>
                                            </div>
                                        )}
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                            <span>{job.location}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
                                            <span>{job.jobType}</span>
                                        </div>
                                         <div className="flex items-center">
                                            <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                                            <span>{job.educationRequired}</span>
                                        </div>
                                         <div className="flex items-center">
                                            <Lightbulb className="w-4 h-4 mr-2 text-muted-foreground" />
                                            <span>{job.experienceRequired} years experience</span>
                                        </div>
                                         <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                                            <span>Posted on {job.createdAt ? new Date((job.createdAt as any)._seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </CardContent>
                                 </Card>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
