"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { Alert, AlertCategory } from "@/lib/types";
import { AlertCard } from "./alert-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { GOMA_NEIGHBORHOODS, ALERT_CATEGORIES } from "@/lib/constants";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface AlertFeedProps {
  initialAlerts: Alert[];
}

const HIDDEN_ALERTS_STORAGE_KEY = 'goma-alert-hidden-alerts';

export function AlertFeed({ initialAlerts }: AlertFeedProps) {
  const [hiddenAlerts, setHiddenAlerts] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<AlertCategory | "all">(
    "all"
  );
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const { toast } = useToast();
  const prevAlertsRef = useRef<Alert[]>(initialAlerts);

  useEffect(() => {
    try {
      const storedHiddenAlerts = localStorage.getItem(HIDDEN_ALERTS_STORAGE_KEY);
      if (storedHiddenAlerts) {
        setHiddenAlerts(JSON.parse(storedHiddenAlerts));
      }
    } catch (error) {
      console.error("Failed to parse hidden alerts from localStorage", error);
    }
  }, []);

  useEffect(() => {
    // This effect handles showing notifications for new alerts.
    // It compares the current alerts with the previous set of alerts.
    // A notification is shown only if a new alert has been added since the last render,
    // and it is not the initial load of data.
    if (initialAlerts.length > prevAlertsRef.current.length && prevAlertsRef.current.length > 0) {
      const oldAlertIds = new Set(prevAlertsRef.current.map(a => a.id));
      const newAlert = initialAlerts.find(a => !oldAlertIds.has(a.id));
      
      if (newAlert) {
        toast({
          title: "New Alert Published",
          description: newAlert.title || "Check the feed for the latest update.",
        });
      }
    }
    // Update the ref to the current alerts for the next render cycle.
    prevAlertsRef.current = initialAlerts;
  }, [initialAlerts, toast]);

  const filteredAlerts = useMemo(() => {
    return initialAlerts
      .filter(alert => !hiddenAlerts.includes(alert.id))
      .filter((alert) => {
        const categoryMatch =
          categoryFilter === "all" || alert.category === categoryFilter;
        const locationMatch =
          locationFilter === "all" || alert.location === locationFilter;
        return categoryMatch && locationMatch;
      });
  }, [initialAlerts, categoryFilter, locationFilter, hiddenAlerts]);
  
  const uniqueLocations = ["all", ...GOMA_NEIGHBORHOODS];

  const handleClearFilters = () => {
    setCategoryFilter("all");
    setLocationFilter("all");
  };

  const handleHideAlert = (alertId: string) => {
    const newHiddenAlerts = [...hiddenAlerts, alertId];
    setHiddenAlerts(newHiddenAlerts);
    try {
      localStorage.setItem(HIDDEN_ALERTS_STORAGE_KEY, JSON.stringify(newHiddenAlerts));
    } catch (error) {
        console.error("Failed to save hidden alerts to localStorage", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <h1 className="text-3xl font-bold font-headline text-primary text-center md:text-left">
          ALL alerts
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value as any)}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-card">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {ALERT_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={locationFilter}
            onValueChange={(value) => setLocationFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-card">
              <SelectValue placeholder="Filter by location" />
            </SelectTrigger>
            <SelectContent>
              {uniqueLocations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc === "all" ? "All Locations" : loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" onClick={handleClearFilters} className="w-full sm:w-auto">Clear</Button>
        </div>
      </div>

      {filteredAlerts.length > 0 ? (
        <div className="grid gap-4">
          {filteredAlerts.map((alert, index) => (
            <AlertCard key={alert.id} alert={alert} onHide={handleHideAlert} index={index} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-semibold">No alerts found.</p>
              <p>There are no verified alerts matching your criteria at this time.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
