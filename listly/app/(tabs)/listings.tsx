import { IconBadge, ListGroup, ListRow, Thumb } from '@/components/listly/bits'
import { Screen } from '@/components/listly/screen'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Text } from '@/components/ui/text'
import { money } from '@/src/fees'
import { liveElsewhere, marketName, type Item } from '@/src/model'
import { useStore } from '@/src/store'
import { router } from 'expo-router'
import { Package, PackageCheck, Tags, TriangleAlert } from 'lucide-react-native'
import { useState } from 'react'
import { View } from 'react-native'

// R-30, R-13 · S-25, S-26 · D-2. "Still live" is sold here but live elsewhere: the double-sale risk.
export default function Listings() {
  const { s, startHaul, loadSamples } = useStore()
  const active = s.listings.filter((i) => i.status !== 'sold')
  const risky = s.listings.filter((i) => liveElsewhere(i).length > 0)
  const sold = s.listings.filter((i) => i.status === 'sold')
  const [view, setView] = useState(risky.length ? 'live' : 'active')
  const rows = view === 'active' ? active : view === 'live' ? risky : sold

  const row = (it: Item) => {
    const live = liveElsewhere(it)
    return (
      <ListRow
        key={it.id}
        title={it.name}
        subtitle={it.status === 'sold' ? `Sold on ${marketName(it.sale!.on)} · ${it.sale!.date}` : !it.drafted ? 'Saved, ready to draft when you pick a plan' : it.listedOn.length ? it.listedOn.map(marketName).join(' · ') : 'Not listed yet'}
        leading={it.photos.length ? <Thumb uri={it.photos[0]} size={52} radius={8} /> : <IconBadge icon={Package} size={52} tone="muted" />}
        trailing={
          live.length ? (
            <Badge variant="outline" className="border-destructive">
              <Text className="text-destructive">Live on {live.length}</Text>
            </Badge>
          ) : it.status === 'sold' ? (
            money(it.sale!.price)
          ) : it.price ? (
            money(Number(it.price))
          ) : (
            'No price'
          )
        }
        chevron
        onPress={() => router.push({ pathname: '/item/[id]', params: { id: it.id } })}
      />
    )
  }

  return (
    <Screen tone="grouped">
      <Text role="heading" className="text-[34px] font-bold leading-[41px] tracking-tight">
        Listings
      </Text>
      <Tabs value={view} onValueChange={setView}>
        <TabsList className="w-full">
          <TabsTrigger value="active" className="flex-1">
            <Text>Active ({active.length})</Text>
          </TabsTrigger>
          <TabsTrigger value="live" className="flex-1">
            <Text>Still live ({risky.length})</Text>
          </TabsTrigger>
          <TabsTrigger value="sold" className="flex-1">
            <Text>Sold ({sold.length})</Text>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {view === 'live' && risky.length ? (
        <View className="flex-row items-start gap-2 px-1">
          <Icon as={TriangleAlert} size={16} className="text-destructive mt-0.5" />
          <Text className="text-muted-foreground flex-1 text-sm">Sold, but still live on another marketplace. Take each one down so it can't sell twice.</Text>
        </View>
      ) : null}
      {rows.length ? (
        <ListGroup>{rows.map(row)}</ListGroup>
      ) : (
        <Card className="items-center gap-3 px-5 py-8">
          <IconBadge icon={view === 'active' ? Tags : PackageCheck} size={64} />
          <Text role="heading" className="text-center text-xl font-semibold">
            {view === 'sold' ? 'Nothing sold yet' : view === 'live' ? 'Nothing at risk' : 'No listings yet'}
          </Text>
          <Text className="text-muted-foreground text-center text-base leading-6">
            {view === 'sold'
              ? 'When something sells, open it and tap Mark sold. Listly then helps you take it down everywhere else.'
              : view === 'live'
                ? 'Every sold item is down from your other marketplaces.'
                : 'Your listings show here once you finish a haul.'}
          </Text>
          {view === 'active' ? (
            <View className="w-full gap-2 pt-2">
              <Button size="lg" onPress={() => { if (!s.haul) startHaul(); router.push('/haul') }}>
                <Text>Start a haul</Text>
              </Button>
              <Button variant="ghost" onPress={loadSamples}>
                <Text>Try it with sample listings</Text>
              </Button>
            </View>
          ) : null}
        </Card>
      )}
    </Screen>
  )
}
