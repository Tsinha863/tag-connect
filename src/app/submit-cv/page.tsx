import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SubmitCvPage() {
  return (
    <div className="container py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Submit Your CV</CardTitle>
          <CardDescription>
            Don&apos;t have time to create a profile right now? No problem. Fill out the form below and upload your CV. Our team will review your details and contact you with suitable opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-[800px] overflow-auto border rounded-lg">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLScd_REPLACE_WITH_YOUR_FORM_ID/viewform?embedded=true"
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
            >
              Loading…
            </iframe>
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Note: You will need to replace the `src` attribute of the iframe with your own Google Form&apos;s embed link.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
