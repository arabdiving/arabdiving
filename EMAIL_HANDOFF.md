# Email System — Engineering Handoff

**Project:** ArabDiving
**Date:** 20 July 2026
**Status:** Built and deployed. Local sending verified. **Production end-to-end sending never confirmed.**
**Purpose of this doc:** give a new engineer full context on what was built, what was tried, what was ruled out, and where the remaining problem most likely is.

---

## 1. Goal

Add an email platform to the existing ArabDiving backend supporting:

- Consent-based subscriber list (double opt-in)
- Bulk newsletter campaigns
- Automated welcome sequence
- One-off custom emails
- Legal compliance for Saudi Arabia (PDPL + CST anti-spam) and Egypt (Law 151/2020): explicit consent, consent audit record, unsubscribe link and sender identity in every message

---

## 2. Environment

| Layer | Platform | Notes |
|---|---|---|
| Backend | **Render** (free tier) | `https://arabdiving-api.onrender.com`, root dir `backend`, start `npm start` → `node src/server.js` |
| Frontend | **Vercel** (Next.js) | `arabdiving.com` / `www.arabdiving.com` |
| Database | **MongoDB Atlas** | connected OK |
| Mail relay | **Brevo** SMTP | `smtp-relay.brevo.com:587`, login `b29791001@smtp-brevo.com` |
| Mailbox | **Zoho** (free) | `info@arabdiving.com` — receive only, see §5 |

Stack: Express **5**, Mongoose **9**, CommonJS, `nodemailer` (added for this work).

> Render free tier spins down on inactivity — first request can take 50s+. Load a page first to wake the service before testing POSTs.

---

## 3. What was added

### New files

```
backend/src/models/Subscriber.js          # subscriber + consent record + tokens + sequence position
backend/src/models/EmailCampaign.js       # newsletter campaigns + send stats
backend/src/models/EmailSequence.js       # welcome sequence steps (singleton, key="welcome")

backend/src/lib/mailer.js                 # nodemailer SMTP transport + DRY_RUN fallback
backend/src/lib/emailTemplates.js         # {{var}} interpolation + RTL wrapper + compliance footer
backend/src/lib/emailAutomation.js        # setInterval engine, processes welcome sequence every 60s
backend/src/lib/corsOrigins.js            # single source of truth for allowed CORS origins

backend/src/controllers/newsletterController.js   # public: subscribe / confirm / unsubscribe / health
backend/src/controllers/emailAdminController.js   # admin: stats, subscribers, campaigns, sequence, custom send
backend/src/routes/newsletterRoutes.js
backend/src/routes/emailAdminRoutes.js

backend/src/public/email/subscribe.html   # public signup form (RTL)
backend/src/public/email/admin.html       # admin dashboard (JWT pasted into header field)

backend/src/seedWelcomeSequence.js        # npm run seed-welcome — installs 4-step welcome sequence
backend/src/testMail.js                   # npm run mail-test -- you@example.com — SMTP diagnostic
backend/EMAIL_SYSTEM_ar.md                # Arabic usage guide
```

### Modified files

- `backend/src/server.js` — mounted routes, static `/email`, started automation, **rewrote CORS origin check** (see §6)
- `backend/package.json` — added `nodemailer`; scripts `seed-welcome`, `mail-test`
- `backend/.env.example` — documented all mail vars
- `DEPLOYMENT_ar.md` — documented required Render env vars

### Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/newsletter/subscribe` | public | create subscriber (`pending`), send confirmation email |
| GET | `/api/newsletter/confirm?token=` | public | set status `confirmed`, returns HTML page |
| GET | `/api/newsletter/unsubscribe?token=` | public | set status `unsubscribed`, returns HTML page |
| GET | `/api/newsletter/health` | public | **diagnostic** — DB state, mail config booleans, resolved CORS list |
| GET/POST/PUT | `/api/email-admin/*` | admin JWT | stats, subscribers, campaigns, sequence, custom send |
| static | `/email/subscribe.html`, `/email/admin.html` | public | UI pages |

