
import {
  Card,
  CardContent,
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
  Trash2,
  MoreVertical,
} from "lucide-react";
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser, useFirestore, deleteDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface AlertCardProps {
  alert: Alert;
  onHide: (alertId: string) => void;
  index?: number;
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

export function AlertCard({ alert, onHide, index = 0 }: AlertCardProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const isOwner = user && user.uid === alert.userId;
  const category = alert.category || 'Other';
  const { icon: CategoryIcon, colorClasses, badgeClasses } = categoryThemes[category];

  const handleShare = async () => {
    const title = ``;
    const text = ``;

    if (alert.audioUrl && navigator.share) {
      try {
        const response = await fetch(alert.audioUrl);
        const blob = await response.blob();
        
        // Determine file extension from MIME type for better compatibility
        const getFileExtension = (mimeType: string) => {
          if (!mimeType) return 'audio';
          if (mimeType.includes('mp4')) return 'mp4';
          if (mimeType.includes('webm')) return 'webm';
          if (mimeType.includes('ogg')) return 'ogg';
          return 'audio'; // Fallback
        };
        const extension = getFileExtension(blob.type);
        
        const file = new File([blob], `goma-alert-${alert.id}.${extension}`, { type: blob.type });

        const shareData = {
          title,
          text,
          files: [file],
        };

        // Try sharing. If it fails (e.g., file sharing not supported), it will be caught.
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

  const handleDeleteForAll = () => {
    if (!firestore || !isOwner) return;

    const alertRef = doc(firestore, 'alerts', alert.id);
    deleteDocumentNonBlocking(alertRef);

    toast({
      title: "",
      description: "",
    });

    // Also hide it from the current user's view immediately for a better UX.
    onHide(alert.id);
  };

  const handleDeleteForMe = () => {
    onHide(alert.id);
    toast({
        title: "",
        description: "",
    });
  };


  const getCreatedAtDate = () => {
    if (!alert.createdAt) return null;
    // Check if it's a Firestore Timestamp
    if (typeof (alert.createdAt as any)?.toDate === 'function') {
      return (alert.createdAt as any).toDate();
    }
    // Fallback for string or number date
    return new Date(alert.createdAt);
  };
  const createdAtDate = getCreatedAtDate();

  return (
    <Card
      className={cn(
        "overflow-hidden border-l-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.01]",
        "animate-in fade-in-0 slide-in-from-top-5 duration-500",
        colorClasses
      )}
      style={{
        animationDelay: `${index * 75}ms`,
        animationFillMode: "backwards",
      }}
    >
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <div className="flex-grow order-2 sm:order-1">
                <Badge variant="outline" className={cn("mb-2", badgeClasses)}>
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {category}
                </Badge>
                <CardTitle className="font-headline text-xl break-words">{alert.title || ""}</CardTitle>
            </div>
            <div className="text-xs text-muted-foreground sm:text-right flex-shrink-0 order-1 sm:order-2 w-full sm:w-auto flex justify-between sm:block">
                <p className="break-all">{alert.location || ""}</p>
                {createdAtDate && (
                    <p className="flex-shrink-0">
                        {formatDistanceToNow(createdAtDate, {
                        addSuffix: true,
                        })}
                    </p>
                )}
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/80">{alert.description}</p>
        {alert.audioUrl && (
          <div className="mt-4">
            <audio controls src={alert.audioUrl} className="w-full">
              
            </audio>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only"></span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    <span></span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteForMe}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span></span>
                </DropdownMenuItem>
                {isOwner && (
                    <>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                    onSelect={(e) => e.preventDefault()} // Prevents Dropdown from closing
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span></span>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle></AlertDialogTitle>
                                    <AlertDialogDescription>
                                    
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel></AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteForAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
