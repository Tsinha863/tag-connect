'use client';

import {
  Activity,
  ArrowUpRight,
  Briefcase,
  Building2,
  CircleDollarSign,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { StudentProfile, CompanyProfile, Placement } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const chartData = [
  { month: 'January', commission: 1860 },
  { month: 'February', commission: 3050 },
  { month: 'March', commission: 2370 },
  { month: 'April', commission: 730 },
  { month: 'May', commission: 2090 },
  { month: 'June', commission: 2140 },
];

const chartConfig = {
  commission: {
    label: 'Commission',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

function StatCard({ title, icon: Icon, value, description, isLoading }: { title: string; icon: React.ElementType; value: string; description: string; isLoading: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{value}</div>}
        {!isLoading && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const firestore = useFirestore();

  const { data: placements, isLoading: placementsLoading } = useCollection<Placement>(
    useMemoFirebase(() => collection(firestore, 'placements'), [firestore])
  );
  
  const studentsQuery = useMemoFirebase(() => query(collection(firestore, 'studentProfiles'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: students, isLoading: studentsLoading } = useCollection<StudentProfile>(studentsQuery);
  
  const { data: companies, isLoading: companiesLoading } = useCollection<CompanyProfile>(
    useMemoFirebase(() => collection(firestore, 'companyProfiles'), [firestore])
  );

  const isLoading = placementsLoading || studentsLoading || companiesLoading;

  const totalCommission = placements?.reduce((acc, p) => acc + (p.commissionAmount || 0), 0) || 0;
  const totalStudents = students?.length || 0;
  const totalCompanies = companies?.length || 0;
  const totalPlacements = placements?.length || 0;

  const recentStudents = students?.slice(0, 5) || [];

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard 
          title="Total Commission" 
          icon={CircleDollarSign} 
          value={`₹${totalCommission.toLocaleString()}`} 
          description="Total earnings from placements."
          isLoading={isLoading}
        />
        <StatCard 
          title="Total Students" 
          icon={Users} 
          value={`+${totalStudents}`}
          description="Registered student accounts."
          isLoading={isLoading}
        />
        <StatCard 
          title="Total Companies" 
          icon={Building2} 
          value={`+${totalCompanies}`}
          description="Registered company accounts."
          isLoading={isLoading}
        />
        <StatCard 
          title="Total Placements" 
          icon={Briefcase} 
          value={`+${totalPlacements}`}
          description="Successful student placements."
          isLoading={isLoading}
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Commission Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                 <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tickFormatter={(value) => `₹${Number(value) / 1000}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="commission" fill="var(--color-commission)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
             <div className="grid gap-2">
              <CardTitle>Recent Students</CardTitle>
              <CardDescription>{totalStudents} total students.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/admin/students">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-8">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="grid gap-1 flex-1">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))
            ) : recentStudents.map((student) => (
              <div key={student.id} className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src={`https://picsum.photos/seed/${student.id}/100/100`} alt="Avatar" data-ai-hint="person face" />
                <AvatarFallback>{student.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">{student.fullName}</p>
                <p className="text-sm text-muted-foreground">{student.email}</p>
              </div>
              <div className="ml-auto font-medium">
                {student.verified ? <Badge>Verified</Badge> : <Badge variant="secondary">Unverified</Badge>}
              </div>
            </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
