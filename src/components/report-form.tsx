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

  const [isRecording, setIsRecording] = React.useState(false);
  const [audioDataUri, setAudioDataUri] = React.useState<string | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

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
            description: "Your browser doesn't support the required audio formats.",
        });
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType: supportedMimeType });
      mediaRecorderRef.current = recorder;
      
      const audioChunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
  
      recorder.onstop = () => {
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
      setAudioDataUri(null);
      toast({
        title: "Recording Started",
        description: "Click stop when you are finished.",
      });
    } catch (err) {
      console.error("Failed to start recording", err);
      toast({
        variant: "destructive",
        title: "Recording Failed",
        description: "Could not access microphone. Please check your browser permissions.",
      });
    }
  };
  
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording Stopped",
        description: "Your audio has been captured.",
      });
    }
  };

  async function onSubmit(data: ReportFormValues) {
    if (!user || !firestore) {
        toast({
            variant: "destructive",
            title: "Authentication Required",
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
        description: "Thank you! Your report will appear on the feed shortly.",
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
              <FormLabel>Title (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Power Outage in Mabanga" {...field} />
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
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the incident in detail..."
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
                <FormLabel>Category (Optional)</FormLabel>
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
                <FormLabel>Location (Optional)</FormLabel>
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
            <FormLabel>Vocal Report (Optional)</FormLabel>
            <div className="flex flex-col sm:flex-row items-center gap-4 rounded-lg border p-4">
                <div className="flex-grow w-full">
                    <p className="text-sm text-muted-foreground">
                        {isRecording
                        ? "Recording in progress..."
                        : audioDataUri
                        ? "Recording saved. You can record a new one."
                        : "Press record to start your vocal report."}
                    </p>
                </div>
                {!isRecording ? (
                <Button type="button" onClick={handleStartRecording} disabled={isPending} className="w-full sm:w-auto flex-shrink-0">
                    <Mic className="mr-2 h-4 w-4" /> Start Recording
                </Button>
                ) : (
                <Button type="button" onClick={handleStopRecording} variant="destructive" className="w-full sm:w-auto flex-shrink-0">
                    <Square className="mr-2 h-4 w-4" /> Stop Recording
                </Button>
                )}
            </div>
            {audioDataUri && (
                <div className="mt-2 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Recording preview:</p>
                    <audio src={audioDataUri} controls className="w-full" />
                    <Button variant="link" size="sm" className="p-0 h-auto text-destructive" onClick={() => setAudioDataUri(null)}>
                        Delete recording
                    </Button>
                </div>
            )}
        </div>

        <Button type="submit" disabled={isPending || !user} className="animate-in fade-in-0 zoom-in-95 duration-500" style={{ animationDelay: '600ms', animationFillMode: 'backwards' }}>
          {isPending ? "Submitting..." : "Submit Report"}
        </Button>
      </form>
    </Form>
  );
}
