/**
 * Admin data access functions
 */

import { selectRows, updateRows } from "@/lib/supabase";

// All enquiries with full details
export async function getAllEnquiries() {
  return selectRows<{
    id: string;
    reference: string;
    name: string;
    company: string;
    email: string;
    project_type: string;
    goal: string;
    problem: string;
    timeline: string;
    budget: string;
    details: string | null;
    status: string;
    created_at: string;
  }>(`enquiries?select=*&order=created_at.desc`);
}

// All user profiles
export async function getAllProfiles() {
  return selectRows<{
    id: string;
    display_name: string;
    bio: string;
    avatar_url: string;
    settings: Record<string, unknown>;
    created_at: string;
    updated_at: string;
  }>(`profiles?select=*&order=created_at.desc`);
}

// All account events
export async function getAllAccountEvents() {
  return selectRows<{
    id: string;
    user_id: string;
    event: string;
    metadata: Record<string, unknown>;
    created_at: string;
  }>(`account_events?select=*&order=created_at.desc&limit=200`);
}

// Update enquiry status
export async function updateEnquiryStatus(id: string, status: string) {
  return updateRows("enquiries", `id=eq.${encodeURIComponent(id)}`, { status });
}

// Get stats for dashboard
export async function getAdminStats() {
  const enquiriesResult = await selectRows<{ count: number }>(`enquiries?select=count`);
  const profilesResult = await selectRows<{ count: number }>(`profiles?select=count`);
  const eventsResult = await selectRows<{ count: number }>(`account_events?select=count`);
  
  const enquiriesByStatus = await selectRows<{ status: string; count: number }>(
    `enquiries?select=status&order=status`
  );
  
  return {
    totalEnquiries: enquiriesResult.ok ? enquiriesResult.data.length : 0,
    totalProfiles: profilesResult.ok ? profilesResult.data.length : 0,
    totalEvents: eventsResult.ok ? eventsResult.data.length : 0,
    enquiriesByStatus: enquiriesByStatus.ok ? enquiriesByStatus.data : [],
  };
}
