'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  getDocs,
  limit,
  startAfter,
  orderBy,
  DocumentData,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { Job } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  CircleDollarSign,
  Search,
  X,
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

function JobCard({ job }: { job: Job & { id: string } }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <CardDescription>{job.companyName || 'A Company'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" /> {job.location}
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" /> {job.jobType}
        </div>
        {job.salaryMin && job.salaryMax && (
          <div className="flex items-center gap-2">
            <CircleDollarSign className="h-4 w-4" />
            ₹{job.salaryMin.toLocaleString()} - ₹
            {job.salaryMax.toLocaleString()}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href={`/jobs/${job.slug}`}>View Job</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function JobsPage() {
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobs, setJobs] = useState<(Job & { id: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Filter states initialized from URL search params
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [experience, setExperience] = useState(
    searchParams.get('experience') || ''
  );
  const [salary, setSalary] = useState(searchParams.get('salary') || '');

  const buildQuery = (startAfterDoc: DocumentData | null = null) => {
    let q = query(
      collection(firestore, 'jobs'),
      where('status', '==', 'open'),
      orderBy('createdAt', 'desc')
    );

    if (location) {
      // Using array-contains for partial matching on searchKeywords
      q = query(q, where('searchKeywords', 'array-contains', location.toLowerCase()));
    }
    if (jobType) {
      q = query(q, where('jobType', '==', jobType));
    }
    if (experience) {
      q = query(
        q,
        where('experienceRequired', '>=', parseInt(experience, 10))
      );
    }

    if (salary) {
      q = query(q, where('salaryMin', '>=', parseInt(salary, 10)));
    }

    q = query(q, limit(10));

    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }

    return q;
  };

  const fetchJobs = async (reset = false) => {
    setIsLoading(true);
    try {
      const q = buildQuery(reset ? null : lastVisible);
      const documentSnapshots = await getDocs(q);

      const newJobs = documentSnapshots.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Job & { id: string })
      );

      const lastDoc =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastDoc || null);
      setHasMore(documentSnapshots.docs.length === 10);

      if (reset) {
        setJobs(newJobs);
      } else {
        setJobs((prevJobs) => [...prevJobs, ...newJobs]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // NOTE: If you see an error about needing an index, you must create it in the Firebase console.
      // The error message will provide a direct link to do so.
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (jobType) params.set('jobType', jobType);
    if (experience) params.set('experience', experience);
    if (salary) params.set('salary', salary);
    router.push(`/jobs?${params.toString()}`);
    setLastVisible(null); // Reset pagination
    setJobs([]); // Clear current jobs
    fetchJobs(true); // Reset jobs and fetch
  };

  const handleClear = () => {
    router.push('/jobs');
    setLocation('');
    setJobType('');
    setExperience('');
    setSalary('');
    setLastVisible(null);
    setJobs([]); // Clear current jobs
    fetchJobs(true);
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchJobs(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Find Your Next Opportunity
        </h1>
        <p className="text-muted-foreground mt-2">
          Browse through thousands of open positions.
        </p>
      </header>

      <Card className="mb-8 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              placeholder="e.g., Delhi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="jobType" className="text-sm font-medium">
              Job Type
            </label>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger>
                <SelectValue placeholder="All Job Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="experience" className="text-sm font-medium">
              Min Experience (years)
            </label>
            <Input
              id="experience"
              type="number"
              placeholder="e.g., 2"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="salary" className="text-sm font-medium">
              Min Salary (₹)
            </label>
            <Input
              id="salary"
              type="number"
              placeholder="e.g., 500000"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSearch} className="w-full">
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
            <Button onClick={handleClear} variant="outline" className="w-full">
              <X className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>
        </div>
      </Card>

      {isLoading && jobs.length === 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-60" />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold">No Jobs Found</h2>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or check back later.
          </p>
        </div>
      )}

      <div className="mt-12 flex justify-center">
        {hasMore && (
          <Button onClick={() => fetchJobs()} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        )}
      </div>
    </div>
  );
}
