import { ThumbStrip } from '@/components/listly/bits'
import { Screen, Title } from '@/components/listly/screen'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { nameFor } from '@/src/ai'
import { emptyFacts } from '@/src/model'
import { useStore } from '@/src/store'
import { announce, select } from '@/src/ui/feedback'
import { router } from 'expo-router'
import { Merge, Scissors, Sparkles } from 'lucide-react-native'
import { View } from 'react-native'
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated'

// Flow 1 · R-5 · S-07, S-08 · M-05. Split and merge are buttons, never drags (WCAG 2.5.7).
export default function Group() {
  const { s, setItems, set } = useStore()
  const items = s.haul?.items ?? []
  const total = items.reduce((n, i) => n + i.photos.length, 0)
  const split = (idx: number) => {
    const it = items[idx]
    const fresh = { ...it, id: `${it.id}s${Date.now()}`, photos: [it.photos[it.photos.length - 1]], name: nameFor(items.length), facts: emptyFacts(s.defaultBin) }
    const next = [...items.slice(0, idx), { ...it, photos: it.photos.slice(0, -1) }, fresh, ...items.slice(idx + 1)]
    setItems(next)
    select()
    announce(`Split. Item ${idx + 2} has 1 photo. ${next.length} items.`)
  }
  const merge = (idx: number) => {
    const next = [...items.slice(0, idx), { ...items[idx], photos: [...items[idx].photos, ...items[idx + 1].photos] }, ...items.slice(idx + 2)]
    setItems(next)
    select()
    announce(`Merged into item ${idx + 1}. ${next.length} items.`)
  }
  return (
    <Screen
      tone="grouped"
      back={{ label: 'Camera', onPress: () => router.back() }}
      footer={
        <Button
          size="lg"
          onPress={() => {
            if (s.haul) set({ haul: { ...s.haul, factIdx: 0 } })
            router.push('/haul/facts')
          }}
        >
          <Text>Looks right — add details</Text>
        </Button>
      }
    >
      <Title sub={`From ${total} photos.`}>
        {items.length} {items.length === 1 ? 'item' : 'items'} found
      </Title>
      <Alert icon={Sparkles} className="bg-accent border-transparent" iconClassName="text-accent-foreground">
        <AlertTitle className="text-accent-foreground">Grouped automatically</AlertTitle>
        <AlertDescription className="text-accent-foreground">Check that each item's photos belong together before you go on.</AlertDescription>
      </Alert>
      <View className="gap-3">
        {items.map((it, i) => (
          <Animated.View key={it.id} entering={FadeInDown.delay(i * 60).duration(320)} layout={LinearTransition.duration(220)}>
            <Card className="gap-3 px-4 py-4">
              <View className="flex-row items-baseline justify-between">
                <Text role="heading" className="text-lg font-semibold">
                  Item {i + 1}
                </Text>
                <Text className="text-muted-foreground text-sm">
                  {it.photos.length} {it.photos.length === 1 ? 'photo' : 'photos'}
                </Text>
              </View>
              <ThumbStrip uris={it.photos} size={72} />
              <View className="flex-row flex-wrap gap-2">
                {it.photos.length > 1 ? (
                  <Button variant="outline" size="sm" onPress={() => split(i)}>
                    <Icon as={Scissors} size={16} />
                    <Text>Split off last photo</Text>
                  </Button>
                ) : null}
                {i < items.length - 1 ? (
                  <Button variant="outline" size="sm" onPress={() => merge(i)}>
                    <Icon as={Merge} size={16} />
                    <Text>Merge with item {i + 2}</Text>
                  </Button>
                ) : null}
              </View>
            </Card>
          </Animated.View>
        ))}
      </View>
    </Screen>
  )
}
