import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminCompaniesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Companies</CardTitle>
        <CardDescription>
          Here you can approve, view, and manage all company accounts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Company management table will be here.</p>
      </CardContent>
    </Card>
  );
}
