-- ═══════════════════════════════════════════════════════════════════════════
-- Migration 009 — Extend company_social_accounts for sync wiring
--
-- Problem: company_social_accounts was created as a pure account-identity
-- table (which page to watch) with no operational columns. The sync route
-- and Settings save had nowhere to record access tokens, sync status, or
-- connection health, so the table stayed empty.
--
-- Fix: add the columns the sync pipeline needs so company_social_accounts
-- is the single source of truth for a connected platform account.
--
-- access_token    — copied from organizations at Settings save time so the
--                   sync route only needs one table join.
-- company_url     — LinkedIn company page URL for display.
-- sync_enabled    — false lets admins pause sync without deleting the row.
-- connection_status — 'connected' after a successful sync/test,
--                     'error' after a failed sync, 'disconnected' when first
--                     created (no sync has run yet).
-- sync_error      — last error message from the sync route.
-- last_sync_at    — when the last sync completed (success or error).
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE public.company_social_accounts
  ADD COLUMN IF NOT EXISTS company_url        text,
  ADD COLUMN IF NOT EXISTS access_token       text,
  ADD COLUMN IF NOT EXISTS sync_enabled       boolean     NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS connection_status  text        NOT NULL DEFAULT 'disconnected'
    CHECK (connection_status IN ('connected', 'disconnected', 'error')),
  ADD COLUMN IF NOT EXISTS sync_error         text,
  ADD COLUMN IF NOT EXISTS last_sync_at       timestamptz;
