import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminStudentsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Students</CardTitle>
        <CardDescription>
          Here you can view, verify, and manage all student accounts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Student management table will be here.</p>
      </CardContent>
    </Card>
  );
}
