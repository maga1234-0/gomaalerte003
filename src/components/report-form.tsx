"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ALERT_CATEGORIES, GOMA_NEIGHBORHOODS } from "@/lib/constants";
import { submitReport } from "@/lib/actions";
import React from "react";

const reportFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  description: z.string().min(20, "Please provide a more detailed description."),
  category: z.enum(ALERT_CATEGORIES, {
    required_error: "Please select a category.",
  }),
  location: z.string({ required_error: "Please select a location." }),
  isAnonymous: z.boolean().default(false).optional(),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

export function ReportForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: "",
      description: "",
      isAnonymous: false,
    },
  });

  async function onSubmit(data: ReportFormValues) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    
    startTransition(async () => {
      const result = await submitReport(formData);
      if (result?.success) {
        toast({
          title: "Report Submitted",
          description: "Thank you! Your report is now pending verification.",
        });
        router.push("/");
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "There was an error submitting your report. Please try again.",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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
            <FormItem>
              <FormLabel>Description</FormLabel>
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
              <FormItem>
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
              <FormItem>
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
        <FormField
          control={form.control}
          name="isAnonymous"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Submit Anonymously</FormLabel>
                <FormDescription>
                  If checked, your name will not be attached to this report.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit Report"}
        </Button>
      </form>
    </Form>
  );
}
