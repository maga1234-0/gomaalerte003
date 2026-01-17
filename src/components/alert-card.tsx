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
  const { icon: CategoryIcon, colorClasses, badgeClasses } = categoryThemes[alert.category];

  const handleShare = () => {
    const message = `*Goma Alert: ${alert.category}*
*Title:* ${alert.title}
*Location:* ${alert.location}
*Description:* ${alert.description}

_Shared from Goma Alert Platform_`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
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
                    {alert.category}
                </Badge>
                <CardTitle className="font-headline text-xl">{alert.title}</CardTitle>
            </div>
            <div className="text-xs text-muted-foreground text-right flex-shrink-0">
                <p>{alert.location}</p>
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
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share2 className="mr-2 h-4 w-4" />
          Share via WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
}
