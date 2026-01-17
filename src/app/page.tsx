import { AlertFeed } from "@/components/alert-feed";
import { getVerifiedAlerts } from "@/lib/actions";

export default async function Home() {
  const alerts = await getVerifiedAlerts();

  return (
    <div className="container mx-auto px-4 py-8">
      <AlertFeed initialAlerts={alerts} />
    </div>
  );
}
