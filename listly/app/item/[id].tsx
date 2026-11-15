import { Field, IconBadge, ListGroup, ListRow, MarketMark, ThumbStrip } from '@/components/listly/bits'
import { MoneyBreakdown } from '@/components/listly/money'
import { Overline, Screen } from '@/components/listly/screen'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { money } from '@/src/fees'
import { liveElsewhere, marketName, today } from '@/src/model'
import { useStore } from '@/src/store'
import { announce, success } from '@/src/ui/feedback'
import { router, useLocalSearchParams } from 'expo-router'
import { Package } from 'lucide-react-native'
import { useState } from 'react'
import { Alert, View } from 'react-native'

function StatusBadge({ label, tone }: { label: string; tone: 'live' | 'sold' | 'removed' | 'ready' | 'alarm' }) {
  return (
    <Badge variant={tone === 'sold' ? 'success' : tone === 'alarm' ? 'outline' : tone === 'live' ? 'accent' : 'secondary'} className={tone === 'alarm' ? 'border-destructive' : undefined}>
      <Text className={tone === 'alarm' ? 'text-destructive' : undefined}>{label}</Text>
    </Badge>
  )
}

// R-42 · S-58, S-59 · DD-16, DD-17, DD-18, DD-19, DD-23
export default function ItemDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { s, updateListing, deleteListing } = useStore()
  const it = s.listings.find((x) => x.id === id)
  const [costDraft, setCostDraft] = useState<string | null>(null)
  if (!it) return null
  const live = liveElsewhere(it)
  const f = it.facts
  const pass = s.plan === 'pass'

  const saveCost = () => {
    const n = parseFloat((costDraft ?? '').replace(/[^0-9.]/g, ''))
    if (Number.isNaN(n)) return setCostDraft(null)
    updateListing(it.id, (x) => ({ cost: n, history: [...x.history, `${today()} · Cost set to ${money(n)}`] }))
    setCostDraft(null)
    success()
    announce(`What you paid saved: ${money(n)}.`)
  }
  const revert = () =>
    Alert.alert('Change back to listed?', 'The sale is removed from your profit. Relist it anywhere you took it down.', [
      { text: 'Keep it sold', style: 'cancel' },
      {
        text: 'Change back',
        onPress: () => {
          updateListing(it.id, (x) => ({ status: 'listed', sale: undefined, listedOn: x.listedOn.filter((m) => !x.removed.includes(m)), removed: [], history: [...x.history, `${today()} · Changed back to listed (a change you made)`] }))
          announce(`${it.name} is listed again.`)
        },
      },
    ])
  const remove = () =>
    Alert.alert(`Delete ${it.name}?`, "This can't be undone. Your listings on the marketplaces aren't changed, and photos saved to your phone stay there.", [
      { text: 'Keep it', style: 'cancel' },
      {
        text: `Delete ${it.name}`,
        style: 'destructive',
        onPress: () => {
          deleteListing(it.id)
          announce(`${it.name} deleted.`)
          router.back()
        },
      },
    ])

  const status = it.status === 'sold' ? (live.length ? { label: `Sold · still live on ${live.length}`, tone: 'alarm' as const } : { label: `Sold ${it.sale?.date ?? ''}`, tone: 'sold' as const }) : it.status === 'listed' ? { label: `Listed on ${it.listedOn.length}`, tone: 'live' as const } : { label: 'Not listed yet', tone: 'ready' as const }

  return (
    <Screen
      tone="grouped"
      back={{ label: 'Listings', onPress: () => router.back() }}
      footer={
        it.status === 'sold' ? (
          live.length ? (
            <Button size="lg" onPress={() => router.push({ pathname: '/checklist/[id]', params: { id: it.id } })}>
              <Text>Remove it from {live.length} {live.length === 1 ? 'marketplace' : 'marketplaces'}</Text>
            </Button>
          ) : (
            <Button size="lg" variant="outline" onPress={revert}>
              <Text>Change back to listed</Text>
            </Button>
          )
        ) : (
          <Button size="lg" onPress={() => router.push({ pathname: '/sold/[id]', params: { id: it.id } })}>
            <Text>Mark sold</Text>
          </Button>
        )
      }
    >
      <View className="gap-3">
        {it.photos.length ? <ThumbStrip uris={it.photos} size={72} /> : <IconBadge icon={Package} size={72} tone="muted" />}
        <Text role="heading" className="text-[28px] font-bold leading-[34px] tracking-tight">
          {it.name}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          <StatusBadge {...status} />
          {f.bin ? (
            <Badge variant="secondary">
              <Text>Bin {f.bin}</Text>
            </Badge>
          ) : null}
        </View>
      </View>

      <View className="gap-2">
        <Overline>Where it's listed</Overline>
        {it.listedOn.length ? (
          <ListGroup>
            {it.listedOn.map((m) => {
              const soldHere = it.sale?.on === m
              const removed = it.removed.includes(m)
              const stillLive = it.status === 'sold' && !soldHere && !removed
              return (
                <ListRow
                  key={m}
                  title={marketName(m)}
                  leading={<MarketMark id={m} />}
                  trailing={<StatusBadge label={soldHere ? 'Sold here' : removed ? 'You removed it' : stillLive ? 'Still live' : 'Live'} tone={soldHere ? 'sold' : removed ? 'removed' : stillLive ? 'alarm' : 'live'} />}
                />
              )
            })}
          </ListGroup>
        ) : (
          <Card className="px-4 py-4">
            <Text className="text-muted-foreground text-base">Not listed anywhere yet. Copy the listings from your haul, then mark where you posted it.</Text>
          </Card>
        )}
      </View>

      {it.sale ? (
        <View className="gap-2">
          <Overline>Sale</Overline>
          <Card className="px-4 py-3">
            <MoneyBreakdown item={it} />
          </Card>
        </View>
      ) : null}

      {!pass ? (
        <View className="gap-2">
          <Overline>What you paid</Overline>
          <Card className="gap-3 px-4 py-4">
            {costDraft === null ? (
              <View className="flex-row items-center justify-between">
                <Text className={it.cost === null ? 'text-muted-foreground text-base' : 'text-base font-semibold'}>{it.cost === null ? 'Not entered' : money(it.cost)}</Text>
                <Button variant="secondary" size="sm" onPress={() => setCostDraft(it.cost === null ? '' : String(it.cost))}>
                  <Text>{it.cost === null ? 'Add what you paid' : 'Edit'}</Text>
                </Button>
              </View>
            ) : (
              <>
                <Field label="What you paid" helper="$0 is fine if it cost you nothing.">
                  <Input value={costDraft} onChangeText={setCostDraft} accessibilityLabel="What you paid" keyboardType="decimal-pad" placeholder="$0.00" autoFocus onSubmitEditing={saveCost} />
                </Field>
                <View className="flex-row gap-2">
                  <Button size="sm" onPress={saveCost}>
                    <Text>Save</Text>
                  </Button>
                  <Button size="sm" variant="ghost" onPress={() => setCostDraft(null)}>
                    <Text>Cancel</Text>
                  </Button>
                </View>
              </>
            )}
          </Card>
        </View>
      ) : null}

      <View className="gap-2">
        <Overline>Facts</Overline>
        <ListGroup>
          <ListRow title="Brand" trailing={f.brand || 'Not given'} />
          <ListRow title="Size" trailing={f.size || 'Not given'} />
          <ListRow title="Condition" trailing={f.cond || 'Not given'} />
          <ListRow title="Flaws" trailing={f.noFlaws ? 'None' : f.flaws || 'Not given'} />
          {f.meas ? <ListRow title="Measurements" subtitle={f.meas} /> : null}
          <ListRow title="Your price" trailing={it.price ? money(Number(it.price)) : 'Not set'} />
        </ListGroup>
      </View>

      {it.history.length ? (
        <View className="gap-2">
          <Overline>History</Overline>
          <Card className="gap-2 px-4 py-4">
            {[...it.history].reverse().map((h, i) => (
              <Text key={i} className="text-muted-foreground text-sm">
                {h}
              </Text>
            ))}
          </Card>
        </View>
      ) : null}

      <View className="gap-2">
        {it.status === 'sold' && live.length ? (
          <Button variant="outline" onPress={revert}>
            <Text>Change back to listed</Text>
          </Button>
        ) : null}
        <Button variant="ghost" onPress={remove}>
          <Text className="text-destructive">Delete item</Text>
        </Button>
      </View>
    </Screen>
  )
}
