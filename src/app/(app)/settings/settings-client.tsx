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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TABS = [
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "linkedin", label: "LinkedIn", icon: Link2 },
  { id: "instagram", label: "Instagram", icon: Camera },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "data-export", label: "Data & Export", icon: Database },
  { id: "scoring", label: "Scoring Model", icon: Zap },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
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
      <span
        className={cn(
          "pointer-events-none mt-0.5 inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

function SecretField({
  value,
  placeholder,
}: {
  value: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        defaultValue={value}
        placeholder={placeholder}
        className="h-9 border-gray-600 bg-gray-900 pr-16 text-white"
      />
      <div className="absolute inset-y-0 right-0 flex items-center gap-0.5 pr-2">
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="rounded p-1 text-gray-400 hover:text-white"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(value);
            toast.success("Copied to clipboard.");
          }}
          className="rounded p-1 text-gray-400 hover:text-white"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function OrganizationView() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="mb-5 border-b border-gray-800 pb-4">
        <h2 className="text-base font-semibold text-white">Organization</h2>
        <p className="mt-1 text-sm text-gray-400">
          Basic details about your FarMart BrandPulse instance.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm text-gray-300">Organization Name</Label>
          <Input
            defaultValue="FarMart"
            className="h-9 border-gray-700 bg-gray-800 text-white"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm text-gray-300">Admin Email</Label>
          <Input
            defaultValue="marketing@farmart.co"
            type="email"
            className="h-9 border-gray-700 bg-gray-800 text-white"
          />
        </div>
      </div>
    </div>
  );
}

function LinkedInView() {
  return (
    <div className="space-y-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-base font-semibold text-white">
          LinkedIn Integration
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Connect your LinkedIn company page to track employee engagement on
          posts.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm text-gray-300">Company Page URL</Label>
        <p className="text-xs text-gray-500">
          The URL of your FarMart LinkedIn company page.
        </p>
        <Input
          defaultValue="linkedin.com/company/farmart"
          className="h-9 border-gray-700 bg-gray-800 text-white focus-visible:border-green-500"
        />
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-gray-300">API Credentials</Label>
          <p className="mt-0.5 text-xs text-gray-500">
            Generate these from the{" "}
            <a href="#" className="text-green-400 hover:underline">
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
              defaultValue="86xxxxxxxxxxxxxxxx"
              className="h-9 border-gray-600 bg-gray-900 text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400">Client Secret</Label>
            <SecretField value="supersecretvalue123" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400">Access Token</Label>
            <p className="text-xs text-gray-500">
              Long-lived access token with r_organization_social scope.
            </p>
            <SecretField value="AQV_access_token_here" placeholder="AQV..." />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-green-900/50 bg-green-950/40 p-4">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
        <p className="text-xs text-gray-300">
          Your LinkedIn credentials are stored securely and used only to fetch
          engagement data. Never share your API keys publicly.
        </p>
      </div>
    </div>
  );
}

