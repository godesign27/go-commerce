# Signing in during development

Sign-in is passwordless by design (DD-33): a 6-digit code by email, or Apple. There is no password.

## With the backend connected (`.env.local` present)

Sign-in goes through Supabase Auth (project `rrfujnkudwvicgzxztjz`). Use a real inbox you control.

- **Before codes arrive**, the email templates must include the code. In the Supabase dashboard, open
  Authentication > Emails > Templates and add `{{ .Token }}` to both **Magic link** and **Confirm signup**,
  for example: `<p>Your Listly code: {{ .Token }}</p>`. Without it, Supabase emails a link instead.
- Supabase's built-in email sender only delivers to members of the Supabase organization and is heavily
  rate-limited. For anyone else, connect a sender such as Resend under Authentication > Emails > SMTP Settings.
- A fresh account starts on the trial with 3 free listings. The trial is enforced on the server.
- Apple sign-in needs the Apple provider enabled in Supabase with this app's bundle id. In Expo Go the bundle
  id is `host.exp.Exponent`. Until then Apple shows the failure state.
- Google is still a stand-in: it signs in on this device only, and nothing is saved to Supabase.

## Without the backend (no `.env.local`)

Everything stays on the device. These fake test values work:

| Purpose | Email | Code |
|---|---|---|
| Email sign-up or sign-in | `test@listly.dev` | `123456` |

Any other email accepts any 6 digits, because nothing is emailed.
