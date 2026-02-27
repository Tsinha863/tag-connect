import { serverFirestore } from '@/lib/firebase-server';
import type { Job } from '@/lib/types';

// This file is for server-side use only.

export async function getJobBySlug(slug: string): Promise<(Job & { id: string }) | null> {
    const jobsCollection = serverFirestore.collection('jobs');
    const q = jobsCollection.where('slug', '==', slug).limit(1);
    const snapshot = await q.get();

    if (snapshot.empty) {
        return null;
    }

    const jobDoc = snapshot.docs[0];
    const jobData = jobDoc.data() as Job;
    return { id: jobDoc.id, ...jobData };
}

export async function getAllJobsForSitemap(): Promise<{ slug: string; updatedAt: any }[]> {
    const jobsCollection = serverFirestore.collection('jobs');
    const q = jobsCollection.where('status', '==', 'open');
    const snapshot = await q.get();

    if (snapshot.empty) {
        return [];
    }

    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            slug: data.slug,
            updatedAt: data.updatedAt, // This will be a Firestore Timestamp
        };
    });
}
