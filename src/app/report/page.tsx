import { ReportForm } from "@/components/report-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Report an Incident</CardTitle>
            <CardDescription>
              Your report helps keep the community safe and informed. Please provide as much detail as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
