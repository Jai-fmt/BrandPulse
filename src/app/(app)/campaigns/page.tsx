import { createClient } from "@/lib/supabase/server";
import { CampaignsClient } from "./campaigns-client";

export default async function CampaignsPage() {
  const supabase = await createClient();

  if (!supabase) {
    return <CampaignsClient initialCampaigns={[]} orgId="" />;
  }

  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("org_members")
    .select("org_id")
    .eq("user_id", user?.id ?? "")
    .maybeSingle();

  const orgId = membership?.org_id ?? "";

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });

  return (
    <CampaignsClient
      initialCampaigns={campaigns ?? []}
      orgId={orgId}
    />
  );
}
