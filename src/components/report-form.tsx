
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ALERT_CATEGORIES, GOMA_NEIGHBORHOODS } from "@/lib/constants";
import React from "react";
import { useFirestore, useUser, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { Mic, Square } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const reportFormSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.enum(ALERT_CATEGORIES).optional(),
  location: z.string().optional(),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

export function ReportForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const [isRecording, setIsRecording] = React.useState(false);
  const [audioDataUri, setAudioDataUri] = React.useState<string | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const [isRecordingDialogOpen, setIsRecordingDialogOpen] = React.useState(false);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mimeTypes = [
        'audio/mp4',
        'audio/webm;codecs=opus',
        'audio/ogg;codecs=opus',
        'audio/webm',
      ];
      const supportedMimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type));
      
      if (!supportedMimeType) {
        toast({
            variant: "destructive",
            title: "Recording not supported",
            description: "Your browser does not support any of the required audio formats.",
        });
        setIsRecordingDialogOpen(false);
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType: supportedMimeType });
      mediaRecorderRef.current = recorder;
      
      const audioChunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
  
      recorder.onstop = () => {
        // If there are no chunks, it means recording was cancelled, so just stop the stream.
        if (audioChunks.length === 0) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        const audioBlob = new Blob(audioChunks, { type: recorder.mimeType });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioDataUri(base64data);
        };
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
  
      recorder.start();
      setIsRecording(true);
      setAudioDataUri(null); // Clear previous recording
      toast({
        title: "Recording started...",
      });
    } catch (err) {
      console.error("Failed to start recording", err);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not access microphone. Please check your browser permissions.",
      });
      setIsRecordingDialogOpen(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsRecordingDialogOpen(false);
      toast({
        title: "Recording stopped",
        description: "Your audio report has been attached.",
      });
    }
  };

  const onDialogChange = (open: boolean) => {
    if (open) {
      setIsRecordingDialogOpen(true);
    } else {
      // Dialog is closing. If we are recording, it's a cancellation.
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); // Stop mic access
          setIsRecording(false);
          toast({ title: "Recording cancelled." });
      }
      setIsRecordingDialogOpen(false);
    }
  }

  React.useEffect(() => {
      if (isRecordingDialogOpen) {
          handleStartRecording();
      }
  }, [isRecordingDialogOpen]);

  async function onSubmit(data: ReportFormValues) {
    if (!user || !firestore) {
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "You must be logged in to submit a report.",
        });
        if (!user) router.push("/login");
        return;
    }
    
    startTransition(() => {
      const alertsCollection = collection(firestore, 'alerts');
      
      // Filter out undefined values before submitting to Firestore
      const reportData: { [key: string]: any } = {
        userId: user.uid,
        status: 'verified',
        createdAt: serverTimestamp(),
      };
      
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          reportData[key] = value;
        }
      });
  
      if (audioDataUri) {
        reportData.audioUrl = audioDataUri;
      }
      
      addDocumentNonBlocking(alertsCollection, reportData);
      
      toast({
        title: "Report Submitted",
        description: "Thank you for keeping our community safe.",
      });
      router.push("/");
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="animate-in fade-in-0 slide-in-from-top-5 duration-500" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Roadblock on Main Street" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="animate-in fade-in-0 slide-in-from-top-5 duration-500" style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide a detailed description of the incident."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="animate-in fade-in-0 slide-in-from-top-5 duration-500" style={{ animationDelay: '400ms', animationFillMode: 'backwards' }}>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ALERT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="animate-in fade-in-0 slide-in-from-top-5 duration-500" style={{ animationDelay: '450ms', animationFillMode: 'backwards' }}>
                <FormLabel>Location</FormLabel>
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a neighborhood" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GOMA_NEIGHBORHOODS.map((neighborhood) => (
                      <SelectItem key={neighborhood} value={neighborhood}>
                        {neighborhood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-2 animate-in fade-in-0 slide-in-from-top-5 duration-500" style={{ animationDelay: '500ms', animationFillMode: 'backwards' }}>
            <FormLabel>Voice Report (Optional)</FormLabel>
            <div className="rounded-lg border p-4 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-grow w-full">
                        <p className="text-sm text-muted-foreground">
                            If you can't type, you can record a short audio report instead.
                        </p>
                    </div>
                    
                    <Dialog open={isRecordingDialogOpen} onOpenChange={onDialogChange}>
                        <DialogTrigger asChild>
                            <Button type="button" disabled={isPending} className="w-full sm:w-auto flex-shrink-0">
                                <Mic className="mr-2 h-4 w-4" /> 
                                Record Audio
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-center">Recording Audio</DialogTitle>
                                <DialogDescription className="text-center">
                                    Speak clearly into your microphone. The recording will start automatically.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col items-center justify-center gap-4 py-8">
                                <div className="relative h-24 w-24">
                                    <Mic className="h-24 w-24 text-primary" />
                                    {isRecording && (
                                        <div className="absolute inset-0 -z-10 flex items-center justify-center">
                                            <div className="h-24 w-24 rounded-full bg-primary/20 animate-pulse"></div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {isRecording ? "Recording in progress..." : "Waiting to start..."}
                                </p>
                            </div>
                            <Button type="button" onClick={handleStopRecording} variant="destructive" className="w-full" disabled={!isRecording}>
                                <Square className="mr-2 h-4 w-4" /> 
                                Stop Recording
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>
                
                {audioDataUri && (
                    <div className="space-y-2 pt-4 border-t">
                        <p className="text-sm font-medium text-muted-foreground">Audio Preview</p>
                        <audio src={audioDataUri} controls className="w-full" />
                        <Button variant="link" size="sm" className="p-0 h-auto text-destructive" onClick={() => setAudioDataUri(null)}>
                            Remove audio
                        </Button>
                    </div>
                )}
            </div>
        </div>

        <Button type="submit" disabled={isPending || !user} className="animate-in fade-in-0 zoom-in-95 duration-500" style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}>
          {isPending ? "Submitting..." : "Submit Report"}
        </Button>
      </form>
    </Form>
  );
}
