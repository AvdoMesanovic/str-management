"use client";

import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

export function useSupabase(): SupabaseClient {
  return useMemo(() => createClient(), []);
}
