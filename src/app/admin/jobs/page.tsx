import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminJobsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Jobs</CardTitle>
        <CardDescription>
          Here you can view, edit, or remove any job posting on the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Job management table will be here.</p>
      </CardContent>
    </Card>
  );
}
