import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Action Required for Developers</AlertTitle>
            <AlertDescription>
              To make this page functional, you need to replace the placeholder `iframe` source URL below with the embed link of your own Google Form.
              <ol className="list-decimal list-inside mt-2 text-sm">
                <li>Create a Google Form to collect the desired information.</li>
                <li>In your form, click the "Send" button.</li>
                <li>Navigate to the "&lt; &gt;" (Embed HTML) tab.</li>
                <li>Copy the `src` URL from the iframe code provided.</li>
                <li>Paste your URL into the `src` attribute of the `iframe` element in the file `src/app/submit-cv/page.tsx`.</li>
              </ol>
            </AlertDescription>
          </Alert>
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
        </CardContent>
      </Card>
    </div>
  );
}
