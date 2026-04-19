"use client";

import { useEffect, useState } from "react";
import type { Property } from "@/data/mockData";
import { useSupabase } from "@/hooks/useSupabase";
import { type PropertyDetail, getPropertyDetail } from "@/lib/queries/properties";

interface UsePropertyDetailResult {
  property: Property;
  loading: boolean;
}

export function usePropertyDetail(baseProperty: Property): UsePropertyDetailResult {
  const supabase = useSupabase();
  const [detail, setDetail] = useState<PropertyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDetail(null);

    getPropertyDetail(supabase, baseProperty.id)
      .then((result) => {
        if (!cancelled) {
          setDetail(result);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          console.error("[usePropertyDetail] Failed to load detail for property", baseProperty.id, err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [supabase, baseProperty.id]);

  if (!detail) return { property: baseProperty, loading };

  const merged: Property = {
    ...baseProperty,
    security: {
      ...baseProperty.security,
      accessCodes: detail.accessCodes,
      heartbeatData: detail.heartbeatData,
    },
    safety: {
      ...baseProperty.safety,
      decibelData12h: detail.decibelData12h,
    },
    environmental: {
      ...baseProperty.environmental,
      historicalUtils: detail.historicalUtils,
      currentUtils: detail.currentUtils,
    },
    revenue: {
      ...baseProperty.revenue,
      events: detail.events,
      lastUpdate: detail.lastUpdate,
    },
  };

  return { property: merged, loading };
}
