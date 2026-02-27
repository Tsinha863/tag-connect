import { MetadataRoute } from 'next';
import { getAllJobsForSitemap } from '@/lib/jobs-server';

const URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tag-connect-app.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Static Pages
    const staticPages: MetadataRoute.Sitemap = [
        { url: URL, lastModified: new Date(), changeFrequency: 'yearly', priority: 1 },
        { url: `${URL}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${URL}/login`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
        { url: `${URL}/signup`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    ];

    // 2. Dynamic Job Pages
    const jobs = await getAllJobsForSitemap();
    const jobPages: MetadataRoute.Sitemap = jobs.map(job => {
        const lastModified = job.updatedAt ? new Date(job.updatedAt._seconds * 1000) : new Date();
        return {
            url: `${URL}/jobs/${job.slug}`,
            lastModified: lastModified,
            changeFrequency: 'weekly',
            priority: 0.7,
        };
    });
    
    // Note: Company pages could be added here once public profiles exist.
    // const companyPages = ...

    return [
        ...staticPages,
        ...jobPages,
        // ...companyPages
    ];
}
