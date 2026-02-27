import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  
  export default function StudentDashboardPage() {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Student Dashboard</CardTitle>
            <CardDescription>
              Welcome to your dashboard. Here you can manage your profile and applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Your profile and application details will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
    