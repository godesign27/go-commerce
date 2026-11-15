import { Field, Stepper } from '@/components/listly/bits'
import { Screen, Title } from '@/components/listly/screen'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { TEST_ACCOUNT } from '@/src/devAccount'
import { useStore } from '@/src/store'
import { announce, success } from '@/src/ui/feedback'
import { router, useLocalSearchParams } from 'expo-router'
import { Info } from 'lucide-react-native'
import { useEffect, useState } from 'react'

// DD-33 · C-64, C-65. The code field takes iOS one-time-code autofill and paste (WCAG 3.3.8).
export default function EmailCode() {
  const { mode, email = '' } = useLocalSearchParams<{ mode?: 'up' | 'in'; email?: string }>()
  const up = mode !== 'in'
  const isTest = email.toLowerCase() === TEST_ACCOUNT.email
  const { set } = useStore()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>()
  const [wait, setWait] = useState(30)
  useEffect(() => {
    if (wait <= 0) return
    if (wait === 1) announce('You can send the email again.')
    const t = setTimeout(() => setWait((w) => w - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])
  const go = () => {
    const digits = code.replace(/\D/g, '')
    if (digits.length !== 6) {
      setError('Enter all 6 digits from the email.')
      return announce('Enter all 6 digits from the email.')
    }
    if (isTest && digits !== TEST_ACCOUNT.code) {
      setError("That code didn't work. Check the latest email, or send a new one.")
      return announce("That code didn't work.")
    }
    success()
    set({ account: { method: 'email', email } })
    if (up) router.replace('/permissions')
    else {
      set({ onboarded: true })
      router.replace('/(tabs)')
    }
  }
  return (
    <Screen
      back={{ label: 'Email', onPress: () => router.back() }}
      footer={
        <>
          <Button size="lg" onPress={go}>
            <Text>Continue</Text>
          </Button>
          <Button variant="outline" disabled={wait > 0} onPress={() => { setWait(30); announce(`New link and code sent to ${email}.`) }}>
            <Text>{wait > 0 ? `Send again in ${wait} s` : 'Send again'}</Text>
          </Button>
        </>
      }
    >
      {up ? <Stepper step={3} total={4} /> : null}
      <Title sub={`Listly sent a link and a 6-digit code to ${email}. Open the link on this phone, or type the code here.`}>Check your email</Title>
      {!isTest ? (
        <Alert icon={Info}>
          <AlertTitle>No email is sent in this build</AlertTitle>
          <AlertDescription>Email isn't connected yet, so any 6 digits work. To test the real check, use the test account in DEV_ACCOUNTS.md.</AlertDescription>
        </Alert>
      ) : null}
      <Field label="6-digit code" error={error}>
        <Input
          value={code}
          onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
          aria-invalid={!!error}
          accessibilityLabel="6-digit code"
          accessibilityHint={error}
          className={cn('text-center text-2xl font-semibold tracking-[8px]', error && 'border-destructive border-2')}
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          maxLength={6}
          autoFocus
        />
      </Field>
      <Button variant="link" className="self-start px-0" onPress={() => router.back()}>
        <Text>Use a different email</Text>
      </Button>
    </Screen>
  )
}
