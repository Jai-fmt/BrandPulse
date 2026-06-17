"use client";

import { useState } from "react";
import {
  Building2,
  Link2,
  Camera,
  Bell,
  Database,
  Zap,
  Eye,
  EyeOff,
  Copy,
  X,
  Plus,
  RefreshCw,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useOrgSettings } from "@/features/organization/hooks/use-org-settings";
import type { OrgCredentialsPublic } from "@/features/organization/types";

const TABS = [
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "linkedin",     label: "LinkedIn",     icon: Link2 },
  { id: "instagram",    label: "Instagram",    icon: Camera },
  { id: "notifications",label: "Notifications",icon: Bell },
  { id: "data-export",  label: "Data & Export",icon: Database },
  { id: "scoring",      label: "Scoring Model",icon: Zap },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ── Shared primitives ──────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none",
        checked ? "bg-green-500" : "bg-gray-600"
      )}
    >
      <span className={cn(
        "pointer-events-none mt-0.5 inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
        checked ? "translate-x-5" : "translate-x-0.5"
      )} />
    </button>
  );
}

/**
 * A field for sensitive values.
 * When `isSet` is true and the user hasn't started typing, shows a "saved" indicator.
 * Typing replaces the indicator — user must explicitly type a new value to overwrite.
 */
function SecretInput({
  isSet,
  value,
  onChange,
  placeholder,
}: {
  isSet: boolean;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(false);

  if (isSet && !editing) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-9 bg-gray-800 border border-gray-600 rounded-md px-3 flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
          <span className="text-gray-400 text-sm">•••••••••••• (saved)</span>
        </div>
        <button
          type="button"
          onClick={() => { setEditing(true); onChange(""); }}
          className="h-9 px-3 rounded-md border border-gray-600 text-gray-400 hover:text-white text-sm transition-colors"
        >
          Update
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={editing}
        className="h-9 border-gray-600 bg-gray-900 pr-16 text-white"
      />
      <div className="absolute inset-y-0 right-0 flex items-center gap-0.5 pr-2">
        <button type="button" onClick={() => setShow(!show)} className="rounded p-1 text-gray-400 hover:text-white">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => { navigator.clipboard.writeText(value); toast.success("Copied."); }}
            className="rounded p-1 text-gray-400 hover:text-white"
          >
            <Copy className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Tab views ──────────────────────────────────────────────────────────────────

function OrganizationView() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="mb-5 border-b border-gray-800 pb-4">
        <h2 className="text-base font-semibold text-white">Organization</h2>
        <p className="mt-1 text-sm text-gray-400">Basic details about your BrandPulse instance.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm text-gray-300">Organization Name</Label>
          <Input defaultValue="FarMart" className="h-9 border-gray-700 bg-gray-800 text-white" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-gray-300">Admin Email</Label>
          <Input defaultValue="marketing@farmart.co" type="email" className="h-9 border-gray-700 bg-gray-800 text-white" />
        </div>
      </div>
    </div>
  );
}

interface LinkedInViewProps {
  form: { company_url: string; client_id: string; company_id: string; client_secret: string; access_token: string };
  secretsSet: { linkedin_client_secret: boolean; linkedin_access_token: boolean };
  onChange: (field: string, value: string) => void;
  onValidate: () => Promise<void>;
  validating: boolean;
}

