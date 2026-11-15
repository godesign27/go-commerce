import { Thumb } from '@/components/listly/bits'
import { Screen, Title } from '@/components/listly/screen'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { Text } from '@/components/ui/text'
import { marketName } from '@/src/model'
import { serverDraft, uploadPhotos } from '@/src/backend'
import { useStore } from '@/src/store'
import { announce, select, success } from '@/src/ui/feedback'
import { router } from 'expo-router'
import { Check, Copy, Lock } from 'lucide-react-native'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated'

// Flow 1 · R-7, R-1 · S-12, S-18 · M-01 · D-1. The peak moment: listings arrive one by one.
export default function Drafting() {
  const { s, draftAllowed, markDrafted, updateItem, updateListing } = useStore()
  const items = s.haul?.items ?? []
  // A first estimate from the local trial count; the server's answer replaces it when signed in (R-1).
  const [plan, setPlan] = useState<('done' | 'todo' | 'locked')[]>(() => {
    let budget = s.plan ? Infinity : s.freeLeft
    return items.map((it) => (it.drafted ? 'done' : budget-- > 0 ? 'todo' : 'locked'))
  })
  const todo = plan.filter((p) => p === 'todo').length
  const [ready, setReady] = useState(0)
  const [finished, setFinished] = useState(false)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const cancelled = useRef(false)
  const markets = s.markets.length ? s.markets.map(marketName).join(', ') : 'all five marketplaces'

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined
    const run = async () => {
      let drafted: string[] | null = null
      let freeLeft: number | undefined
      if (s.userId) {
        try {
          const r = await serverDraft(items)
          if (r) {
            drafted = r.ids
            freeLeft = r.freeLeft
            setPlan(items.map((it) => (it.drafted ? 'done' : r.ids.includes(it.id) ? 'todo' : 'locked')))
            // Photos go to the seller's private folder in the background.
            const uid = s.userId
            items.forEach((it) =>
              uploadPhotos(uid, it)
                .then((photoPaths) => {
                  if (!photoPaths.length) return
                  updateItem(it.id, { photoPaths })
                  updateListing(it.id, { photoPaths })
                })
                .catch(() => {}),
            )
          }
        } catch {
          setFailed(true)
          return announce("Couldn't draft these listings. Your photos and answers are saved.")
        }
      }
      const count = drafted ? drafted.length : todo
      announce(`Drafting ${count} ${count === 1 ? 'listing' : 'listings'}.`)
      const finish = () => {
        if (drafted) markDrafted(drafted, freeLeft)
        else draftAllowed()
        success()
        setFinished(true)
        announce(`${count} ${count === 1 ? 'listing' : 'listings'} ready to post.`)
      }
      if (count === 0) return finish()
      // STAND-IN for the AI drafting call (P-03): one item every 0.7 s.
      let n = 0
      timer = setInterval(() => {
        if (cancelled.current) return clearInterval(timer)
        n += 1
        select()
        setReady(n)
        if (n >= count) {
          clearInterval(timer)
          finish()
        }
      }, 700)
    }
    run()
    return () => timer && clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt])

  let k = 0
  return (
    <Screen
      footer={
        failed ? (
          <Button
            size="lg"
            onPress={() => {
              setFailed(false)
              setAttempt((a) => a + 1)
            }}
          >
            <Text>Try again</Text>
          </Button>
        ) : finished ? (
          <Button size="lg" onPress={() => router.replace('/haul/copy')}>
            <Icon as={Copy} size={18} />
            <Text>Copy to your marketplaces</Text>
          </Button>
        ) : (
          <Button
            size="lg"
            variant="outline"
            onPress={() => {
              cancelled.current = true
              announce('Cancelled. Your photos and answers are saved.')
              router.back()
            }}
          >
            <Text>Cancel</Text>
          </Button>
        )
      }
    >
      <View className="gap-4 pt-4">
        <Title sub={failed ? 'Your photos and answers are saved. Check your connection and try again.' : finished ? 'Drafted only from what you told Listly.' : `For ${markets}. Usually under a minute.`}>
          {failed ? "Couldn't draft these listings" : finished ? `${todo} ${todo === 1 ? 'listing' : 'listings'} ready to post` : 'Drafting your listings…'}
        </Title>
        <Progress value={todo ? (Math.min(ready, todo) / todo) * 100 : 100} accessibilityLabel={`${Math.min(ready, todo)} of ${todo} drafted`} />
      </View>
      <View className="bg-card border-border overflow-hidden rounded-xl border">
        {items.map((it, i) => {
          const state = plan[i]
          const pos = state === 'todo' ? k++ : -1
          const isReady = state === 'done' || (state === 'todo' && pos < ready)
          const working = state === 'todo' && pos === ready && !finished
          return (
            <Animated.View key={it.id} entering={FadeInDown.delay(i * 50).duration(260)}>
              <View
                className={i ? 'border-border flex-row items-center gap-3 border-t px-4 py-3' : 'flex-row items-center gap-3 px-4 py-3'}
                accessible
                accessibilityLabel={`${it.name}, ${isReady ? 'ready' : working ? 'drafting' : state === 'locked' ? 'saved, waiting for a plan' : 'waiting'}`}
              >
                <Thumb uri={it.photos[0]} size={48} />
                <View className="flex-1 gap-0.5">
                  <Text className="text-base font-semibold" numberOfLines={1}>
                    {it.name}
                  </Text>
                  <Text className="text-muted-foreground text-sm" numberOfLines={1}>
                    {it.facts.brand || 'Brand not given'}
                    {it.facts.cond ? ` · ${it.facts.cond}` : ''}
                  </Text>
                </View>
                {isReady ? (
                  <Animated.View entering={ZoomIn.springify().damping(14)} className="bg-success-soft size-7 items-center justify-center rounded-full">
                    <Icon as={Check} size={16} className="text-success" />
                  </Animated.View>
                ) : working ? (
                  <ActivityIndicator />
                ) : state === 'locked' ? (
                  <Badge variant="lock">
                    <Icon as={Lock} size={11} className="text-muted-foreground" />
                    <Text>Locked</Text>
                  </Badge>
                ) : (
                  <Text className="text-muted-foreground text-sm">Waiting</Text>
                )}
              </View>
            </Animated.View>
          )
        })}
      </View>
      {plan.includes('locked') ? <Text className="text-muted-foreground text-sm">Locked items keep their photos and answers. They draft as soon as you pick a plan.</Text> : null}
    </Screen>
  )
}
