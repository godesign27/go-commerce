import { Field, Stepper } from '@/components/listly/bits'
import { Screen, Title } from '@/components/listly/screen'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { backendConfigured, supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { fetchProfile } from '@/src/backend'
import { TEST_ACCOUNT } from '@/src/devAccount'
import { useStore } from '@/src/store'
import { announce, success, warn } from '@/src/ui/feedback'
import { router, useLocalSearchParams } from 'expo-router'
import { Info } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'

// DD-33 · C-64, C-65. The code field takes iOS one-time-code autofill and paste (WCAG 3.3.8).
export default function EmailCode() {
  const { mode, email = '' } = useLocalSearchParams<{ mode?: 'up' | 'in'; email?: string }>()
  const up = mode !== 'in'
  const { set } = useStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const [wait, setWait] = useState(30)
  useEffect(() => {
    if (wait <= 0) return
    if (wait === 1) announce('You can send the email again.')
    const t = setTimeout(() => setWait((w) => w - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])

  const fail = (msg: string) => {
    warn()
    setError(msg)
    announce(msg)
  }
  const go = async () => {
    const digits = code.replace(/\D/g, '')
    // Supabase sends 6 digits by default; the project can be set to up to 8.
    if (digits.length < 6) return fail('Enter all 6 digits from the email.')
    setError(undefined)
    if (backendConfigured) {
      setBusy(true)
      const { data, error: e } = await supabase.auth.verifyOtp({ email, token: digits, type: 'email' })
      if (e || !data.session) {
        setBusy(false)
        return fail(/expired/i.test(e?.message ?? '') ? 'That code has expired. Send a new one.' : "That code didn't work. Check the latest email, or send a new one.")
      }
      success()
      set({ userId: data.session.user.id, account: { method: 'email', email } })
      // A returning seller who already agreed to the AI notice goes straight to Home (DD-31, DD-38).
      const profile = await fetchProfile()
      setBusy(false)
      if (profile?.noticeAt) {
        set({ onboarded: true })
        return router.replace('/(tabs)')
      }
      return router.replace('/permissions')
    }
    // No backend configured: on-device only, with the test account from DEV_ACCOUNTS.md.
    if (email === TEST_ACCOUNT.email && digits !== TEST_ACCOUNT.code) return fail("That code didn't work. Check the latest email, or send a new one.")
    success()
    set({ account: { method: 'email', email } })
    if (up) router.replace('/permissions')
    else {
      set({ onboarded: true })
      router.replace('/(tabs)')
    }
  }
  const resend = async () => {
    setWait(30)
    if (backendConfigured) {
      const { error: e } = await supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: up } })
      if (e) return fail(/rate|too many|seconds/i.test(e.message) ? 'Too many codes asked for. Wait a minute, then try again.' : `Couldn’t send the email. ${e.message}`)
    }
    announce(`New code sent to ${email}.`)
  }

  return (
    <Screen
      back={{ label: 'Email', onPress: () => router.back() }}
      footer={
        <>
          <Button size="lg" disabled={busy} onPress={go}>
            {busy ? <ActivityIndicator color="white" /> : <Text>Continue</Text>}
          </Button>
          <Button variant="outline" disabled={wait > 0} onPress={resend}>
            <Text>{wait > 0 ? `Send again in ${wait} s` : 'Send again'}</Text>
          </Button>
        </>
      }
    >
      {up ? <Stepper step={3} total={4} /> : null}
      <Title sub={`Listly sent a 6-digit code to ${email}. Type it here, or let your keyboard fill it in.`}>Check your email</Title>
      {!backendConfigured ? (
        <Alert icon={Info}>
          <AlertTitle>No email is sent in this build</AlertTitle>
          <AlertDescription>The backend isn't connected, so any 6 digits work. The test account is in DEV_ACCOUNTS.md.</AlertDescription>
        </Alert>
      ) : null}
      <Field label="6-digit code" error={error}>
        <Input
          value={code}
          onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 8))}
          aria-invalid={!!error}
          accessibilityLabel="6-digit code"
          accessibilityHint={error}
          className={cn('text-center text-2xl font-semibold tracking-[8px]', error && 'border-destructive border-2')}
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          maxLength={8}
          autoFocus
          onSubmitEditing={go}
        />
      </Field>
      <Text className="text-muted-foreground text-sm">Not there? Check your spam folder.</Text>
      <Button variant="link" className="self-start px-0" onPress={() => router.back()}>
        <Text>Use a different email</Text>
      </Button>
    </Screen>
  )
}
