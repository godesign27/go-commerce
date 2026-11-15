import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { Check, type LucideIcon } from 'lucide-react-native'
import { Children, Fragment, type ReactNode } from 'react'
import { Image, Pressable, View } from 'react-native'
import { MARKETS, type MarketId } from '@/src/model'

/** An icon in a soft accent circle, for list leading slots and empty states. */
export function IconBadge({ icon, size = 40, tone = 'accent' }: { icon: LucideIcon; size?: number; tone?: 'accent' | 'success' | 'muted' }) {
  return (
    <View
      className={cn('items-center justify-center rounded-full', tone === 'success' ? 'bg-success-soft' : tone === 'muted' ? 'bg-muted' : 'bg-accent')}
      style={{ width: size, height: size }}
    >
      <Icon as={icon} size={Math.round(size * 0.48)} className={tone === 'success' ? 'text-success' : tone === 'muted' ? 'text-muted-foreground' : 'text-accent-foreground'} />
    </View>
  )
}

/** Step n of total: segments plus the words (DD-01). */
export function Stepper({ step, total }: { step: number; total: number }) {
  return (
    <View accessible accessibilityRole="progressbar" accessibilityLabel={`Step ${step} of ${total}`} accessibilityValue={{ min: 1, max: total, now: step }} className="gap-2">
      <View className="flex-row gap-1">
        {Array.from({ length: total }, (_, i) => (
          <View key={i} className={cn('h-1 flex-1 rounded-full', i < step ? 'bg-primary' : 'bg-muted')} />
        ))}
      </View>
      <Text className="text-muted-foreground text-xs font-semibold">
        Step {step} of {total}
      </Text>
    </View>
  )
}

/** A selectable pill. single = radio, multi = toggle. Selected is blue fill + white text, never colour alone (a check shows too). */
export function Chip({ label, selected, onPress, mode = 'multi', locked }: { label: string; selected: boolean; onPress: () => void; mode?: 'single' | 'multi'; locked?: boolean }) {
  return (
    <Pressable
      accessibilityRole={mode === 'single' ? 'radio' : 'button'}
      accessibilityState={mode === 'single' ? { checked: selected } : { selected }}
      accessibilityLabel={locked ? `${label}, locked` : label}
      onPress={onPress}
      hitSlop={4}
      className={cn(
        'h-10 flex-row items-center gap-1.5 rounded-full border px-4 active:opacity-80',
        selected ? 'bg-primary border-primary' : 'bg-background border-border',
        locked && 'border-dashed',
      )}
    >
      {selected ? <Icon as={Check} size={15} className="text-primary-foreground" /> : null}
      <Text className={cn('text-sm font-semibold', selected ? 'text-primary-foreground' : 'text-foreground')}>{label}</Text>
    </Pressable>
  )
}

/** shadcn-style inset group: a card of rows with hairlines between them. */
export function ListGroup({ children, footer }: { children: ReactNode; footer?: string }) {
  const rows = Children.toArray(children).filter(Boolean)
  return (
    <View className="gap-2">
      <View className="bg-card border-border overflow-hidden rounded-xl border">
        {rows.map((r, i) => (
          <Fragment key={i}>
            {i ? <View className="bg-border ml-4 h-px" /> : null}
            {r}
          </Fragment>
        ))}
      </View>
      {footer ? <Text className="text-muted-foreground px-1 text-xs">{footer}</Text> : null}
    </View>
  )
}

export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
  chevron,
  checked,
  destructive,
}: {
  title: string
  subtitle?: string
  leading?: ReactNode
  trailing?: ReactNode
  onPress?: () => void
  chevron?: boolean
  checked?: boolean
  destructive?: boolean
}) {
  const isCheck = checked !== undefined
  const label = [title, subtitle, typeof trailing === 'string' ? trailing : ''].filter(Boolean).join(', ')
  const body = (
    <View className={cn('flex-row items-center gap-3 px-4', subtitle ? 'min-h-16 py-3' : 'min-h-[52px] py-2.5')}>
      {leading}
      <View className="flex-1 gap-0.5">
        <Text className={cn('text-base', destructive && 'text-destructive')}>{title}</Text>
        {subtitle ? <Text className="text-muted-foreground text-sm">{subtitle}</Text> : null}
      </View>
      {typeof trailing === 'string' ? <Text className="text-muted-foreground text-base">{trailing}</Text> : trailing}
      {isCheck ? (
        <View className={cn('size-6 items-center justify-center rounded-full', checked ? 'bg-primary' : 'border-border border-[1.5px]')}>
          {checked ? <Icon as={Check} size={15} className="text-primary-foreground" /> : null}
        </View>
      ) : null}
      {chevron ? <Text className="text-muted-foreground text-xl">›</Text> : null}
    </View>
  )
  if (!onPress) return (
    <View accessible accessibilityLabel={label}>
      {body}
    </View>
  )
  return (
    <Pressable
      accessibilityRole={isCheck ? 'checkbox' : 'button'}
      accessibilityState={isCheck ? { checked } : undefined}
      accessibilityLabel={label}
      onPress={onPress}
      className="active:bg-muted"
    >
      {body}
    </Pressable>
  )
}

/** Photo thumbnail. Nested radius (10) inside 12 pt cards. Decorative: its row or card carries the label. */
export function Thumb({ uri, size = 64, radius = 10 }: { uri?: string; size?: number; radius?: number }) {
  return (
    <View className="bg-muted overflow-hidden" style={{ width: size, height: size, borderRadius: radius }} accessible={false}>
      {uri ? <Image source={{ uri }} style={{ width: size, height: size }} /> : null}
    </View>
  )
}

export function ThumbStrip({ uris, size = 64 }: { uris: string[]; size?: number }) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {uris.map((u, i) => (
        <Thumb key={`${u}-${i}`} uri={u} size={size} />
      ))}
    </View>
  )
}

/** A neutral marketplace monogram. Listly never imitates the marketplaces' own marks. */
export function MarketMark({ id, size = 36 }: { id: MarketId; size?: number }) {
  const m = MARKETS.find((x) => x.id === id)!
  return (
    <View className="bg-muted items-center justify-center rounded-full" style={{ width: size, height: size }} accessible={false}>
      <Text className="text-xs font-bold">{m.id === 'ebay' ? 'eB' : m.short.slice(0, 1)}</Text>
    </View>
  )
}

/** A field with a visible label above (never placeholder-only), helper or error below. */
export function Field({ label, error, helper, children }: { label: string; error?: string; helper?: string; children: ReactNode }) {
  return (
    <View className="gap-1.5">
      <Text className="text-sm font-medium" accessible={false}>
        {label}
      </Text>
      {children}
      {error ? (
        <Text className="text-destructive text-sm font-medium" accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : helper ? (
        <Text className="text-muted-foreground text-sm">{helper}</Text>
      ) : null}
    </View>
  )
}
