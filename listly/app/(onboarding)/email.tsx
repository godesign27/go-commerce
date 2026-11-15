import { Field, Stepper } from '@/components/listly/bits'
import { Screen, Title } from '@/components/listly/screen'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { announce } from '@/src/ui/feedback'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'

// DD-33 · C-62, C-63. Checked when the seller taps Send, not while typing.
export default function Email() {
  const { mode } = useLocalSearchParams<{ mode?: 'up' | 'in' }>()
  const up = mode !== 'in'
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string>()
  const send = () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError('Enter an email address like name@example.com.')
      return announce('Enter an email address like name@example.com.')
    }
    setError(undefined)
    router.push({ pathname: '/email-code', params: { mode: up ? 'up' : 'in', email: email.trim() } })
  }
  return (
    <Screen
      back={{ label: up ? 'Sign-up options' : 'Sign-in options', onPress: () => router.back() }}
      footer={
        <Button size="lg" onPress={send}>
          <Text>Send link and code</Text>
        </Button>
      }
    >
      {up ? <Stepper step={3} total={4} /> : null}
      <Title sub="Listly will email you a link and a 6-digit code. No password needed.">{up ? 'Continue with email' : 'Sign in with email'}</Title>
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