function LinkedInView({ form, secretsSet, onChange, onValidate, validating }: LinkedInViewProps) {
  return (
    <div className="space-y-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-base font-semibold text-white">LinkedIn Integration</h2>
        <p className="mt-1 text-sm text-gray-400">
          Connect your LinkedIn company page to track employee engagement on posts.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm text-gray-300">Company Page URL</Label>
        <p className="text-xs text-gray-500">The URL of your FarMart LinkedIn company page.</p>
        <Input
          value={form.company_url}
          onChange={(e) => onChange("company_url", e.target.value)}
          placeholder="https://linkedin.com/company/farmart"
          className="h-9 border-gray-700 bg-gray-800 text-white focus-visible:border-green-500"
        />
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-gray-300">API Credentials</Label>
          <p className="mt-0.5 text-xs text-gray-500">
            Generate these from the{" "}
            <a href="https://developer.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
              LinkedIn Developer Portal
            </a>{" "}
            under your app&apos;s Auth settings.
          </p>
        </div>
        <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center gap-2 border-b border-gray-700 pb-3">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-[#0077B5]">
              <span className="text-[9px] font-bold text-white">in</span>
            </div>
            <span className="text-sm font-medium text-white">LinkedIn App</span>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400">Client ID</Label>
            <Input
              value={form.client_id}
              onChange={(e) => onChange("client_id", e.target.value)}
              placeholder="86xxxxxxxxxxxxxxxx"
              className="h-9 border-gray-600 bg-gray-900 text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400">Client Secret</Label>
            <SecretInput
              isSet={secretsSet.linkedin_client_secret}
              value={form.client_secret}
              onChange={(v) => onChange("client_secret", v)}
              placeholder="Your LinkedIn client secret"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400">Organization / Company ID</Label>
            <Input
              value={form.company_id}
              onChange={(e) => onChange("company_id", e.target.value)}
              placeholder="123456789"
              className="h-9 border-gray-600 bg-gray-900 text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400">Access Token</Label>
            <p className="text-xs text-gray-500">Long-lived token with r_organization_social scope.</p>
            <SecretInput
              isSet={secretsSet.linkedin_access_token}
              value={form.access_token}
              onChange={(v) => onChange("access_token", v)}
              placeholder="AQV…"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onValidate}
          disabled={validating || !secretsSet.linkedin_access_token}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 text-sm text-gray-300 hover:text-white hover:border-gray-500 disabled:opacity-40 transition-colors"
        >
          {validating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          Test Connection
        </button>
        {!secretsSet.linkedin_access_token && (
          <p className="text-xs text-gray-500">Save an access token first to test.</p>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-green-900/50 bg-green-950/40 p-4">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
        <p className="text-xs text-gray-300">
          Credentials are stored server-side and never exposed to the browser. Secrets are never returned after saving.
        </p>
      </div>
    </div>
  );
}

interface InstagramViewProps {
  form: { app_id: string; business_account_id: string; handles: string[]; app_secret: string; access_token: string };
  secretsSet: { instagram_app_secret: boolean; instagram_access_token: boolean };
  onChange: (field: string, value: string) => void;
  onHandlesChange: (handles: string[]) => void;
  onValidate: () => Promise<void>;
  validating: boolean;
}

function InstagramView({ form, secretsSet, onChange, onHandlesChange, onValidate, validating }: InstagramViewProps) {
  const [handleInput, setHandleInput] = useState("");

  function addHandle() {
    const v = handleInput.trim().replace(/^@?/, "@");
    if (v === "@" || form.handles.includes(v)) return;
    onHandlesChange([...form.handles, v]);
    setHandleInput("");
  }

  return (
    <div className="space-y-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-base font-semibold text-white">Instagram Integration</h2>
        <p className="mt-1 text-sm text-gray-400">
          Track FarMart&apos;s Instagram posts and employee engagement.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-300">Instagram Handles</Label>
            <span className="text-xs font-medium text-green-400">{form.handles.length} added</span>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">All official FarMart Instagram accounts to monitor.</p>
        </div>
        <div className="space-y-2">
          {form.handles.map((h) => (
            <div key={h} className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
                  <Camera className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-white">{h}</span>
              </div>
              <button onClick={() => onHandlesChange(form.handles.filter((x) => x !== h))} className="text-gray-500 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              value={handleInput}
              onChange={(e) => setHandleInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHandle()}
              placeholder="@handle"
              className="h-9 border-gray-700 bg-gray-800 text-white"
            />
            <Button onClick={addHandle} className="h-9 shrink-0 gap-1.5 bg-green-600 text-white hover:bg-green-700">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-gray-300">API Credentials</Label>
          <p className="mt-0.5 text-xs text-gray-500">
            From the{" "}
            <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
              Meta for Developers
            </a>{" "}
            dashboard.
          </p>
        </div>
        <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center gap-2 border-b border-gray-700 pb-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
              <Camera className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium text-white">Instagram / Meta App</span>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400">App ID</Label>
            <Input
              value={form.app_id}
              onChange={(e) => onChange("app_id", e.target.value)}
              placeholder="123456789012345"
              className="h-9 border-gray-600 bg-gray-900 text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400">App Secret</Label>
            <SecretInput
              isSet={secretsSet.instagram_app_secret}
              value={form.app_secret}
              onChange={(v) => onChange("app_secret", v)}
              placeholder="Your Meta app secret"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400">Business Account ID</Label>
            <Input
              value={form.business_account_id}
              onChange={(e) => onChange("business_account_id", e.target.value)}
              placeholder="17841400000000000"
              className="h-9 border-gray-600 bg-gray-900 text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400">Access Token</Label>
            <p className="text-xs text-gray-500">Long-lived page token with instagram_basic, pages_read_engagement scopes.</p>
            <SecretInput
              isSet={secretsSet.instagram_access_token}
              value={form.access_token}
              onChange={(v) => onChange("access_token", v)}
              placeholder="EAAxxxxxxx…"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onValidate}
          disabled={validating || !secretsSet.instagram_access_token}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 text-sm text-gray-300 hover:text-white hover:border-gray-500 disabled:opacity-40 transition-colors"
        >
          {validating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
          Test Connection
        </button>
        {!secretsSet.instagram_access_token && (
          <p className="text-xs text-gray-500">Save an access token first to test.</p>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-green-900/50 bg-green-950/40 p-4">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
        <p className="text-xs text-gray-300">
          Credentials are stored server-side and never exposed to the browser. Secrets are never returned after saving.
        </p>
      </div>
    </div>
  );
}

function NotificationsView() {
  const [newPost, setNewPost] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [dropAlert, setDropAlert] = useState(false);

  const items = [
    { label: "New Post Tracked",        desc: "Alert when a new LinkedIn or Instagram post is added",      checked: newPost,      onChange: setNewPost },
    { label: "Weekly Engagement Report",desc: "Email summary of metrics every Monday morning",              checked: weeklyReport, onChange: setWeeklyReport },
    { label: "Participation Drop Alert",desc: "Notify when weekly participation drops by more than 10%",   checked: dropAlert,    onChange: setDropAlert },
  ];

  return (
    <div className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-base font-semibold text-white">Notifications</h2>
        <p className="mt-1 text-sm text-gray-400">Control when the marketing team receives alerts.</p>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-800">
        {items.map(({ label, desc, checked, onChange }, i) => (
          <div key={label} className={cn("flex items-center justify-between bg-gray-800/50 px-4 py-4", i < items.length - 1 && "border-b border-gray-800")}>
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="mt-0.5 text-xs text-gray-400">{desc}</p>
            </div>
            <Toggle checked={checked} onChange={onChange} />
          </div>
        ))}
      </div>
    </div>
  );
}

function DataExportView() {
  const exports = [
    { label: "Export Employees CSV",   desc: "All employee records" },
    { label: "Export Engagements CSV", desc: "All engagement history" },
    { label: "Export Posts CSV",       desc: "All tracked posts" },
    { label: "Full Data Export",       desc: "Everything in one archive" },
  ];

  return (
    <div className="space-y-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-base font-semibold text-white">Data & Export</h2>
        <p className="mt-1 text-sm text-gray-400">Manage how engagement data is stored and exported.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {exports.map(({ label, desc }) => (
          <button key={label} onClick={() => toast.success(`${label} started.`)}
            className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3.5 text-left transition-colors hover:bg-gray-700">
            <RefreshCw className="h-4 w-4 shrink-0 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ScoringModelView() {
  const items = [
    { label: "Comment",            desc: "Employee comments on a company post",       pts: 5,  unit: "pts" },
    { label: "Mention FarMart",    desc: "Employee mentions FarMart in a post",       pts: 5,  unit: "pts" },
    { label: "Campaign Hashtag",   desc: "Employee uses an active campaign hashtag",  pts: 5,  unit: "pts" },
    { label: "Story Mention",      desc: "Employee mentions FarMart in a story",      pts: 5,  unit: "pts" },
    { label: "Share / Repost",     desc: "Employee shares or reposts company content",pts: 10, unit: "pts" },
    { label: "Advocacy Post",      desc: "Employee creates original advocacy content",pts: 15, unit: "pts" },
    { label: "Manual Submission",  desc: "Verified manual submission approved",       pts: 15, unit: "pts" },
  ];

  return (
    <div className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-base font-semibold text-white">Engagement Scoring Model</h2>
        <p className="mt-1 text-sm text-gray-400">Points awarded per advocacy action per the BrandPulse PRD.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ label, desc, pts, unit }) => (
          <div key={label} className="flex items-start justify-between rounded-lg border border-gray-700 bg-gray-800 p-4">
            <div>
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-0.5 text-xs text-gray-400">{desc}</p>
            </div>
            <span className="ml-3 shrink-0 rounded bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-400">
              {pts} {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Root component ─────────────────────────────────────────────────────────────

export function SettingsClient({
  userEmail: _userEmail,
  initialSettings,
}: {
  userEmail: string;
  initialSettings: OrgCredentialsPublic | null;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("organization");

  const {
    linkedIn, setLinkedIn,
    instagram, setInstagram,
    secretsSet,
    saving, save,
    validating, testLinkedIn, testInstagram,
  } = useOrgSettings(initialSettings);

  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      <div className="flex items-start justify-between px-8 pb-6 pt-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-400">Platform configuration for BrandPulse</p>
        </div>
        <Button
          onClick={save}
          disabled={saving}
          className="gap-2 bg-green-500 font-medium text-white hover:bg-green-600 disabled:opacity-60"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving…" : "Save Changes"}
        </Button>
      </div>

      <div className="flex flex-1 gap-5 px-8 pb-8">
        <nav className="h-fit w-44 shrink-0 space-y-0.5 rounded-xl border border-gray-800 bg-gray-900 p-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                activeTab === id
                  ? "border-l-2 border-green-500 bg-green-500/10 pl-[10px] text-green-400"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          {activeTab === "organization"  && <OrganizationView />}

          {activeTab === "linkedin" && (
            <LinkedInView
              form={linkedIn}
              secretsSet={{ linkedin_client_secret: secretsSet.linkedin_client_secret, linkedin_access_token: secretsSet.linkedin_access_token }}
              onChange={(field, value) => setLinkedIn((f) => ({ ...f, [field]: value }))}
              onValidate={testLinkedIn}
              validating={validating === "linkedin"}
            />
          )}

          {activeTab === "instagram" && (
            <InstagramView
              form={instagram}
              secretsSet={{ instagram_app_secret: secretsSet.instagram_app_secret, instagram_access_token: secretsSet.instagram_access_token }}
              onChange={(field, value) => setInstagram((f) => ({ ...f, [field]: value }))}
              onHandlesChange={(handles) => setInstagram((f) => ({ ...f, handles }))}
              onValidate={testInstagram}
              validating={validating === "instagram"}
            />
          )}

          {activeTab === "notifications"  && <NotificationsView />}
          {activeTab === "data-export"    && <DataExportView />}
          {activeTab === "scoring"        && <ScoringModelView />}
        </div>
      </div>
    </div>
  );
}
