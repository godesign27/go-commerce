import { Chip, Field } from '@/components/listly/bits'
import { Screen, Title } from '@/components/listly/screen'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useStore } from '@/src/store'
import { announce, success } from '@/src/ui/feedback'
import { router } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

// R-31 · DD-42 · C-80
export default function SetupDefaults() {
  const { s, set } = useStore()
  const [ship, setShip] = useState(s.shipBy)
  const [bin, setBin] = useState(s.defaultBin)
  return (
    <Screen
      back={{ label: 'Close', onPress: () => router.back() }}
      footer={
        <Button
          size="lg"
          onPress={() => {
            set({ shipBy: ship, defaultBin: bin.trim() || 'B1', defaultsSet: true })
            success()
            announce('Selling defaults saved.')
            router.back()
          }}
        >
          <Text>Save defaults</Text>
        </Button>
      }
    >
      <Title sub="These fill in for you on each item. Change them any time, here or in Profile.">Selling defaults</Title>
      <Field label="Shipping, usually">
        <View className="flex-row flex-wrap gap-2" accessibilityRole="radiogroup">
          {(
            [
              ['buyer', 'Buyer pays'],
              ['me', 'I pay'],
              ['free', 'Free shipping'],
            ] as const
          ).map(([v, l]) => (
            <Chip key={v} mode="single" label={l} selected={ship === v} onPress={() => setShip(v)} />
          ))}
        </View>
      </Field>
      <Field label="Default bin" helper={'Where you usually keep new items, like "B1" or "Hall closet". Only you see it.'}>
        <Input value={bin} onChangeText={setBin} accessibilityLabel="Default bin" />
      </Field>
    </Screen>
  )
}
