import { Chip, Field } from '@/components/listly/bits'
import { Screen, Title } from '@/components/listly/screen'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { MARKETS, marketName, today, type MarketId, type ShipBy } from '@/src/model'
import { useStore } from '@/src/store'
import { setSaleBefore } from '@/src/undo'
import { announce, success } from '@/src/ui/feedback'
import { router, useLocalSearchParams } from 'expo-router'
import { Archive } from 'lucide-react-native'
import { useState } from 'react'
import { View } from 'react-native'

// R-14 · S-27 · D-5, D-9 · DD-13: shipping is one three-way choice, preselected from Selling defaults; skipping it is allowed.
export default function MarkSold() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { s, updateListing } = useStore()
  const it = s.listings.find((x) => x.id === id)
  const where = it?.listedOn.length ? it.listedOn : MARKETS.map((m) => m.id)
  const [on, setOn] = useState<MarketId | null>(where.length === 1 ? where[0] : null)
  const [price, setPrice] = useState(it?.price ?? '')
  const [ship, setShip] = useState<ShipBy>(s.shipBy)
  const [amt, setAmt] = useState('')
  const [skipShip, setSkipShip] = useState(false)
  const [error, setError] = useState<string>()
  if (!it) return null

  const submit = () => {
    const p = parseFloat(price.replace(/[^0-9.]/g, ''))
    if (!on) return setError('Pick where it sold.')
    if (Number.isNaN(p)) return setError('Enter the sale price in dollars, like 38.00.')
    const a = parseFloat(amt.replace(/[^0-9.]/g, ''))
    const shipping = skipShip ? null : ship === 'buyer' ? { by: ship, amt: 0 } : { by: ship, amt: Number.isNaN(a) ? null : a }
    setSaleBefore(s.listings)
    updateListing(it.id, (x) => ({
      status: 'sold',
      sale: { on, price: p, ship: shipping, date: today() },
      removed: [],
      history: [...x.history, `${today()} · Sold on ${marketName(on)} for $${p.toFixed(2)}${!shipping || shipping.amt === null ? ' (shipping not entered)' : ''}`],
    }))
    success()
    announce(`Marked sold on ${marketName(on)}.`)
    router.replace({ pathname: '/checklist/[id]', params: { id: it.id, fresh: '1' } })
  }
  const others = it.listedOn.filter((m) => m !== on).length

  return (
    <Screen
      back={{ label: 'Cancel', onPress: () => router.back(), close: true }}
      footer={
        <>
          {error ? (
            <Text className="text-destructive text-center text-sm font-medium" accessibilityLiveRegion="polite">
              {error}
            </Text>
          ) : null}
          <Button size="lg" onPress={submit}>
            <Text>Mark sold</Text>
          </Button>
        </>
      }
    >
      <Title sub={on && others ? `Next, Listly helps you take it down from the other ${others}.` : undefined}>Mark {it.name} sold</Title>
      {it.facts.bin ? (
        <View className="bg-accent flex-row items-center gap-3 rounded-xl p-4" accessible accessibilityLabel={`Take it from bin ${it.facts.bin}`}>
          <Icon as={Archive} size={22} className="text-accent-foreground" />
          <Text className="text-accent-foreground text-base font-semibold">Take it from bin {it.facts.bin}</Text>
        </View>
      ) : null}
      <Field label="Where did it sell?">
        <View className="flex-row flex-wrap gap-2" accessibilityRole="radiogroup">
          {where.map((m) => (
            <Chip key={m} mode="single" label={marketName(m)} selected={on === m} onPress={() => { setOn(m); setError(undefined) }} />
          ))}
        </View>
      </Field>
      <Field label="Sale price">
        <Input value={price} onChangeText={(v) => setPrice(v.replace(/[^0-9.]/g, ''))} accessibilityLabel="Sale price" keyboardType="decimal-pad" placeholder="$0.00" />
      </Field>
      <View className={cn('gap-3', skipShip && 'opacity-50')}>
        <Field label="Shipping">
          <View className="flex-row flex-wrap gap-2" accessibilityRole="radiogroup">
            {(
              [
                ['buyer', 'Buyer paid'],
                ['me', 'I paid'],
                ['free', 'Free shipping (I paid)'],
              ] as const
            ).map(([v, l]) => (
              <Chip key={v} mode="single" label={l} selected={!skipShip && ship === v} onPress={() => { setShip(v); setSkipShip(false) }} />
            ))}
          </View>
        </Field>
        {!skipShip && ship !== 'buyer' ? (
          <Field label="What you paid for shipping" helper="Leave it blank if you don't know yet. Profit shows as an estimate until you add it.">
            <Input value={amt} onChangeText={setAmt} accessibilityLabel="What you paid for shipping" keyboardType="decimal-pad" placeholder="$0.00" />
          </Field>
        ) : null}
      </View>
      <Button variant="link" className="self-start px-0" onPress={() => setSkipShip((v) => !v)}>
        <Text>{skipShip ? 'Add shipping now' : 'Add shipping later'}</Text>
      </Button>
    </Screen>
  )
}
