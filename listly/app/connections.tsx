import { MarketMark } from '@/components/listly/bits'
import { Overline, Screen, Title } from '@/components/listly/screen'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { connectEbay, disconnectEbay, fetchEbayConnection, POSTING } from '@/src/marketplaces'
import { MARKETS } from '@/src/model'
import { useStore } from '@/src/store'
import { announce, success, warn } from '@/src/ui/feedback'
import { router } from 'expo-router'
import { Check, CircleAlert, Compass, X } from 'lucide-react-native'
import { useState } from 'react'
import { ActivityIndicator, Alert, View } from 'react-native'

function Can({ yes, text }: { yes: boolean; text: string }) {
  return (
    <View className="flex-row items-start gap-2.5">
      <Icon as={yes ? Check : X} size={16} className={cn('mt-0.5', yes ? 'text-success' : 'text-muted-foreground')} />
      <Text className="flex-1 text-sm leading-5">{text}</Text>
    </View>
  )
}

// R-34, R-35 · S-34, S-54 · DD-46. What each connection can and can't do, said before connecting.
export default function Connections() {
  const { s, set } = useStore()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string>()
  const ebay = s.ebay

  const connect = async () => {
    if (!s.userId) return setError('Sign in to Listly with your email first. eBay connects to your Listly account.')
    setBusy(true)
    setError(undefined)
    const r = await connectEbay()
    set({ ebay: await fetchEbayConnection() })
    setBusy(false)
    if (r.ok) {
      success()
      announce('eBay connected.')
    } else if (r.needs !== 'cancelled') {
      warn()
      setError(r.error)
    } else announce(r.error)
  }
  const disconnect = () =>
    Alert.alert('Disconnect eBay?', 'Listly stops posting to eBay. Listings already on eBay stay there. You can also remove Listly under eBay > Account > Third-party app access.', [
      { text: 'Keep connected', style: 'cancel' },
      {
        text: 'Disconnect',
        style: 'destructive',
        onPress: async () => {
          await disconnectEbay()
          set({ ebay: null })
          announce('eBay disconnected.')
        },
      },
    ])

  return (
    <Screen tone="grouped" back={{ label: 'Back', onPress: () => router.back() }}>
      <Title sub="Listly never asks for your marketplace passwords. You stay signed in to each marketplace yourself.">Marketplaces</Title>

      {/* eBay: official API */}
      <View className="gap-2">
        <Overline>Posts for you</Overline>
        <Card className="gap-4 px-4 py-5">
          <View className="flex-row items-center gap-3">
            <MarketMark id="ebay" size={40} />
            <View className="flex-1">
              <Text className="text-lg font-semibold">eBay</Text>
              <Text className="text-muted-foreground text-sm">{POSTING.ebay.note}</Text>
            </View>
            {ebay ? (
              <Badge variant={ebay.status === 'connected' ? 'success' : 'outline'} className={ebay.status === 'connected' ? undefined : 'border-destructive'}>
                <Text className={ebay.status === 'connected' ? undefined : 'text-destructive'}>{ebay.status === 'connected' ? 'Connected' : 'Reconnect'}</Text>
              </Badge>
            ) : null}
          </View>
          {!ebay || ebay.status !== 'connected' ? (
            <View className="bg-muted gap-2 rounded-lg p-3">
              <Text className="text-sm font-semibold">When you connect, Listly can</Text>
              <Can yes text="Post a listing to eBay when you tap Post to eBay" />
              <Can yes text="See your eBay orders, so sales show up in Listly" />
              <Text className="pt-1 text-sm font-semibold">Listly can't</Text>
              <Can yes={false} text="See your eBay password. You sign in on eBay's own page" />
              <Can yes={false} text="Post anything you haven't asked it to" />
              <Can yes={false} text="See your payment details" />
            </View>
          ) : (
            <Text className="text-muted-foreground text-sm">
              {ebay.environment === 'sandbox' ? 'Connected to eBay’s test site (sandbox). Listings go to sandbox.ebay.com, not the real eBay.' : 'Listings you post go live on eBay.'}
            </Text>
          )}
          {error ? (
            <View className="flex-row items-start gap-2" accessibilityRole="alert">
              <Icon as={CircleAlert} size={16} className="text-destructive mt-0.5" />
              <Text className="text-destructive flex-1 text-sm font-medium">{error}</Text>
            </View>
          ) : null}
          {ebay?.status === 'connected' ? (
            <Button variant="ghost" onPress={disconnect}>
              <Text className="text-destructive">Disconnect eBay</Text>
            </Button>
          ) : (
            <Button size="lg" disabled={busy} onPress={connect}>
              {busy ? <ActivityIndicator color="white" /> : <Text>{ebay ? 'Connect eBay again' : 'Connect with eBay'}</Text>}
            </Button>
          )}
        </Card>
      </View>

      {/* Depop: official partner API, pending approval */}
      <Card className="flex-row items-center gap-3 px-4 py-4">
        <MarketMark id="depop" size={40} />
        <View className="flex-1">
          <Text className="text-lg font-semibold">Depop</Text>
          <Text className="text-muted-foreground text-sm">{POSTING.depop.note}</Text>
        </View>
        <Badge variant="secondary">
          <Text>Coming soon</Text>
        </Badge>
      </Card>

      {/* Poshmark, Mercari, Facebook: Safari extension (next stage) */}
      <View className="gap-2">
        <Overline>Fills the form, you tap Post</Overline>
        <View className="bg-card border-border overflow-hidden rounded-xl border">
          {MARKETS.filter((m) => POSTING[m.id].mode === 'extension').map((m, i) => (
            <View key={m.id} className={cn('flex-row items-center gap-3 px-4 py-3.5', i && 'border-border border-t')}>
              <MarketMark id={m.id} size={40} />
              <View className="flex-1">
                <Text className="text-base font-semibold">{m.name}</Text>
                <Text className="text-muted-foreground text-sm">{POSTING[m.id].note}</Text>
              </View>
            </View>
          ))}
        </View>
        <View className="flex-row items-start gap-2 px-1">
          <Icon as={Compass} size={16} className="text-muted-foreground mt-0.5" />
          <Text className="text-muted-foreground flex-1 text-sm">
            The Listly Safari extension is coming next. Until then, Copy listing and Open the marketplace, on each listing, get you there in two taps.
          </Text>
        </View>
      </View>
    </Screen>
  )
}
