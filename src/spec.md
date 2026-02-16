# Specification

## Summary
**Goal:** Build an authenticated dealership marketing workspace that generates editable social post packages (template-based), attaches manual video assets, and tracks/works leads via shareable landing pages and a simple follow-up pipeline.

**Planned changes:**
- Add Internet Identity sign-in and restrict all internal app pages (dashboard, content generator/detail, asset workflows, leads) to authenticated users.
- Implement deterministic (non-AI) social content package generator with form inputs (platform, objective, model, offer, tone, CTA) and outputs (caption, hashtags, shot list, posting checklist), editable before saving.
- Persist content packages in the backend and support copy/export to clipboard for caption + hashtags.
- Add video asset attachments per content package via either file upload or external URL, storing metadata (title, prompt, duration, aspect ratio, status) and enabling playback/viewing on the content package detail screen.
- Create publicly accessible landing pages per content package with tracking parameters and a validated lead form (name, phone/email, vehicle interest, timeframe, consent), storing submissions as leads linked to the originating content package (including timestamp + URL ref/UTMs).
- Implement CRM-lite lead pipeline with statuses (New, Contacted, Qualified, Test Drive Scheduled, Won, Lost), including list/filter/search, lead detail, notes history, next follow-up date, and follow-up task completion logging; persist all updates.
- Add attribution views: per content package lead counts (total + by status), lead submission timeline, and a dashboard “Top content by leads” section.
- Apply a consistent, non-blue/non-purple automotive dealership theme (palette, typography, spacing, component styling) across all primary screens.
- Add and use static generated brand visuals from `frontend/public/assets/generated` (logo in header/nav; hero image on dashboard or landing page).

**User-visible outcome:** Authenticated users can generate and save dealership social post packages, attach externally created videos, share public landing pages to capture leads, and manage those leads through a simple status-and-follow-up workflow with content-to-lead attribution dashboards.
