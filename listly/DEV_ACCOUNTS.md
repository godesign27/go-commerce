# Test accounts (development builds only)

There is no auth server yet, so sign-in is local to the app. These values are fake test values for
this build. Never use a real email or a real code here.

| Purpose | Email | Code |
|---|---|---|
| Email sign-up or sign-in | `test@listly.dev` | `123456` |

- Sign-in is passwordless by design (DD-33): an email link or a 6-digit code. There is no password.
- With the test email, only the code above is accepted. Any other email accepts any 6 digits, because
  nothing is emailed in this build.
- Apple: the simulator's Apple ID works, or it shows the failure state with "Continue without signing in".
- Google: stubbed until the Google sign-in SDK is connected.

When auth is connected (proposed: Supabase Auth with email OTP, Apple and Google, and Resend as the
email sender), replace this file with the seed accounts the backend creates.
