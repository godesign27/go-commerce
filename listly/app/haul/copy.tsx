import { Field, Thumb } from '@/components/listly/bits'
import { Screen, Title } from '@/components/listly/screen'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { draftFor } from '@/src/ai'
import { MARKETS, type MarketId } from '@/src/model'
import { useStore } from '@/src/store'
import { announce, success, tap } from '@/src/ui/feedback'
import * as Clipboard from 'expo-clipboard'
import { router } from 'expo-router'
import { CircleCheck, Copy, Lock } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

// Flow 1 · R-8, R-12, R-1, R-2 · S-15, S-18 · DD-07, DD-09, DD-12 · C-16 to C-21
export default function CopyListings() {
  const { s, updateItem, finishHaul } = useStore()
  const items = s.haul?.items ?? []
  const shown = MARKETS.filter((m) => !s.markets.length || s.markets.includes(m.id))
  const [sel, setSel] = useState(Math.max(0, items.findIndex((i) => i.drafted)))
  const [mkt, setMkt] = useState<MarketId>(shown[0].id)
  const item = items[sel]
  const undrafted = items.filter((i) => !i.drafted).length

  const copy = async (field: string, label: string, value: string) => {
    await Clipboard.setStringAsync(value)
    tap()
    updateItem(item.id, (it) => ({ copied: { ...it.copied, [`${mkt}|${field}`]: true } }))
    announce(`${label} copied.`)
  }
  const finish = () => {
    if (!s.plan && undrafted) return router.push({ pathname: '/paywall', params: { reason: 'finish', count: String(undrafted) } })
    success()
    finishHaul()
    announce(`Haul finished. ${items.filter((i) => i.drafted).length} items ready to post.`)
    router.replace('/(tabs)')
  }
  if (!item) return null
  const fields = item.drafted ? draftFor(item, mkt) : []
  const withValue = fields.filter((f) => f.value)
  const copiedHere = withValue.filter((f) => item.copied[`${mkt}|${f.key}`]).length

  return (
    <Screen
      tone="grouped"
      right={
        <Badge variant="accent" accessibilityLabel={!s.plan ? `${s.freeLeft} of your 3 free listings left` : undefined}>
          <Text>{!s.plan ? `${s.freeLeft} of 3 free left` : s.plan === 'pass' ? 'Clear-out Pass' : 'Reseller plan'}</Text>
        </Badge>
      }
      footer={
        <>
          <Button size="lg" onPress={finish}>
            <Text>Finish haul</Text>
          </Button>
          {!s.plan && undrafted ? (
            <Text className="text-muted-foreground text-center text-sm">
              {undrafted} {undrafted === 1 ? 'item' : 'items'} still to draft. Finishing asks you to pick a plan.
            </Text>
          ) : null}
        </>
      }
    >
      <Title sub="Copy each field, then paste it into the marketplace app.">Ready to post</Title>

      {s.plan && undrafted ? (
        <Alert icon={CircleCheck} className="bg-success-soft border-transparent" iconClassName="text-success">
          <AlertTitle className="text-success">{s.plan === 'pass' ? 'Clear-out Pass active for 30 days' : 'Reseller plan started'}</AlertTitle>
          <AlertDescription className="text-foreground">
            Draft your other {undrafted} {undrafted === 1 ? 'item' : 'items'} now. Their photos and answers are saved.
          </AlertDescription>
          <Button size="sm" className="mt-3 self-start" onPress={() => router.push('/haul/drafting')}>
            <Text>
              Draft {undrafted} more {undrafted === 1 ? 'item' : 'items'}
            </Text>
          </Button>
        </Alert>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }} style={{ marginHorizontal: -16 }}>
        {items.map((it, i) => {
          const on = i === sel
          return (
            <Pressable
              key={it.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${i + 1}, ${it.name}${it.drafted ? '' : ', locked'}`}
              onPress={() => {
                tap()
                setSel(i)
              }}
              className={cn('bg-card w-[116px] gap-2 rounded-xl border-2 p-2', on ? 'border-primary' : it.drafted ? 'border-transparent' : 'border-border border-dashed')}
            >
              <View>
                <Thumb uri={it.photos[0]} size={96} radius={8} />
                {!it.drafted ? (
                  <View className="bg-card absolute right-1.5 top-1.5 size-6 items-center justify-center rounded-full">
                    <Icon as={Lock} size={12} className="text-muted-foreground" />
                  </View>
                ) : null}
              </View>
              <Text className="text-sm font-semibold" numberOfLines={2}>
                {it.name}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {!item.drafted ? (
        <Animated.View entering={FadeIn.duration(200)}>
          <Card className="gap-4 px-4 py-5">
            <View className="flex-row items-center gap-3">
              <View className="bg-muted size-11 items-center justify-center rounded-full">
                <Icon as={Lock} size={20} className="text-muted-foreground" />
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="text-base font-semibold">{item.name} is saved, ready to draft</Text>
                <Text className="text-muted-foreground text-sm">Your 3 free listings are used. Its photos and answers are kept.</Text>
              </View>
            </View>
            <Button onPress={() => router.push({ pathname: '/paywall', params: { reason: 'draft', count: String(undrafted) } })}>
              <Text>Draft this item</Text>
            </Button>
          </Card>
        </Animated.View>
      ) : (
        <Animated.View key={`${item.id}-${mkt}`} entering={FadeIn.duration(200)} className="gap-4">
          <Tabs value={mkt} onValueChange={(v) => { tap(); setMkt(v as MarketId) }}>
            <TabsList className="w-full">
              {shown.map((m) => (
                <TabsTrigger key={m.id} value={m.id} className="flex-1">
                  <Text numberOfLines={1}>{m.short}</Text>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <View className="flex-row items-center justify-between px-1">
            <Text role="heading" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              {MARKETS.find((m) => m.id === mkt)?.name} listing
            </Text>
            <Badge variant={copiedHere === withValue.length ? 'success' : 'secondary'}>
              <Text>
                {copiedHere} of {withValue.length} copied
              </Text>
            </Badge>
          </View>
          <View className="bg-card border-border overflow-hidden rounded-xl border">
            {fields.map((f, i) => {
              const done = item.copied[`${mkt}|${f.key}`]
              return (
                <View key={f.key} className={cn('gap-2 px-4 py-3.5', i && 'border-border border-t')}>
                  <View className="flex-row items-center justify-between gap-3">
                    <Text className="text-muted-foreground text-sm font-medium">{f.label}</Text>
                    {f.value ? (
                      <Button size="sm" variant={done ? 'ghost' : 'secondary'} accessibilityLabel={done ? `${f.label} copied. Copy again` : `Copy ${f.label.toLowerCase()}`} onPress={() => copy(f.key, f.label, f.value!)}>
                        <Icon as={done ? CircleCheck : Copy} size={16} className={done ? 'text-success' : undefined} />
                        <Text className={done ? 'text-success' : undefined}>{done ? 'Copied' : 'Copy'}</Text>
                      </Button>
                    ) : null}
                  </View>
                  {f.value ? (
                    <Text selectable className="text-base leading-6">
                      {f.value}
                    </Text>
                  ) : (
                    <Text className="text-muted-foreground text-base">Not given — left out of this listing</Text>
                  )}
                  {f.limit && f.value ? (
                    <Text className={cn('text-xs', f.value.length > f.limit ? 'text-destructive font-semibold' : 'text-muted-foreground')}>
                      {f.value.length} of {f.limit} characters{f.value.length > f.limit ? ' — over the limit' : ''}
                    </Text>
                  ) : null}
                </View>
              )
            })}
          </View>
          <Card className="gap-3 px-4 py-4">
            <Field label="Your price" helper="You set the price. Listly doesn't guess it.">
              <Input value={item.price} onChangeText={(v) => updateItem(item.id, { price: v.replace(/[^0-9.]/g, '') })} accessibilityLabel="Your price" placeholder="$0.00" keyboardType="decimal-pad" />
            </Field>
            <Button size="sm" variant="secondary" className="self-start" disabled={!item.price} onPress={() => copy('price', 'Price', item.price)}>
              <Icon as={Copy} size={16} />
              <Text>Copy price</Text>
            </Button>
          </Card>
        </Animated.View>
      )}
    </Screen>
  )
}
