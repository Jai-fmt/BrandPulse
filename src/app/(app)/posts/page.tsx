import { createClient } from "@/lib/supabase/server";
import { PostTracking } from "./post-tracking";
import type { Post } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const supabase = await createClient();

  const [postsRes, accountRes] = await Promise.all([
    supabase
      ?.from("company_posts")
      .select("id, org_id, account_id, platform, post_url, platform_post_id, title, content_preview, published_at, last_synced_at, total_likes, total_comments, total_shares, total_reposts, total_mentions, sync_error, status, created_at")
      .neq("status", "archived")
      .order("created_at", { ascending: false }) ??
    Promise.resolve({ data: [] as Post[], error: null }),

    // RLS scopes this to the current user's org automatically.
    supabase
      ?.from("company_social_accounts")
      .select("id")
      .eq("platform", "linkedin")
      .eq("sync_enabled", true)
      .maybeSingle() ??
    Promise.resolve({ data: null }),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const posts: Post[] = (postsRes as any).data ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const postsError: string | undefined = (postsRes as any).error?.message;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const linkedInConnected = !!(accountRes as any).data;

  return (
    <PostTracking
      initialPosts={posts}
      error={postsError}
      linkedInConnected={linkedInConnected}
    />
  );
}
