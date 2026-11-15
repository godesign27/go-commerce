import { MarketMark } from '@/components/listly/bits'
import { MoneyBreakdown } from '@/components/listly/money'
import { Overline, Screen, Title } from '@/components/listly/screen'
import { UndoBar } from '@/components/listly/undo-bar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { liveElsewhere, marketName, today, type Item, type MarketId } from '@/src/model'
import { useStore } from '@/src/store'
import { getSaleBefore, setSaleBefore } from '@/src/undo'
import { announce, success, tap } from '@/src/ui/feedback'
import { router, useLocalSearchParams } from 'expo-router'
import { Archive, Check, CircleCheckBig, ExternalLink, TriangleAlert } from 'lucide-react-native'
import { useCallback, useState } from 'react'
import { Pressable, View } from 'react-native'
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated'

type Undo = { msg: string; before: Item[] | null }

// R-15 · S-28, S-59 · D-2, D-6, D-10 · DD-14, DD-22. The checklist that stops one item selling twice.
export default function Checklist() {
  const { id, fresh } = useLocalSearchParams<{ id: string; fresh?: string }>()
  const { s, updateListing, setListings } = useStore()
  const it = s.listings.find((x) => x.id === id)
  const [undo, setUndo] = useState<Undo | null>(fresh ? { msg: 'Marked sold.', before: getSaleBefore() } : null)
  const close = useCallback(() => setUndo(null), [])
  if (!it || !it.sale) return null
  const others = it.listedOn.filter((m) => m !== it.sale!.on)
  const live = liveElsewhere(it)
  const done = live.length === 0

  const tick = (m: MarketId) => {
    const before = s.listings
    tap()
    updateListing(it.id, (x) => ({ removed: [...x.removed, m], history: [...x.history, `${today()} · Removed from ${marketName(m)}`] }))
    const left = live.length - 1
    setUndo({ msg: `Marked removed from ${marketName(m)}.`, before })
    if (left === 0) success()
    announce(`Marked removed from ${marketName(m)}. ${left ? `${left} left.` : 'All done.'} Undo is available.`)
  }
  const doUndo = () => {
    if (undo?.before) setListings(undo.before)
    const wasSale = undo?.msg === 'Marked sold.'
    setUndo(null)
    announce(wasSale ? `Undone. ${it.name} is listed again.` : 'Undone.')
    if (wasSale) router.back()
  }
  const doUndoSale = () => {
    const b = getSaleBefore()
    if (b) setListings(b)
    setSaleBefore(null)
    setUndo(null)
    announce(`Undone. ${it.name} is listed again, and your ticks are cleared.`)
    router.back()
  }

  return (
    <Screen
      tone="grouped"
      back={{ label: 'Item', onPress: () => router.back() }}
      footer={
        <>
          {undo ? <UndoBar message={undo.msg} onUndo={doUndo} onUndoSale={undo.msg !== 'Marked sold.' && getSaleBefore() ? doUndoSale : undefined} onClose={close} keep={s.keepUndo} /> : null}
          {done ? (
            <Button size="lg" onPress={() => router.navigate('/(tabs)/profit')}>
              <Text>See profit</Text>
            </Button>
          ) : (
            <Button size="lg" variant="outline" onPress={() => router.navigate('/(tabs)')}>
              <Text>Done for now</Text>
            </Button>
          )}
        </>
      }
    >
      {done ? (
        <Animated.View entering={FadeIn.duration(260)} className="items-center gap-3 pt-4">
          <Animated.View entering={ZoomIn.springify().damping(12)} className="bg-success-soft size-20 items-center justify-center rounded-full">
            <Icon as={CircleCheckBig} size={40} className="text-success" />
          </Animated.View>
          <Text role="heading" className="text-center text-[28px] font-bold tracking-tight">
            {others.length ? 'Down everywhere else' : 'Sold'}
          </Text>
          <Text className="text-muted-foreground text-center text-base">
            {it.name} sold on {marketName(it.sale.on)}. {others.length ? "It can't sell twice now." : ''}
          </Text>
        </Animated.View>
      ) : (
        <>
          <Title sub={`${it.name} sold on ${marketName(it.sale.on)}. Take it down from the others so it can't sell twice.`}>Remove it everywhere else</Title>
          <Alert icon={TriangleAlert} variant="destructive" className="border-destructive border-2">
            <AlertTitle>Needs action</AlertTitle>
            <AlertDescription>Still live on {live.map(marketName).join(' and ')}.</AlertDescription>
          </Alert>
        </>
      )}

      {it.facts.bin ? (
        <View className="bg-accent flex-row items-center gap-3 rounded-xl p-4" accessible accessibilityLabel={`Take it from bin ${it.facts.bin}`}>
          <Icon as={Archive} size={22} className="text-accent-foreground" />
          <Text className="text-accent-foreground text-base font-semibold">Take it from bin {it.facts.bin}</Text>
        </View>
      ) : null}

      {others.length ? (
        <View className="gap-2">
          <Overline right={<Badge variant={done ? 'success' : 'secondary'}><Text>{others.length - live.length} of {others.length} removed</Text></Badge>}>Your other listings</Overline>
          <View className="bg-card border-border overflow-hidden rounded-xl border">
            {others.map((m, i) => {
              const removed = it.removed.includes(m)
              return (
                <View key={m} className={cn('gap-3 px-4 py-4', i && 'border-border border-t')}>
                  <View className="flex-row items-center gap-3">
                    <MarketMark id={m} />
                    <Text className="flex-1 text-base font-semibold">{marketName(m)}</Text>
                    <Badge variant={removed ? 'success' : 'outline'} className={removed ? undefined : 'border-destructive'}>
                      <Text className={removed ? undefined : 'text-destructive'}>{removed ? 'You removed it' : 'Still live'}</Text>
                    </Badge>
                  </View>
                  {!removed ? (
                    <View className="flex-row gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onPress={() => announce(`Opens ${marketName(m)}. Search your listings for ${it.name}.`)}>
                        <Icon as={ExternalLink} size={16} />
                        <Text>Open {marketName(m).replace(' Marketplace', '')}</Text>
                      </Button>
                      <Pressable
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: false }}
                        accessibilityLabel={`I removed it from ${marketName(m)}`}
                        onPress={() => tick(m)}
                        className="bg-primary h-11 flex-1 flex-row items-center justify-center gap-2 rounded-md active:opacity-90"
                      >
                        <View className="border-primary-foreground size-5 rounded border-2" />
                        <Text className="text-primary-foreground text-sm font-semibold">I removed it</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <View className="flex-row items-center gap-2">
                      <Icon as={Check} size={16} className="text-success" />
                      <Text className="text-muted-foreground text-sm">Ticked {today()}</Text>
                    </View>
                  )}
                </View>
              )
            })}
          </View>
          {!done ? <Text className="text-muted-foreground px-1 text-sm">Listly can't take listings down for you: these marketplaces don't allow it. Tick each one once you've removed it.</Text> : null}
        </View>
      ) : null}

      {done ? (
        <View className="gap-2">
          <Overline>What you made</Overline>
          <Card className="px-4 py-3">
            <MoneyBreakdown item={it} />
          </Card>
          {it.cost === null ? (
            <Button variant="link" className="self-start px-0" onPress={() => router.push({ pathname: '/item/[id]', params: { id: it.id } })}>
              <Text>Add what you paid</Text>
            </Button>
          ) : null}
        </View>
      ) : null}
    </Screen>
  )
}
