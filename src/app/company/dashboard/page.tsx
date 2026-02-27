import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  
  export default function CompanyDashboardPage() {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Company Dashboard</CardTitle>
            <CardDescription>
              Welcome to your dashboard. Here you can manage your company profile and job postings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Your company profile and job postings will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
    