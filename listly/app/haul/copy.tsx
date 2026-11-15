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
import { draftFor, type DraftField } from '@/src/ai'
import { saveItem } from '@/src/backend'
import { postToEbay, POSTING, wholeListing } from '@/src/marketplaces'
import { MARKETS, type Item, type MarketId } from '@/src/model'
import { useStore } from '@/src/store'
import { announce, success, tap, warn } from '@/src/ui/feedback'
import * as Clipboard from 'expo-clipboard'
import * as Linking from 'expo-linking'
import { router } from 'expo-router'
import { CircleAlert, CircleCheck, Copy, ExternalLink, Lock, Send } from 'lucide-react-native'
import { useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'

/** How this item gets onto the selected marketplace (DD-46): post through eBay's API, or copy it whole and open the marketplace. */
function PostPanel({ item, mkt, fields, onCopiedAll }: { item: Item; mkt: MarketId; fields: DraftField[]; onCopiedAll: () => void }) {
  const { s, updateItem } = useStore()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()
  const [askZip, setAskZip] = useState(false)
  const [zip, setZip] = useState('')
  const m = MARKETS.find((x) => x.id === mkt)!
  const title = fields.find((f) => f.key === 'title')?.value ?? ''
  const description = fields.find((f) => f.key === 'description')?.value ?? ''

  if (mkt === 'ebay') {
    const posted = item.external?.ebay
    if (posted)
      return (
        <View className="bg-success-soft gap-3 rounded-xl p-4" accessibilityRole="summary">
          <View className="flex-row items-center gap-2">
            <Icon as={CircleCheck} size={20} className="text-success" />
            <Text className="text-success flex-1 text-base font-semibold">Posted to eBay{posted.environment === 'sandbox' ? ' (test site)' : ''}</Text>
          </View>
          <Button variant="outline" size="sm" className="self-start" onPress={() => Linking.openURL(posted.url)}>
            <Icon as={ExternalLink} size={16} />
            <Text>View on eBay</Text>
          </Button>
        </View>
      )
    if (s.ebay?.status !== 'connected')
      return (
        <Card className="gap-3 px-4 py-4">
          <Text className="text-base font-semibold">Post to eBay in one tap</Text>
          <Text className="text-muted-foreground text-sm">Connect your eBay account once. You sign in on eBay's own page, and Listly never sees your password.</Text>
          <Button onPress={() => router.push('/connections')}>
            <Text>{s.ebay ? 'Connect eBay again' : 'Connect eBay'}</Text>
          </Button>
        </Card>
      )
    const post = async () => {
      if (!item.price) return setError('Set your price below first.')
      setBusy(true)
      setError(undefined)
      try {
        await saveItem(item) // the server posts what's on screen: latest price and photos
      } catch {
        setBusy(false)
        return setError('Couldn’t save this item. Check your connection and try again.')
      }
      const r = await postToEbay(item, title, description, askZip ? zip : undefined)
      setBusy(false)
      if (r.ok) {
        success()
        updateItem(item.id, (it) => ({ listedOn: Array.from(new Set([...it.listedOn, 'ebay' as MarketId])), external: { ...(it.external ?? {}), ebay: { listingId: r.listingId, url: r.url } } }))
        return announce(`Posted to eBay in ${r.category}.`)
      }
      warn()
      if (r.needs === 'postalCode') setAskZip(true)
      setError(r.error)
      announce(r.error)
    }
    return (
      <Card className="gap-3 px-4 py-4">
        <View className="flex-row items-center gap-2">
          <Icon as={Send} size={18} className="text-primary" />
          <Text className="flex-1 text-base font-semibold">Post this listing to eBay</Text>
          {s.ebay.environment === 'sandbox' ? (
            <Badge variant="secondary">
              <Text>Test site</Text>
            </Badge>
          ) : null}
        </View>
        <Text className="text-muted-foreground text-sm">Listly sends the title, description, photos, condition and your price. eBay picks the category from the title; you can change it on eBay.</Text>
        {askZip ? (
          <Field label="ZIP code you ship from" helper="eBay needs it for shipping. You'll only be asked once.">
            <Input value={zip} onChangeText={(v) => setZip(v.replace(/[^0-9-]/g, '').slice(0, 10))} accessibilityLabel="ZIP code you ship from" keyboardType="number-pad" autoComplete="postal-code" textContentType="postalCode" placeholder="e.g. 94110" />
          </Field>
        ) : null}
        {error ? (
          <View className="flex-row items-start gap-2" accessibilityRole="alert">
            <Icon as={CircleAlert} size={16} className="text-destructive mt-0.5" />
            <Text className="text-destructive flex-1 text-sm font-medium">{error}</Text>
          </View>
        ) : null}
        <Button size="lg" disabled={busy} onPress={post}>
          {busy ? <ActivityIndicator color="white" /> : <Text>Post to eBay</Text>}
        </Button>
      </Card>
    )
  }

  // Marketplaces without an API: the whole listing in one tap, then straight to their sell page.
  return (
    <Card className="gap-3 px-4 py-4">
      <Text className="text-base font-semibold">Post on {m.name}</Text>
      <Text className="text-muted-foreground text-sm">Copy the whole listing, open {m.short}, paste it, add your photos and post. The Listly Safari extension that fills this in for you is coming next.</Text>
      <View className="flex-row gap-2">
        <Button
          variant="secondary"
          className="flex-1"
          onPress={async () => {
            await Clipboard.setStringAsync(wholeListing(fields, item.price))
            tap()
            onCopiedAll()
            announce(`Listing copied for ${m.name}.`)
          }}
        >
          <Icon as={Copy} size={16} />
          <Text>Copy listing</Text>
        </Button>
        <Button className="flex-1" onPress={() => Linking.openURL(POSTING[mkt].sellUrl)}>
          <Icon as={ExternalLink} size={16} />
          <Text>Open {m.short}</Text>
        </Button>
      </View>
    </Card>
  )
}

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
          <PostPanel
            item={item}
            mkt={mkt}
            fields={fields}
            onCopiedAll={() => updateItem(item.id, (it) => ({ copied: { ...it.copied, ...Object.fromEntries(fields.filter((f) => f.value).map((f) => [`${mkt}|${f.key}`, true])) } }))}
          />
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
          {/* S-17: record where it's live, so the sold checklist knows where to take it down. */}
          {item.listedOn.includes(mkt) ? (
            <View className="bg-success-soft flex-row items-center gap-3 rounded-xl p-4" accessible accessibilityLabel={`Listed on ${MARKETS.find((m) => m.id === mkt)?.name}`}>
              <Icon as={CircleCheck} size={20} className="text-success" />
              <Text className="text-success flex-1 text-base font-semibold">Listed on {MARKETS.find((m) => m.id === mkt)?.name}</Text>
              <Button variant="ghost" size="sm" onPress={() => updateItem(item.id, (it) => ({ listedOn: it.listedOn.filter((m) => m !== mkt) }))}>
                <Text>Undo</Text>
              </Button>
            </View>
          ) : (
            <Button
              size="lg"
              variant="outline"
              onPress={() => {
                success()
                updateItem(item.id, (it) => ({ listedOn: [...it.listedOn, mkt] }))
                announce(`Marked listed on ${MARKETS.find((m) => m.id === mkt)?.name}.`)
              }}
            >
              <Icon as={CircleCheck} size={18} />
              <Text>I posted it on {MARKETS.find((m) => m.id === mkt)?.short}</Text>
            </Button>
          )}
        </Animated.View>
      )}
    </Screen>
  )
}
