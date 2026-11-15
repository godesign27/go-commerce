import { Field, Stepper } from '@/components/listly/bits'
import { Screen, Title } from '@/components/listly/screen'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { backendConfigured, supabase } from '@/lib/supabase'
import { announce } from '@/src/ui/feedback'
import { ActivityIndicator } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'

// DD-33 · C-62, C-63. Checked when the seller taps Send, not while typing.
export default function Email() {
  const { mode } = useLocalSearchParams<{ mode?: 'up' | 'in' }>()
  const up = mode !== 'in'
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const send = async () => {
    const address = email.trim().toLowerCase()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(address)) {
      setError('Enter an email address like name@example.com.')
      return announce('Enter an email address like name@example.com.')
    }
    setError(undefined)
    if (backendConfigured) {
      setBusy(true)
      // Sign-in never creates an account by surprise (DD-32): an unknown email is told so.
      const { error: e } = await supabase.auth.signInWithOtp({ email: address, options: { shouldCreateUser: up } })
      setBusy(false)
      if (e) {
        const msg = /signups not allowed|user not found/i.test(e.message)
          ? 'There’s no Listly account for this email. Check the address, or go back and create an account.'
          : /rate|too many|seconds/i.test(e.message)
            ? 'Too many codes asked for. Wait a minute, then try again.'
            : `Couldn’t send the email. ${e.message}`
        setError(msg)
        return announce(msg)
      }
    }
    announce(`Email sent to ${address}.`)
    router.push({ pathname: '/email-code', params: { mode: up ? 'up' : 'in', email: address } })
  }
  return (
    <Screen
      back={{ label: up ? 'Sign-up options' : 'Sign-in options', onPress: () => router.back() }}
      footer={
        <Button size="lg" disabled={busy} onPress={send}>
          {busy ? <ActivityIndicator color="white" /> : <Text>Send code</Text>}
        </Button>
      }
    >
      {up ? <Stepper step={3} total={4} /> : null}
      <Title sub="Listly will email you a 6-digit code. No password needed.">{up ? 'Continue with email' : 'Sign in with email'}</Title>
      <Field label="Email address" error={error}>
        <Input
          value={email}
          onChangeText={setEmail}
          aria-invalid={!!error}
          accessibilityLabel="Email address"
          accessibilityHint={error}
          className={cn(error && 'border-destructive border-2')}
          keyboardType="email-address"
          autoComplete="email"
          textContentType="emailAddress"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus
          returnKeyType="send"
          onSubmitEditing={send}
          placeholder="name@example.com"
        />
      </Field>
    </Screen>
  )
}
