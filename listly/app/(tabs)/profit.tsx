import { IconBadge, ListGroup, ListRow, Thumb } from '@/components/listly/bits'
import { Overline, Screen } from '@/components/listly/screen'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { breakdown, money } from '@/src/fees'
import { MARKETS, marketName } from '@/src/model'
import { useStore } from '@/src/store'
import { router } from 'expo-router'
import { ChartColumn, CircleAlert, Package } from 'lucide-react-native'
import { View } from 'react-native'

// R-16, R-17 · S-30, S-31 · D-9 · DD-18. Net after fees, shipping and cost; anything missing makes it an estimate, and says so.
export default function Profit() {
  const { s } = useStore()
  const rows = s.listings.filter((i) => i.status === 'sold' && i.sale).map((it) => ({ it, b: breakdown(it)! }))
  const net = rows.reduce((n, r) => n + r.b.net, 0)
  const sales = rows.reduce((n, r) => n + r.b.sale, 0)
  const estimate = rows.some((r) => r.b.estimate)
  const noCost = rows.filter((r) => r.b.cost === null)
  const noShip = rows.filter((r) => r.b.ship === null)
  const byMarket = MARKETS.map((m) => {
    const mine = rows.filter((r) => r.it.sale!.on === m.id)
    return { m, n: mine.length, total: mine.reduce((t, r) => t + r.b.net, 0) }
  }).filter((x) => x.n)
  const max = Math.max(1, ...byMarket.map((x) => Math.abs(x.total)))

  return (
    <Screen tone="grouped">
      <Text role="heading" className="text-[34px] font-bold leading-[41px] tracking-tight">
        Profit
      </Text>
      <Card className="gap-1 px-5 py-5">
        <Text className="text-muted-foreground text-sm font-medium">{estimate ? 'Net profit (estimate)' : 'Net profit'}</Text>
        <Text className="text-[40px] font-bold leading-[48px] tracking-tight" accessibilityLabel={`${estimate ? 'Net profit, estimate' : 'Net profit'}, ${money(net)}`}>
          {money(net)}
        </Text>
        <Text className="text-muted-foreground text-sm">
          {rows.length} sold · {money(sales)} in sales · after fees, shipping and what you paid
        </Text>
      </Card>

      {noCost.length || noShip.length ? (
        <Alert icon={CircleAlert}>
          <AlertTitle>Some sales are estimates</AlertTitle>
          <AlertDescription>
            {[noCost.length ? `${noCost.length} with no cost` : '', noShip.length ? `${noShip.length} with no shipping` : ''].filter(Boolean).join(' and ')}. They count as $0 until you add them.
          </AlertDescription>
          <Button variant="outline" size="sm" className="mt-3 self-start" onPress={() => router.push({ pathname: '/item/[id]', params: { id: (noCost[0] ?? noShip[0]).it.id } })}>
            <Text>Add the missing amounts</Text>
          </Button>
        </Alert>
      ) : null}

      {byMarket.length ? (
        <View className="gap-2">
          <Overline>By marketplace</Overline>
          <Card className="gap-4 px-4 py-4">
            {byMarket.map(({ m, total, n }) => (
              <View key={m.id} className="gap-1.5" accessible accessibilityLabel={`${m.name}: ${money(total)} from ${n} ${n === 1 ? 'sale' : 'sales'}`}>
                <View className="flex-row justify-between">
                  <Text className="text-base">{m.name}</Text>
                  <Text className="text-base font-semibold">{money(total)}</Text>
                </View>
                <View className="bg-muted h-2 overflow-hidden rounded-full">
                  <View className="bg-primary h-full rounded-full" style={{ width: `${Math.max(4, (Math.abs(total) / max) * 100)}%` }} />
                </View>
              </View>
            ))}
          </Card>
        </View>
      ) : null}

      {rows.length ? (
        <View className="gap-2">
          <Overline>Recent sales</Overline>
          <ListGroup footer="Fees are estimates from each marketplace's published rates. Check them against your payouts.">
            {rows.map(({ it, b }) => (
              <ListRow
                key={it.id}
                title={it.name}
                subtitle={`${marketName(it.sale!.on)} · ${it.sale!.date}${b.estimate ? ' · estimate' : ''}`}
                leading={it.photos.length ? <Thumb uri={it.photos[0]} size={44} radius={8} /> : <IconBadge icon={Package} size={44} tone="muted" />}
                trailing={money(b.net)}
                chevron
                onPress={() => router.push({ pathname: '/item/[id]', params: { id: it.id } })}
              />
            ))}
          </ListGroup>
        </View>
      ) : (
        <Card className="items-center gap-3 px-5 py-8">
          <IconBadge icon={ChartColumn} size={64} />
          <Text role="heading" className="text-center text-xl font-semibold">
            No sales yet
          </Text>
          <Text className="text-muted-foreground text-center text-base leading-6">When you mark an item sold, Profit shows what you made after each marketplace's fees, shipping and what you paid.</Text>
        </Card>
      )}
    </Screen>
  )
}
