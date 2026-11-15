import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Text } from '@/components/ui/text'
import { useStore } from '@/src/store'
import { announce, success } from '@/src/ui/feedback'
import { router, useLocalSearchParams } from 'expo-router'
import { Check, X } from 'lucide-react-native'
import { useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function Benefit({ text }: { text: string }) {
  return (
    <View className="flex-row items-start gap-2.5">
      <Icon as={Check} size={18} className="text-primary mt-0.5" />
      <Text className="flex-1 text-base leading-6">{text}</Text>
    </View>
  )
}

// R-2, R-3, R-18 · S-19, S-20 · DD-08, DD-09 · C-25. Never hides drafted listings; Not now goes back to the haul.
export default function Paywall() {
  const { reason, count } = useLocalSearchParams<{ reason?: string; count?: string }>()
  const { s, buy } = useStore()
  const insets = useSafeAreaInsets()
  const [billing, setBilling] = useState('month')
  const [busy, setBusy] = useState<'reseller' | 'pass' | null>(null)
  const [restore, setRestore] = useState<'checking' | 'none' | null>(null)
  const k = Number(count ?? 0)
  const fromHaul = reason === 'finish' || reason === 'draft'

  // STAND-IN for StoreKit / Google Play Billing (R-3): no purchase is made in this build.
  const purchase = (plan: 'reseller' | 'pass') => {
    setBusy(plan)
    setTimeout(() => {
      buy(plan)
      success()
      announce(plan === 'reseller' ? 'Reseller plan started.' : 'Clear-out Pass active for 30 days.')
      router.back() // back to the haul (DD-09)
    }, 800)
  }

  return (
    <View className="bg-background flex-1">
      <View className="flex-row justify-end px-4 pt-3">
        <Pressable accessibilityRole="button" accessibilityLabel={s.haul ? 'Not now, back to my haul' : 'Close'} onPress={() => router.back()} hitSlop={8} className="bg-muted size-9 items-center justify-center rounded-full active:opacity-70">
          <Icon as={X} size={18} className="text-muted-foreground" />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24, gap: 24 }}>
        <View className="gap-2">
          <Text role="heading" className="text-[28px] font-bold leading-[34px] tracking-tight">
            {fromHaul ? 'Your 3 free listings are ready to post' : 'Keep listing'}
          </Text>
          <Text className="text-muted-foreground text-base leading-6">
            {fromHaul ? `Pick a plan to draft the other ${k} ${k === 1 ? 'item' : 'items'} in this haul. They're saved and ready.` : 'Pick the plan that fits how often you sell.'}
          </Text>
        </View>

        <View className="bg-card border-primary gap-4 rounded-2xl border-2 p-5 shadow-lg shadow-black/10">
          <View className="flex-row items-center justify-between">
            <Text role="heading" className="text-xl font-semibold">
              Reseller plan
            </Text>
            <Badge variant="accent">
              <Text>For regular sellers</Text>
            </Badge>
          </View>
          <Tabs value={billing} onValueChange={setBilling}>
            <TabsList className="w-full">
              <TabsTrigger value="month" className="flex-1">
                <Text>Monthly</Text>
              </TabsTrigger>
              <TabsTrigger value="year" className="flex-1">
                <Text>Yearly</Text>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <View>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-4xl font-bold tracking-tight">{billing === 'year' ? '$99' : '$12.99'}</Text>
              <Text className="text-muted-foreground text-base">{billing === 'year' ? 'a year' : 'a month'}</Text>
            </View>
            {billing === 'year' ? <Text className="text-accent-foreground text-sm font-medium">About $8.25 a month</Text> : null}
          </View>
          <View className="gap-2.5">
            <Benefit text="Up to 500 listings a month" />
            <Benefit text="Sold-everywhere checklist, so nothing sells twice" />
            <Benefit text="Profit after fees, with a CSV export" />
            <Benefit text="Every item, where it's listed and its bin" />
          </View>
          <Button size="lg" disabled={!!busy} onPress={() => purchase('reseller')}>
            {busy === 'reseller' ? <ActivityIndicator color="white" /> : <Text>Start Reseller plan</Text>}
          </Button>
          <Text className="text-muted-foreground text-xs">Renews every {billing === 'year' ? 'year' : 'month'} until you cancel in your App Store settings.</Text>
        </View>

        <Card className="gap-4 px-5 py-5">
          <View className="flex-row items-baseline justify-between">
            <Text role="heading" className="text-xl font-semibold">
              Clear-out Pass
            </Text>
            <Text className="text-xl font-semibold">$6.99</Text>
          </View>
          <Text className="text-muted-foreground -mt-2 text-sm">Once. It doesn't renew.</Text>
          <View className="gap-2.5">
            <Benefit text="30 days, up to 100 listings" />
            <Benefit text="Copy for every marketplace" />
            <Benefit text="Mark sold, and the sold-everywhere checklist" />
          </View>
          <Button size="lg" variant="outline" disabled={!!busy} onPress={() => purchase('pass')}>
            {busy === 'pass' ? <ActivityIndicator /> : <Text>Get Clear-out Pass</Text>}
          </Button>
        </Card>

        {restore === 'none' ? (
          <View className="bg-muted gap-1 rounded-xl p-4" accessible>
            <Text className="text-base font-semibold">No Listly purchases found for this Apple ID.</Text>
            <Text className="text-muted-foreground text-sm">If you bought with a different Apple ID, sign in to the App Store with it and try again.</Text>
          </View>
        ) : null}

        <View className="items-center gap-1">
          <Button variant="ghost" onPress={() => router.back()}>
            <Text>{s.haul ? 'Not now — back to my haul' : 'Not now'}</Text>
          </Button>
          <Button
            variant="ghost"
            disabled={restore === 'checking'}
            onPress={() => {
              setRestore('checking')
              announce('Checking the App Store for your purchases.')
              setTimeout(() => {
                setRestore('none')
                announce('No Listly purchases found for this Apple ID.')
              }, 900)
            }}
          >
            <Text>{restore === 'checking' ? 'Checking…' : 'Restore purchases'}</Text>
          </Button>
          <Text className="text-muted-foreground text-center text-xs">Paid through the App Store. Prototype: no purchase is made.</Text>
        </View>
      </ScrollView>
    </View>
  )
}