function InstagramView() {
  const [handles, setHandles] = useState(["@farmart", "@farmart.agri"]);
  const [input, setInput] = useState("");

  function addHandle() {
    const v = input.trim().replace(/^@?/, "@");
    if (v === "@" || handles.includes(v)) return;
    setHandles([...handles, v]);
    setInput("");
  }

  return (
    <div className="space-y-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-base font-semibold text-white">
          Instagram Integration
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Track FarMart&apos;s Instagram posts and employee engagement across
          all company handles.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-gray-300">Instagram Handles</Label>
            <span className="text-xs font-medium text-green-400">
              {handles.length} added
            </span>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">
            All official FarMart Instagram accounts to monitor.
          </p>
        </div>
        <div className="space-y-2">
          {handles.map((h) => (
            <div
              key={h}
              className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800 px-3 py-2.5"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
                  <Camera className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-white">{h}</span>
              </div>
              <button
                onClick={() => setHandles(handles.filter((x) => x !== h))}
                className="text-gray-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHandle()}
              placeholder="@handle"
              className="h-9 border-gray-700 bg-gray-800 text-white"
            />
            <Button
              onClick={addHandle}
              className="h-9 shrink-0 gap-1.5 bg-green-600 text-white hover:bg-green-700"
            >
              <Plus className="h-4 w-4" /> Add Handle
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-sm text-gray-300">API Credentials</Label>
          <p className="mt-0.5 text-xs text-gray-500">
            Create these from the{" "}
            <a href="#" className="text-green-400 hover:underline">
              Meta for Developers
            </a>{" "}
            dashboard under your Instagram Basic Display or Graph API app.
          </p>
        </div>
        <div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4">
          <div className="flex items-center gap-2 border-b border-gray-700 pb-3">
            <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
              <Camera className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium text-white">
              Instagram / Meta App
            </span>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400">App ID</Label>
            <Input
              defaultValue="123456789012345"
              className="h-9 border-gray-600 bg-gray-900 text-white"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400">App Secret</Label>
            <SecretField value="meta_app_secret_here" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-400">Access Token</Label>
            <p className="text-xs text-gray-500">
              Long-lived page access token with instagram_basic,
              pages_read_engagement scopes.
            </p>
            <SecretField
              value="EAAxxxxxxx_access_token"
              placeholder="EAAxxxxxxx..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-green-900/50 bg-green-950/40 p-4">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
        <p className="text-xs text-gray-300">
          Your Instagram credentials are stored securely and used only to fetch
          engagement data. Never share your API keys publicly.
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
    {
      label: "New Post Tracked",
      desc: "Alert when a new LinkedIn or Instagram post is added to tracking",
      checked: newPost,
      onChange: setNewPost,
    },
    {
      label: "Weekly Engagement Report",
      desc: "Email summary of engagement metrics every Monday morning",
      checked: weeklyReport,
      onChange: setWeeklyReport,
    },
    {
      label: "Participation Drop Alert",
      desc: "Notify when weekly participation drops by more than 10%",
      checked: dropAlert,
      onChange: setDropAlert,
    },
  ];

  return (
    <div className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-base font-semibold text-white">Notifications</h2>
        <p className="mt-1 text-sm text-gray-400">
          Control when the marketing team receives alerts about engagement
          activity.
        </p>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-800">
        {items.map(({ label, desc, checked, onChange }, i) => (
          <div
            key={label}
            className={cn(
              "flex items-center justify-between bg-gray-800/50 px-4 py-4",
              i < items.length - 1 && "border-b border-gray-800"
            )}
          >
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
  const [retention, setRetention] = useState("");

  const exports = [
    { label: "Export Employees CSV", desc: "All employee records" },
    { label: "Export Engagements CSV", desc: "All engagement history" },
    { label: "Export Posts CSV", desc: "All tracked posts" },
    { label: "Full Data Export", desc: "Everything in one archive" },
  ];

  return (
    <div className="space-y-6 rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-base font-semibold text-white">Data & Export</h2>
        <p className="mt-1 text-sm text-gray-400">
          Manage how engagement data is stored and exported.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm text-gray-300">Data Retention Period</Label>
        <p className="text-xs text-gray-500">
          Engagement records older than this will be archived automatically.
        </p>
        <Input
          value={retention}
          onChange={(e) => setRetention(e.target.value)}
          placeholder="e.g. 12 months"
          className="h-9 max-w-xs border-gray-700 bg-gray-800 text-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {exports.map(({ label, desc }) => (
          <button
            key={label}
            onClick={() => toast.success(`${label} started.`)}
            className="flex items-center gap-3 rounded-lg border border-gray-700 bg-gray-800 px-4 py-3.5 text-left transition-colors hover:bg-gray-700"
          >
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
    { label: "Like", desc: "Employee likes a company post", pts: 1, unit: "pt" },
    { label: "Comment", desc: "Employee comments on a post", pts: 3, unit: "pts" },
    { label: "Share", desc: "Employee shares to their feed", pts: 5, unit: "pts" },
    { label: "Repost", desc: "Employee reposts company content", pts: 5, unit: "pts" },
  ];

  return (
    <div className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-6">
      <div className="border-b border-gray-800 pb-4">
        <h2 className="text-base font-semibold text-white">
          Engagement Scoring Model
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Points awarded per engagement type. Read-only in MVP — contact support
          to adjust.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ label, desc, pts, unit }) => (
          <div
            key={label}
            className="flex items-start justify-between rounded-lg border border-gray-700 bg-gray-800 p-4"
          >
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
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-3.5">
        <p className="text-xs text-gray-300">
          An employee&apos;s total score ={" "}
          <code className="text-green-400">likes×1</code> +{" "}
          <code className="text-green-400">comments×3</code> +{" "}
          <code className="text-green-400">shares×5</code> +{" "}
          <code className="text-green-400">reposts×5</code> across all tracked
          posts.
        </p>
      </div>
    </div>
  );
}

export function SettingsClient({ userEmail: _userEmail }: { userEmail: string }) {
  const [activeTab, setActiveTab] = useState<TabId>("organization");

  return (
    <div className="flex min-h-screen flex-col bg-gray-950">
      <div className="flex items-start justify-between px-8 pb-6 pt-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-400">
            Platform configuration for BrandPulse
          </p>
        </div>
        <Button
          onClick={() => toast.success("Changes saved.")}
          className="bg-green-500 font-medium text-white hover:bg-green-600"
        >
          Save Changes
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
          {activeTab === "organization" && <OrganizationView />}
          {activeTab === "linkedin" && <LinkedInView />}
          {activeTab === "instagram" && <InstagramView />}
          {activeTab === "notifications" && <NotificationsView />}
          {activeTab === "data-export" && <DataExportView />}
          {activeTab === "scoring" && <ScoringModelView />}
        </div>
      </div>
    </div>
  );
}
