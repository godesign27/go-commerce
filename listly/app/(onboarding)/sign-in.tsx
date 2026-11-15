import { Screen, Title } from '@/components/listly/screen'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { useStore } from '@/src/store'
import { AppleButton, signInWithApple } from '@/src/ui/AppleSignIn'
import { announce, warn } from '@/src/ui/feedback'
import { router } from 'expo-router'
import { CircleAlert, Mail } from 'lucide-react-native'
import { useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

// Flow 10 · DD-31 · C-58, C-56. Sign in isn't an onboarding step: no stepper.
export default function SignIn() {
  const { set } = useStore()
  const [failed, setFailed] = useState(false)
  const [loading, setLoading] = useState(false)
  const done = (method: 'apple' | 'google', email: string) => {
    setLoading(true)
    announce('Getting your items.')
    // No server yet: a returning seller lands on Home with what the account holds (here, an empty trial).
    setTimeout(() => {
      set({ account: { method, email }, onboarded: true })
      router.replace('/(tabs)')
    }, 900)
  }
  const apple = async () => {
    const r = await signInWithApple()
    if (r === 'cancelled') return announce('Sign-in cancelled.')
    if (r === 'failed') {
      warn()
      return setFailed(true)
    }
    done('apple', r.email)
  }
  if (loading)
    return (
      <View className="bg-background flex-1 items-center justify-center gap-4" aria-busy accessibilityLabel="Getting your items">
        <ActivityIndicator size="large" />
        <Text className="text-xl font-semibold">Getting your items…</Text>
        <Text className="text-muted-foreground text-sm">Your items, listings and plan are on your account.</Text>
      </View>
    )
  return (
    <Screen
      back={{ label: 'Welcome', onPress: () => router.back() }}
      footer={
        <>
          <AppleButton onPress={apple} />
          <Button size="lg" variant="outline" onPress={() => done('google', 'seller@example.com')}>
            <Text className="text-lg font-bold">G</Text>
            <Text>Continue with Google</Text>
          </Button>
          <Button variant="ghost" onPress={() => router.push({ pathname: '/email', params: { mode: 'in' } })}>
            <Icon as={Mail} size={18} />
            <Text>Sign in with email</Text>
          </Button>
        </>
      }
    >
      <Title large sub="Sign in the way you did before, to get your items, listings and plan.">Welcome back</Title>
      {failed ? (
        <Alert icon={CircleAlert} variant="destructive">
          <AlertTitle>Couldn't sign you in.</AlertTitle>
          <AlertDescription>Your items are safe. Check your connection and try again, or use a different sign-in method.</AlertDescription>
          <Button variant="outline" size="sm" className="mt-3 self-start" onPress={() => done('apple', 'Not signed in')}>
            <Text>Continue without signing in (prototype)</Text>
          </Button>
        </Alert>
      ) : null}
    </Screen>
  )
}
