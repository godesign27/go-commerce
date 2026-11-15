import { ListGroup, ListRow, MarketMark, Stepper } from '@/components/listly/bits'
import { Screen, Title } from '@/components/listly/screen'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { MARKETS, type MarketId } from '@/src/model'
import { useStore } from '@/src/store'
import { select } from '@/src/ui/feedback'
import { router } from 'expo-router'
import { useState } from 'react'

// R-33 step 2 · S-01 · C-02
export default function Markets() {
  const { s, set } = useStore()
  const [picked, setPicked] = useState<MarketId[]>(s.markets)
  const next = (markets: MarketId[]) => {
    set({ markets })
    router.push(s.account ? '/permissions' : '/account') // a held sign-in skips step 3 (DD-32)
  }
  return (
    <Screen
      back={{ label: 'Welcome', onPress: () => router.back() }}
      footer={
        <>
          <Button size="lg" disabled={!picked.length} onPress={() => next(picked)}>
            <Text>Continue</Text>
          </Button>
          <Button variant="ghost" onPress={() => next([])}>
            <Text>Skip — draft for all five</Text>
          </Button>
        </>
      }
    >
      <Stepper step={2} total={4} />
      <Title sub="Listly drafts a listing for each marketplace you pick. You can change this later in Profile.">Where do you sell?</Title>
      <ListGroup footer={picked.length ? `${picked.length} picked` : 'Pick at least one, or skip to draft for all five.'}>
        {MARKETS.map((m) => (
          <ListRow
            key={m.id}
            title={m.name}
            leading={<MarketMark id={m.id} />}
            checked={picked.includes(m.id)}
            onPress={() => {
              select()
              setPicked((p) => (p.includes(m.id) ? p.filter((x) => x !== m.id) : [...p, m.id]))
            }}
          />
        ))}
      </ListGroup>
    </Screen>
  )
}
