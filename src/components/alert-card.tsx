import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Alert, AlertCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  ShieldAlert,
  TrafficCone,
  Zap,
  Droplets,
  HeartPulse,
  HelpCircle,
  Share2,
} from "lucide-react";
import React from "react";

interface AlertCardProps {
  alert: Alert;
}

const categoryThemes: Record<
  AlertCategory,
  {
    icon: React.ElementType;
    colorClasses: string;
    badgeClasses: string;
  }
> = {
  Security: {
    icon: ShieldAlert,
    colorClasses: "border-l-red-500",
    badgeClasses: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  Health: {
    icon: HeartPulse,
    colorClasses: "border-l-red-500",
    badgeClasses: "bg-red-100 text-red-800 hover:bg-red-200",
  },
  Road: {
    icon: TrafficCone,
    colorClasses: "border-l-yellow-500",
    badgeClasses: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  Power: {
    icon: Zap,
    colorClasses: "border-l-yellow-500",
    badgeClasses: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  Water: {
    icon: Droplets,
    colorClasses: "border-l-yellow-500",
    badgeClasses: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  },
  Other: {
    icon: HelpCircle,
    colorClasses: "border-l-blue-500",
    badgeClasses: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
};

export function AlertCard({ alert }: AlertCardProps) {
  const category = alert.category || 'Other';
  const { icon: CategoryIcon, colorClasses, badgeClasses } = categoryThemes[category];

  const handleShare = async () => {
    const title = `Goma Alert: ${alert.title || 'Untitled Alert'}`;
    const text = `*Goma Alert: ${category}*
*Title:* ${alert.title || 'Untitled Alert'}
*Location:* ${alert.location || 'Not specified'}
*Description:* ${alert.description || 'No description provided.'}

_Shared from Goma Alert Platform_`;

    if (alert.audioUrl && navigator.share) {
      try {
        const response = await fetch(alert.audioUrl);
        const blob = await response.blob();
        const file = new File([blob], `goma-alert-${alert.id}.webm`, { type: blob.type || 'audio/webm' });

        const shareData = {
          title,
          text,
          files: [file],
        };

        // Try sharing and fall back if it fails.
        await navigator.share(shareData);
        return; // If share is successful, we're done.
      } catch (error) {
        console.error("Web Share API with file failed, falling back to text-only share.", error);
        // Fallback to text-only share below.
      }
    }

    // Fallback to WhatsApp link if Web Share is not supported, or if it fails.
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const getCreatedAtDate = () => {
    if (!alert.createdAt) return new Date();
    // Check if it's a Firestore Timestamp
    if (typeof (alert.createdAt as any)?.toDate === 'function') {
      return (alert.createdAt as any).toDate();
    }
    // Fallback for string or number date
    return new Date(alert.createdAt);
  };
  const createdAtDate = getCreatedAtDate();

  return (
    <Card className={cn("overflow-hidden border-l-4 shadow-sm hover:shadow-md transition-shadow", colorClasses)}>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <div className="flex-grow">
                <Badge variant="outline" className={cn("mb-2", badgeClasses)}>
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {category}
                </Badge>
                <CardTitle className="font-headline text-xl">{alert.title || "Untitled Alert"}</CardTitle>
            </div>
            <div className="text-xs text-muted-foreground text-right flex-shrink-0">
                <p>{alert.location || "Not specified"}</p>
                <p>
                    {formatDistanceToNow(createdAtDate, {
                    addSuffix: true,
                    })}
                </p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/80">{alert.description}</p>
        {alert.audioUrl && (
          <div className="mt-4">
            <audio controls src={alert.audioUrl} className="w-full">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
