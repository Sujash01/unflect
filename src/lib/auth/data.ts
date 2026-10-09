import { deleteRows, insertRow, selectRows, updateRows, upsertRow } from "@/lib/supabase";

export type Profile = {
  id: string;
  display_name: string;
  bio: string;
  avatar_url: string;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export async function getProfile(id: string): Promise<Profile | null> {
  const result = await selectRows<Profile>(`profiles?id=eq.${encodeURIComponent(id)}&select=id,display_name,bio,avatar_url,settings,created_at,updated_at&limit=1`);
  if (!result.ok || result.data.length === 0) return null;
  return result.data[0] ?? null;
}

export async function ensureProfile(id: string, displayName: string): Promise<Profile | null> {
  const existing = await getProfile(id);
  if (existing) return existing;
  const result = await upsertRow<Profile>("profiles", { id, display_name: displayName, bio: "", avatar_url: "", settings: {} }, "id");
  return result.ok ? getProfile(id) : null;
}

export async function updateProfile(id: string, values: Partial<Pick<Profile, "display_name" | "bio" | "avatar_url">>): Promise<boolean> {
  const result = await updateRows("profiles", `id=eq.${encodeURIComponent(id)}`, values);
  return result.ok;
}

export async function updateSettings(id: string, settings: Record<string, unknown>): Promise<boolean> {
  const result = await updateRows("profiles", `id=eq.${encodeURIComponent(id)}`, { settings });
  return result.ok;
}

export async function addAccountEvent(userId: string, event: string, metadata: Record<string, unknown> = {}) {
  return insertRow("account_events", { user_id: userId, event, metadata });
}

export async function getAccountEvents(userId: string) {
  return selectRows<{ id: string; event: string; metadata: Record<string, unknown>; created_at: string }>(`account_events?user_id=eq.${encodeURIComponent(userId)}&select=id,event,metadata,created_at&order=created_at.desc&limit=20`);
}

export async function getUserEnquiries(email: string) {
  const encoded = encodeURIComponent(email);
  return selectRows<{ id: string; reference: string; company: string; project_type: string; timeline: string; budget: string; status: string; created_at: string }>(`enquiries?email=eq.${encoded}&select=id,reference,company,project_type,timeline,budget,status,created_at&order=created_at.desc&limit=25`);
}

export async function deleteProfileData(userId: string) {
  await deleteRows("account_events", `user_id=eq.${encodeURIComponent(userId)}`);
  await deleteRows("profiles", `id=eq.${encodeURIComponent(userId)}`);
}
