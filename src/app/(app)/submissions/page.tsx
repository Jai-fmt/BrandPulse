import { createClient } from "@/lib/supabase/server";
import { SubmissionsClient } from "./submissions-client";

export default async function SubmissionsPage() {
  const supabase = await createClient();

  if (!supabase) {
    return <SubmissionsClient initialSubmissions={[]} employees={[]} campaigns={[]} orgId="" />;
  }

  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", user?.id ?? "")
    .maybeSingle();

  const orgId = membership?.org_id ?? "";

  const [submissionsRes, employeesRes, campaignsRes] = await Promise.all([
    supabase
      .from("manual_submissions")
      .select(`
        id, employee_id, campaign_id, post_url, notes, status,
        points_awarded, reviewer_notes, reviewed_at, created_at,
        employees(name),
        campaigns(name)
      `)
      .eq("org_id", orgId)
      .order("created_at", { ascending: false }),
    supabase
      .from("employees")
      .select("id, name, email")
      .eq("org_id", orgId)
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("campaigns")
      .select("id, name")
      .eq("org_id", orgId)
      .eq("status", "active")
      .order("name"),
  ]);

  const submissions = (submissionsRes.data ?? []).map((s: any) => ({
    ...s,
    employee_name: s.employees?.name ?? "Unknown",
    campaign_name: s.campaigns?.name ?? null,
  }));

  return (
    <SubmissionsClient
      initialSubmissions={submissions}
      employees={employeesRes.data ?? []}
      campaigns={campaignsRes.data ?? []}
      orgId={orgId}
    />
  );
}
