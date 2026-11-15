import { IconBadge, ListGroup, ListRow, Thumb } from '@/components/listly/bits'
import { Screen } from '@/components/listly/screen'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Text } from '@/components/ui/text'
import { useStore } from '@/src/store'
import { router } from 'expo-router'
import { PackageCheck, Tags } from 'lucide-react-native'
import { useState } from 'react'
import { View } from 'react-native'

// R-30 · S-25. Sold, the checklist and item detail come in the next pass.
export default function Listings() {
  const { s, startHaul } = useStore()
  const [view, setView] = useState('ready')
  const rows = view === 'ready' ? s.listings : []
  return (
    <Screen tone="grouped">
      <Text role="heading" className="text-[34px] font-bold leading-[41px] tracking-tight">
        Listings
      </Text>
      <Tabs value={view} onValueChange={setView}>
        <TabsList className="w-full">
          <TabsTrigger value="ready" className="flex-1">
            <Text>Ready ({s.listings.length})</Text>
          </TabsTrigger>
          <TabsTrigger value="sold" className="flex-1">
            <Text>Sold (0)</Text>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {rows.length ? (
        <ListGroup>
          {rows.map((it) => (
            <ListRow key={it.id} title={it.name} subtitle={[it.facts.brand, it.facts.size, it.facts.cond].filter(Boolean).join(' · ')} leading={<Thumb uri={it.photos[0]} size={52} radius={8} />} trailing={it.price ? `$${it.price}` : 'No price'} />
          ))}
        </ListGroup>
      ) : (
        <Card className="items-center gap-3 px-5 py-8">
          <IconBadge icon={view === 'sold' ? PackageCheck : Tags} size={64} />
          <Text role="heading" className="text-center text-xl font-semibold">
            {view === 'sold' ? 'Nothing sold yet' : 'No listings yet'}
          </Text>
          <Text className="text-muted-foreground text-center text-base leading-6">
            {view === 'sold' ? 'When something sells, mark it sold here. Listly then reminds you to take it down everywhere else.' : 'Your drafted listings show here once you finish a haul.'}
          </Text>
          {view === 'ready' ? (
            <View className="w-full pt-2">
              <Button size="lg" onPress={() => { if (!s.haul) startHaul(); router.push('/haul') }}>
                <Text>Start a haul</Text>
              </Button>
            </View>
          ) : null}
        </Card>
      )}
    </Screen>
  )
}