### Design notes

- **DRY_RUN mode:** if `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` are not all set, `mailer.js` logs instead of sending. Nothing throws. This is intentional (lets the system run without credentials) but it means *a misconfigured deploy silently sends nothing* — `/health` exposes `mail.dryRun` to detect this.
- **Sending is non-blocking:** `subscribe` responds to the browser *first*, then sends the confirmation email in the background with `.then/.catch` logging. Subscribers are never lost due to SMTP latency/failure.
- **Only `status: "confirmed"` subscribers receive campaigns.** Unsubscribed are excluded at query level.
- Campaign sends are throttled ~120ms between messages.

---

## 4. Required environment variables (Render → Environment)

```
APP_URL             = https://arabdiving-api.onrender.com   # builds confirm/unsubscribe links AND is auto-added to CORS allowlist
SMTP_HOST           = smtp-relay.brevo.com
SMTP_PORT           = 587
SMTP_USER           = b29791001@smtp-brevo.com
SMTP_PASS           = <Brevo SMTP key>
MAIL_FROM           = ArabDiving <info@arabdiving.com>
MAIL_REPLY_TO       = info@arabdiving.com
MAIL_SENDER_NAME    = ArabDiving
MAIL_SENDER_ADDRESS = ArabDiving — info@arabdiving.com
CORS_ORIGIN         = https://arabdiving.com,https://www.arabdiving.com
```

All confirmed present in production as of the last `/health` call.

---

## 5. Mail provider history (important)

1. **Zoho was the first choice** — `info@arabdiving.com` is a real Zoho mailbox.
2. SMTP auth failed with:
   ```
   554 5.7.8 Access Restricted
   ```
