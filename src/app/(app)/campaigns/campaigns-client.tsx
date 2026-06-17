"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Plus, Megaphone, Calendar, Hash, Pencil, Trash2, CheckCircle2, Archive, FileEdit, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { clsx } from "clsx";

type CampaignStatus = "draft" | "active" | "completed" | "archived";

type Campaign = {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  hashtag: string | null;
  start_date: string | null;
  end_date: string | null;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
};

const STATUS_STYLES: Record<CampaignStatus, string> = {
  active:    "bg-emerald-900/50 text-emerald-300 border-emerald-800/40",
  draft:     "bg-gray-800 text-gray-400 border-gray-700",
  completed: "bg-blue-900/50 text-blue-300 border-blue-800/40",
  archived:  "bg-gray-900 text-gray-600 border-gray-800",
};

const STATUS_ICONS: Record<CampaignStatus, React.ElementType> = {
  active:    CheckCircle2,
  draft:     FileEdit,
  completed: Clock,
  archived:  Archive,
};

const EMPTY_FORM = {
  name: "",
  description: "",
  hashtag: "",
  start_date: "",
  end_date: "",
  status: "active" as CampaignStatus,
};

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function CampaignsClient({
  initialCampaigns,
  orgId,
}: {
  initialCampaigns: Campaign[];
  orgId: string;
}) {
  const supabase = createClient();
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const counts = {
    all: campaigns.length,
    active: campaigns.filter((c) => c.status === "active").length,
    draft: campaigns.filter((c) => c.status === "draft").length,
    completed: campaigns.filter((c) => c.status === "completed").length,
    archived: campaigns.filter((c) => c.status === "archived").length,
  };

  const filtered = statusFilter === "all" ? campaigns : campaigns.filter((c) => c.status === statusFilter);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(c: Campaign) {
    setEditing(c);
    setForm({
      name: c.name,
      description: c.description ?? "",
      hashtag: c.hashtag ?? "",
      start_date: c.start_date ?? "",
      end_date: c.end_date ?? "",
      status: c.status,
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim()) { toast.error("Campaign name is required."); return; }
    if (!supabase) { toast.error("Not connected to database."); return; }
    if (!orgId) { toast.error("No organization found. Import employees first."); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description || null,
        hashtag: form.hashtag ? form.hashtag.replace(/^#?/, "#") : null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
        status: form.status,
      };

      if (editing) {
        const { data, error } = await supabase
          .from("campaigns")
          .update(payload)
          .eq("id", editing.id)
          .select()
          .single();
        if (error) throw new Error(error.message);
        setCampaigns((prev) => prev.map((c) => (c.id === editing.id ? data : c)));
        toast.success("Campaign updated.");
      } else {
        const { data, error } = await supabase
          .from("campaigns")
          .insert({ ...payload, org_id: orgId })
          .select()
          .single();
        if (error) throw new Error(error.message);
        setCampaigns((prev) => [data, ...prev]);
        toast.success("Campaign created.");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c: Campaign) {
    if (!confirm(`Delete campaign "${c.name}"? This cannot be undone.`)) return;
    if (!supabase) return;
    const { error } = await supabase.from("campaigns").delete().eq("id", c.id);
    if (error) { toast.error(error.message); return; }
    setCampaigns((prev) => prev.filter((x) => x.id !== c.id));
    toast.success("Campaign deleted.");
  }

  const FILTER_TABS = [
    { id: "all",       label: "All" },
    { id: "active",    label: "Active" },
    { id: "draft",     label: "Draft" },
    { id: "completed", label: "Completed" },
    { id: "archived",  label: "Archived" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#111]">
      {/* Header */}
      <div className="px-8 pt-8 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Campaigns</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage advocacy campaigns and track employee participation
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total",     value: counts.all,       color: "text-white" },
            { label: "Active",    value: counts.active,    color: "text-emerald-400" },
            { label: "Completed", value: counts.completed, color: "text-blue-400" },
            { label: "Draft",     value: counts.draft,     color: "text-gray-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-5 py-4">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-white/5 pb-0">
          {FILTER_TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setStatusFilter(id)}
              className={clsx(
                "px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
                statusFilter === id
                  ? "border-emerald-500 text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              )}
            >
              {label}
              {id !== "all" && counts[id as keyof typeof counts] > 0 && (
                <span className="ml-1.5 text-xs opacity-60">{counts[id as keyof typeof counts]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-8 pb-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-[#1a1a1a] border border-white/5 rounded-xl">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Megaphone className="w-7 h-7 text-gray-500" />
            </div>
            <p className="text-white font-semibold text-base mb-1">
              {statusFilter === "all" ? "No campaigns yet" : `No ${statusFilter} campaigns`}
            </p>
            <p className="text-gray-500 text-sm max-w-xs mb-5">
              {statusFilter === "all"
                ? "Create your first campaign to track employee advocacy by initiative."
                : `No campaigns match this filter.`}
            </p>
            {statusFilter === "all" && (
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" /> New Campaign
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((campaign) => {
              const StatusIcon = STATUS_ICONS[campaign.status];
              const isActive = campaign.status === "active";
              return (
                <div
                  key={campaign.id}
                  className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className={clsx(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                        isActive
                          ? "bg-emerald-900/30 border border-emerald-800/30"
                          : "bg-white/5 border border-white/10"
                      )}>
                        <Megaphone className={clsx("w-5 h-5", isActive ? "text-emerald-400" : "text-gray-500")} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-white font-semibold text-sm">{campaign.name}</h3>
                          <span className={clsx(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                            STATUS_STYLES[campaign.status]
                          )}>
                            <StatusIcon className="w-3 h-3" />
                            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                          </span>
                        </div>
                        {campaign.description && (
                          <p className="text-gray-500 text-xs mb-2 line-clamp-1">{campaign.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          {campaign.hashtag && (
                            <span className="flex items-center gap-1 text-emerald-600">
                              <Hash className="w-3 h-3" />
                              {campaign.hashtag}
                            </span>
                          )}
                          {(campaign.start_date || campaign.end_date) && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {fmtDate(campaign.start_date)} → {fmtDate(campaign.end_date)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEdit(campaign)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(campaign)}
                        className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-5">
              {editing ? "Edit Campaign" : "New Campaign"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Campaign Name *</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Q2 Advocacy Drive"
                  className="bg-[#111] border-white/10 text-white h-9 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="What is this campaign about?"
                  rows={2}
                  className="w-full bg-[#111] border border-white/10 text-white text-sm rounded-md px-3 py-2 resize-none focus:outline-none focus:border-emerald-500 placeholder:text-gray-600"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Campaign Hashtag</label>
                <Input
                  value={form.hashtag}
                  onChange={(e) => setForm((f) => ({ ...f, hashtag: e.target.value }))}
                  placeholder="#FarMartGrows"
                  className="bg-[#111] border-white/10 text-white h-9 focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block font-medium">Start Date</label>
                  <Input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
                    className="bg-[#111] border-white/10 text-white h-9"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block font-medium">End Date</label>
                  <Input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
                    className="bg-[#111] border-white/10 text-white h-9"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as CampaignStatus }))}
                  className="w-full bg-[#111] border border-white/10 text-white text-sm rounded-md px-3 h-9 focus:outline-none focus:border-emerald-500"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {saving ? "Saving…" : editing ? "Update" : "Create Campaign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
