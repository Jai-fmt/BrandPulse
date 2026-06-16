import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const supabase = await createClient();
  const user = supabase
    ? (await supabase.auth.getUser()).data.user
    : null;

  return <SettingsClient userEmail={user?.email ?? ""} />;
}