3. **Root cause:** Zoho removed POP/IMAP/**SMTP** access from their **free** plan. Client-app sending is paid-only. Additionally Zoho Mail's ToS prohibits bulk/marketing sending even on paid plans (they push you to Zoho Campaigns / ZeptoMail).
4. **Decision:** send via **Brevo** relay, keep `From:` and `Reply-To:` as `info@arabdiving.com` so replies land in the existing Zoho inbox (receiving on Zoho free still works fine).

⚠️ **Open item — likely the remaining blocker.** Sending as `info@arabdiving.com` through Brevo requires that address/domain to be **authenticated in Brevo** (either "Add a sender" with email confirmation, or full domain authentication with DKIM/Brevo-code DNS records on `arabdiving.com`). **Whether this was completed was never confirmed.** If it wasn't, Brevo will reject the message and `mailer.js` will log `❌ فشل إرسال بريد التأكيد إلى ...: <reason>`.
Note: do **not** touch the existing Zoho **MX** records when adding Brevo DNS entries.

---

## 6. Debugging timeline (what was tried, what it proved)

### Symptom A — no email locally
- **Cause:** `backend/.env` had no `SMTP_*` keys at all → system was in DRY_RUN.
- **Fix:** added mail vars. `npm run mail-test -- <addr>` then **succeeded locally** → Brevo credentials and the sending code path are proven good.

### Symptom B — no email from the deployed site
- **Hypothesis 1:** env vars missing on Render (`.env` is gitignored, correctly).
  → Added all mail vars in Render. `/health` then reported `dryRun: false` and all SMTP fields set. **Ruled out.**
- **Hypothesis 2:** DB not reachable. `/health` reported `database.state: "متصل"` (connected). **Ruled out.**
- **Key observation:** `/health` reported `subscribers: 0` *after* a form submission → the request never reached the controller at all. This reframed the problem from "email" to "request rejected".
- **Hypothesis 3 (confirmed):** **CORS.** Browsers send an `Origin` header on POST **even for same-origin requests**. `subscribe.html` is served from `arabdiving-api.onrender.com`, but `CORS_ORIGIN` only listed `arabdiving.com` / `www.arabdiving.com`. The origin callback then called `callback(new Error("Not allowed by CORS"))`, producing a 500 with no CORS headers → browser `fetch` threw → the page showed a generic error, and **no subscriber row was ever created**. `GET /health` worked because direct navigation sends no `Origin`.
  Confirmed in Render logs:
  ```
  Error: Not allowed by CORS
      at origin (/opt/render/project/src/backend/src/server.js:62:23)
  ```

### Fixes applied
1. `lib/corsOrigins.js` — `APP_URL` is now always appended to the allowlist (trailing slashes normalised).
2. CORS rejection now `callback(null, false)` (clean) instead of throwing a 500, and **logs the rejected origin**:
   `🚫 CORS رفض الأصل: "<origin>" — المسموح: <list>`
3. Startup logs the resolved allowlist: `🌐 الأصول المسموح بها (CORS): ...`
4. `subscribe` responds before sending mail; send result logged as `✅`/`❌` with the reason.
5. `subscribe.html` now surfaces HTTP status + raw body instead of a generic message.

### State after the last deploy
```
🌐 الأصول المسموح بها (CORS): https://arabdiving.com | https://www.arabdiving.com | https://arabdiving-api.onrender.com
```
- No further `Not allowed by CORS` errors. **CORS issue resolved.**
- **No subscribe attempt appears in the logs since that deploy** — the form has not been retried, so `subscribers` is still 0 and mail delivery in production remains unverified.

Latest `/health`:
```json
{"success":true,
 "database":{"state":"متصل","subscribers":0,"error":null},
 "mail":{"dryRun":false,"smtpHost":"smtp-relay.brevo.com","smtpPort":"587",
         "smtpUserSet":true,"smtpPassSet":true,
         "mailFrom":"ArabDiving <info@arabdiving.com>",
         "appUrl":"https://arabdiving-api.onrender.com"},
 "cors":{"allowedOrigins":["https://arabdiving.com","https://www.arabdiving.com","https://arabdiving-api.onrender.com"],
         "yourOrigin":"(not sent — direct request)"}}
```

---

## 7. Next steps for whoever picks this up

1. **Reproduce.** Open `https://arabdiving-api.onrender.com/email/subscribe.html` (hard-refresh; wait for the service to wake), submit the form, and watch Render logs live.
   - Expected: green success message, `subscribers` → 1 in `/health`, and either `✅ بريد تأكيد أُرسل إلى …` or `❌ فشل … : <reason>`.
2. **If `❌` appears** → read the SMTP reason. Most likely Brevo sender/domain not authenticated (§5). Fix in Brevo → *Senders, Domains & Dedicated IPs*.
3. **If `✅` appears but nothing arrives** → check spam, then Brevo's *Transactional → Logs* for the per-message event (blocked / soft bounce / hard bounce).
4. **If nothing is logged at all** → the request still isn't reaching the app. Check the browser Network tab for the actual status and response body of `POST /api/newsletter/subscribe`.

### Known gaps / suggested improvements

- **The Next.js frontend has no signup form.** The only form is the backend-served `subscribe.html`. A form on `arabdiving.com` must call the absolute backend URL (`app/lib/api.ts` already points at `https://arabdiving-api.onrender.com`); its origin is already in `CORS_ORIGIN`.
- No retry/queue for failed sends — a failed confirmation email is logged and dropped. Consider a retry job or a `mailStatus` field on `Subscriber`.
- `emailAutomation.js` runs in-process via `setInterval`; on Render free the instance sleeps, so sequence steps only advance while the service is awake. Fine for now, needs a real scheduler at volume.
- Bulk campaign sending is synchronous in-process after the HTTP response; fine for small lists, should move to a queue later.
- Domain-level SPF/DKIM/DMARC for `arabdiving.com` should be completed for deliverability regardless of the sender-verification path chosen.
