import { Stepper } from '@/components/listly/bits'
import { Screen, Title } from '@/components/listly/screen'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { useStore } from '@/src/store'
import { AppleButton, signInWithApple } from '@/src/ui/AppleSignIn'
import { announce, warn } from '@/src/ui/feedback'
import { router } from 'expo-router'
import { CircleAlert, Lock, Mail } from 'lucide-react-native'
import { useState } from 'react'
import { View } from 'react-native'

// R-33 step 3 · S-02 · C-03 · DD-34
export default function Account() {
  const { set } = useStore()
  const [failed, setFailed] = useState(false)
  const done = (method: 'apple' | 'google', email: string) => {
    set({ account: { method, email } })
    announce('Account created. Step 4 of 4.')
    router.push('/permissions')
  }
  const apple = async () => {
    const r = await signInWithApple()
    if (r === 'cancelled') return announce('Sign-in cancelled.')
    if (r === 'failed') {
      warn()
      setFailed(true)
      return announce("Couldn't create your account.")
    }
    done('apple', r.email)
  }
  return (
    <Screen
      back={{ label: 'Marketplaces', onPress: () => router.back() }}
      footer={
        <>
          <AppleButton onPress={apple} />
          {/* Google Sign-In isn't connected yet; this stands in for it. */}
          <Button size="lg" variant="outline" onPress={() => done('google', 'seller@example.com')}>
            <Text className="text-lg font-bold">G</Text>
            <Text>Continue with Google</Text>
          </Button>
          <Button variant="ghost" onPress={() => router.push({ pathname: '/email', params: { mode: 'up' } })}>
            <Icon as={Mail} size={18} />
            <Text>Continue with email</Text>
          </Button>
        </>
      }
    >
      <Stepper step={3} total={4} />
      <Title sub="Create an account so your items, listings and sales are kept if you change phones.">Save your listings</Title>
      {failed ? (
        <Alert icon={CircleAlert} variant="destructive">
          <AlertTitle>Couldn't create your account.</AlertTitle>
          <AlertDescription>Nothing was saved. Check your connection and try again.</AlertDescription>
          <Button variant="outline" size="sm" className="mt-3 self-start" onPress={() => done('apple', 'Not signed in')}>
            <Text>Continue without signing in (prototype)</Text>
          </Button>
        </Alert>
      ) : null}
      <View className="flex-row items-center gap-3">
        <Icon as={Lock} size={18} className="text-muted-foreground" />
        <Text className="text-muted-foreground flex-1 text-sm">Still free: your first 3 listings need no card. Listly never asks for your marketplace passwords.</Text>
      </View>
    </Screen>
  )
}
