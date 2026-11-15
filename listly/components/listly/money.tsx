import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { breakdown, money } from '@/src/fees'
import { marketName, type Item } from '@/src/model'
import { View } from 'react-native'

function Row({ label, value, strong, muted }: { label: string; value: string; strong?: boolean; muted?: boolean }) {
  return (
    <View className="flex-row items-baseline justify-between py-1.5" accessible accessibilityLabel={`${label}, ${value}`}>
      <Text className={cn('text-base', strong && 'font-semibold', muted && 'text-muted-foreground')}>{label}</Text>
      <Text className={cn('text-base tabular-nums', strong && 'text-lg font-bold', muted && 'text-muted-foreground')}>{value}</Text>
    </View>
  )
}

/** Sale − fee − shipping − cost = net. Missing shipping or cost is shown as "Not entered", never as $0 (D-9, DD-18). */
export function MoneyBreakdown({ item }: { item: Item }) {
  const b = breakdown(item)
  if (!b || !item.sale) return null
  return (
    <View>
      <Row label={`Sold on ${marketName(item.sale.on)}`} value={money(b.sale)} />
      <Row label="Marketplace fee (estimate)" value={`-${money(b.fee)}`} muted />
      <Row label="Shipping you paid" value={b.ship === null ? 'Not entered' : b.ship === 0 ? 'Buyer paid' : `-${money(b.ship)}`} muted />
      <Row label="What you paid" value={b.cost === null ? 'Not entered' : `-${money(b.cost)}`} muted />
      <View className="bg-foreground my-1.5 h-0.5" />
      <Row label={b.estimate ? 'Net profit (estimate)' : 'Net profit'} value={money(b.net)} strong />
      {b.estimate ? (
        <Text className="text-muted-foreground pt-1 text-sm">
          {b.ship === null && b.cost === null
            ? "Shipping and what you paid aren't entered yet, so this counts them as $0."
            : b.ship === null
              ? "Shipping isn't entered yet, so this counts it as $0."
              : "What you paid isn't entered yet, so this counts it as $0."}
        </Text>
      ) : null}
    </View>
  )
}
