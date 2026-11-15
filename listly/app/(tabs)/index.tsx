import { IconBadge, ListGroup, ListRow, Thumb } from '@/components/listly/bits'
import { Overline, Screen } from '@/components/listly/screen'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { liveElsewhere, marketName, type MarketId } from '@/src/model'
import { useStore } from '@/src/store'
import { announce, tap } from '@/src/ui/feedback'
import { router } from 'expo-router'
import { Camera, Link2, Package, PartyPopper, RefreshCw, SlidersHorizontal, TriangleAlert, X } from 'lucide-react-native'
import { Pressable, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

// R-29 · S-23, S-24 · DD-08, DD-42, DD-43
export default function Home() {
  const { s, set, startHaul, loadSamples } = useStore()
  const newHaul = () => {
    tap()
    if (!s.haul) startHaul()
    router.push('/haul')
  }
  const unfinished = s.haul && s.haul.photos.length > 0
  const brandNew = !s.listings.length && !unfinished
  const showSetup = s.listings.length > 0 && !s.setupDismissed && !(s.defaultsSet && s.linkedShops > 0)
  const marketsLine = s.markets.length ? s.markets.map((m: MarketId) => marketName(m)).join(' · ') : 'All five marketplaces'
  const atRisk = s.listings.filter((it) => liveElsewhere(it).length > 0)

  return (
    <Screen tone="grouped">
      <View className="flex-row items-center justify-between">
        <Text role="heading" className="text-[34px] font-bold leading-[41px] tracking-tight">
          Home
        </Text>
        <Badge variant="accent">
          <Text>{s.plan === 'reseller' ? 'Reseller plan' : s.plan === 'pass' ? 'Clear-out Pass' : 'Free trial'}</Text>
        </Badge>
      </View>

      {/* R-29: Needs action comes first whenever a sold item is still live elsewhere. */}
      {atRisk.length ? (
        <Animated.View entering={FadeInDown.duration(280)}>
          <View className="bg-card border-destructive gap-3 rounded-2xl border-2 p-4" accessibilityRole="alert">
            <View className="flex-row items-center gap-2">
              <Icon as={TriangleAlert} size={20} className="text-destructive" />
              <Text role="heading" className="text-destructive text-lg font-bold">
                Needs action
              </Text>
            </View>
            {atRisk.slice(0, 3).map((it) => (
              <Text key={it.id} className="text-base leading-6">
                {it.name} sold on {marketName(it.sale!.on)}. It's still live on {liveElsewhere(it).map(marketName).join(' and ')}.
              </Text>
            ))}
            <Button onPress={() => router.push({ pathname: '/checklist/[id]', params: { id: atRisk[0].id } })}>
              <Text>Remove it now</Text>
            </Button>
          </View>
        </Animated.View>
      ) : null}

      {s.welcomePlan ? (
        <Animated.View entering={FadeInDown.duration(320)}>
          <View className="bg-primary gap-2 rounded-2xl p-5">
            <View className="flex-row items-start justify-between gap-3">
              <View className="flex-1 flex-row items-center gap-2">
                <Icon as={PartyPopper} size={20} className="text-primary-foreground" />
                <Text role="heading" className="text-primary-foreground flex-1 text-lg font-semibold">
                  {s.welcomePlan === 'pass' ? 'Your Clear-out Pass is on' : 'Welcome to the Reseller plan'}
                </Text>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Dismiss welcome" onPress={() => set({ welcomePlan: null })} hitSlop={10} className="size-11 items-center justify-center -m-2.5">
                <Icon as={X} size={18} className="text-primary-foreground" />
              </Pressable>
            </View>
            <Text className="text-primary-foreground/90 text-base leading-6">
              {s.welcomePlan === 'pass'
                ? 'It runs for 30 days, for up to 100 listings. When something sells, Listly reminds you to take it down everywhere else.'
                : 'Profit after fees, every item and its bin, and up to 500 listings a month. Add what you paid for each item so profit is right.'}
            </Text>
          </View>
        </Animated.View>
      ) : null}

      {brandNew ? (
        <Animated.View entering={FadeInDown.duration(360)}>
          <Card className="gap-5 px-5 py-6">
            <View className="items-center gap-3">
              <IconBadge icon={Camera} size={64} />
              <Text role="heading" className="text-center text-2xl font-bold tracking-tight">
                Start your first haul
              </Text>
              <Text className="text-muted-foreground text-center text-base leading-6">Photograph a few items, answer a few questions, and get a listing for every marketplace you sell on.</Text>
            </View>
            <Button size="lg" onPress={newHaul}>
              <Icon as={Camera} size={18} />
              <Text>Start a haul</Text>
            </Button>
            <Button variant="ghost" onPress={() => announce('The how-to video opens here.')}>
              <Text>Watch how Listly works (2 min)</Text>
            </Button>
            <Button variant="ghost" onPress={loadSamples}>
              <Text>Try it with sample listings</Text>
            </Button>
          </Card>
        </Animated.View>
      ) : null}

      {unfinished ? (
        <Card className="gap-4 px-4 py-4">
          <View className="flex-row items-center gap-3">
            <Thumb uri={s.haul!.photos[0]} size={56} />
            <View className="flex-1 gap-0.5">
              <Text className="text-base font-semibold">Unfinished haul</Text>
              <Text className="text-muted-foreground text-sm">
                {s.haul!.photos.length} photos{s.haul!.items.length ? ` of ${s.haul!.items.length} items` : ''}, not drafted yet
              </Text>
            </View>
          </View>
          <Button variant="secondary" onPress={() => router.push(s.haul!.items.length ? '/haul/group' : '/haul')}>
            <Text>Continue</Text>
          </Button>
        </Card>
      ) : null}

      {!s.plan && !brandNew ? (
        <Card className="gap-3 px-4 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold">{s.freeLeft} of 3 free listings left</Text>
            <Button variant="link" size="sm" className="px-0" onPress={() => router.push('/paywall')}>
              <Text>See plans</Text>
            </Button>
          </View>
          <View className="flex-row gap-1.5" accessible={false}>
            {[0, 1, 2].map((i) => (
              <View key={i} className={cn('h-1.5 flex-1 rounded-full', i < 3 - s.freeLeft ? 'bg-primary' : 'bg-muted')} />
            ))}
          </View>
        </Card>
      ) : null}

      {showSetup ? (
        <View className="gap-2">
          <Overline
            right={
              <Button variant="link" size="sm" className="h-8 px-0" onPress={() => { set({ setupDismissed: true }); announce('Find these any time in Profile.') }}>
                <Text className="text-sm">Hide</Text>
              </Button>
            }
          >
            Finish setting up
          </Overline>
          <ListGroup footer="Optional. Each takes under a minute.">
            <ListRow title="Link your shops" subtitle="So Listly can open your listings" leading={<IconBadge icon={Link2} size={36} />} chevron onPress={() => announce('Marketplaces and connections open here.')} />
            <ListRow
              title="Set selling defaults"
              subtitle="Who pays shipping, and your default bin"
              leading={<IconBadge icon={SlidersHorizontal} size={36} tone={s.defaultsSet ? 'success' : 'accent'} />}
              trailing={s.defaultsSet ? <Badge variant="success"><Text>Done</Text></Badge> : undefined}
              chevron={!s.defaultsSet}
              onPress={s.defaultsSet ? undefined : () => router.push('/setup-defaults')}
            />
            <ListRow title="eBay sales, tracked for you" subtitle="Coming soon" leading={<IconBadge icon={RefreshCw} size={36} tone="muted" />} />
          </ListGroup>
        </View>
      ) : null}

      {s.listings.length ? (
        <View className="gap-2">
          <Overline
            right={
              <Button variant="link" size="sm" className="h-8 px-0" onPress={() => router.navigate('/(tabs)/listings')}>
                <Text className="text-sm">See all</Text>
              </Button>
            }
          >
            Your items
          </Overline>
          <ListGroup>
            {s.listings.slice(0, 6).map((it) => (
              <ListRow
                key={it.id}
                title={it.name}
                subtitle={it.status === 'sold' ? `Sold on ${marketName(it.sale!.on)}` : it.listedOn.length ? it.listedOn.map(marketName).join(' · ') : `Ready for ${marketsLine}`}
                leading={it.photos.length ? <Thumb uri={it.photos[0]} size={44} radius={8} /> : <IconBadge icon={Package} size={44} tone="muted" />}
                trailing={it.price ? `$${it.price}` : undefined}
                chevron
                onPress={() => router.push({ pathname: '/item/[id]', params: { id: it.id } })}
              />
            ))}
          </ListGroup>
        </View>
      ) : null}
    </Screen>
  )
}
