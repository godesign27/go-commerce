import { Chip, Field, ThumbStrip } from '@/components/listly/bits'
import { Overline, Screen } from '@/components/listly/screen'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { heardFor } from '@/src/ai'
import { CONDITIONS, DEPARTMENTS, factsComplete, type Facts } from '@/src/model'
import { openSettings, requestMic } from '@/src/permissions'
import { useStore } from '@/src/store'
import { announce, select, success, tap } from '@/src/ui/feedback'
import { router } from 'expo-router'
import { CircleHelp, Lock, Mic, MicOff, Sparkles, AudioLines } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import Animated, { FadeIn, cancelAnimation, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'

/** The big microphone. A pulsing ring while listening; still under Reduce Motion. */
function MicButton({ listening, onPress, label }: { listening: boolean; onPress: () => void; label: string }) {
  const reduce = useReducedMotion()
  const ring = useSharedValue(1)
  useEffect(() => {
    if (listening && !reduce) ring.value = withRepeat(withTiming(1.35, { duration: 700 }), -1, true)
    else {
      cancelAnimation(ring)
      ring.value = withTiming(1, { duration: 150 })
    }
  }, [listening, reduce, ring])
  const ringStyle = useAnimatedStyle(() => ({ transform: [{ scale: ring.value }], opacity: listening ? 0.22 : 0 }))
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ busy: listening }} onPress={onPress} className="active:scale-95">
      <View className="size-24 items-center justify-center">
        <Animated.View style={[{ position: 'absolute', width: 96, height: 96, borderRadius: 48 }, ringStyle]} className="bg-primary" />
        <View className="bg-primary size-[76px] items-center justify-center rounded-full shadow-lg shadow-black/20">
          <Icon as={listening ? AudioLines : Mic} size={32} className="text-primary-foreground" />
        </View>
      </View>
    </Pressable>
  )
}

// Flow 1 · R-6 · S-09, S-10, S-11 · DD-04, DD-05, DD-06, DD-30 · C-06, C-12, C-13, C-71
export default function FactsScreen() {
  const { s, set, updateItem } = useStore()
  const haul = s.haul
  const idx = haul?.factIdx ?? 0
  const items = haul?.items ?? []
  const item = items[idx]
  const [listening, setListening] = useState(false)
  const [typing, setTyping] = useState(false)
  useEffect(() => setTyping(false), [idx])
  if (!item) return null
  const f = item.facts
  const n = items.length
  const locked = !s.plan && idx >= s.freeLeft + items.filter((i) => i.drafted).length
  const answered = f.source !== 'none' || typing
  const done = factsComplete(f)
  const setF = (patch: Partial<Facts>) => updateItem(item.id, (it) => ({ facts: { ...it.facts, ...patch, source: it.facts.source === 'none' ? 'typed' : it.facts.source } }))

  const listen = () => {
    if (listening) return
    tap()
    setListening(true)
    announce('Listening.')
    // STAND-IN for speech capture + P-02 extraction (no speech recognition yet): fills a synthetic answer.
    setTimeout(() => {
      const h = heardFor(idx)
      updateItem(item.id, (it) => ({ facts: { ...it.facts, ...h, bin: it.facts.bin, source: 'voice' } }))
      setListening(false)
      success()
      const missing = [!h.noFlaws && !h.flaws ? 'flaws' : '', !h.cond ? 'condition' : ''].filter(Boolean)
      announce(`Heard: ${h.heard}. ${missing.length ? `Still needed: ${missing.join(' and ')}.` : 'All filled in.'}`)
    }, 1600)
  }
  const go = (to: number) => haul && set({ haul: { ...haul, factIdx: to } })
  const next = () => {
    select()
    if (idx < n - 1) {
      go(idx + 1)
      announce(`Item ${idx + 2} of ${n}.`)
    } else router.push('/haul/drafting')
  }

  return (
    <Screen
      tone="grouped"
      back={{ label: idx === 0 ? 'Items' : `Item ${idx}`, onPress: () => (idx === 0 ? router.back() : go(idx - 1)) }}
      navTitle={`Item ${idx + 1} of ${n}`}
      right={
        !s.plan ? (
          <Badge variant="accent" accessibilityLabel={`${s.freeLeft} of your 3 free listings left`}>
            <Text>{s.freeLeft} free left</Text>
          </Badge>
        ) : undefined
      }
      footer={
        <>
          <Button size="lg" disabled={!done} onPress={next}>
            <Text>{idx < n - 1 ? 'Next item' : 'Draft listings'}</Text>
          </Button>
          {!done && answered ? <Text className="text-muted-foreground text-center text-sm">Add the flaws (or “No flaws”) and the condition to go on.</Text> : null}
        </>
      }
    >
      <Animated.View key={item.id} entering={FadeIn.duration(220)} className="gap-6">
        <View className="gap-3">
          <ThumbStrip uris={item.photos} size={64} />
          <View className="gap-1">
            <Text role="heading" className="text-2xl font-bold tracking-tight">
              {item.name}
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Icon as={Sparkles} size={14} className="text-muted-foreground" />
              <Text className="text-muted-foreground text-sm">Named from the photos. Check it's right.</Text>
            </View>
          </View>
        </View>

        {locked ? (
          <Alert icon={Lock}>
            <AlertTitle>Saved for when you pick a plan</AlertTitle>
            <AlertDescription>Your 3 free listings cover the first items. Answer this one now, and it's ready to draft later.</AlertDescription>
          </Alert>
        ) : null}

        <Card className="gap-4 px-4 py-5">
          {s.mic === 'granted' ? (
            <View className="items-center gap-2">
              <MicButton listening={listening} onPress={listen} label={f.source === 'voice' ? 'Talk again' : 'Tap to talk'} />
              <Text className="text-base font-semibold">{listening ? 'Listening…' : f.source === 'voice' ? 'Tap to talk again' : 'Tap and say what you know'}</Text>
              <Text className="text-muted-foreground text-center text-sm">Brand, size, measurements, any flaws, and the condition.</Text>
            </View>
          ) : (
            <Alert icon={MicOff}>
              <AlertTitle>{s.mic === 'denied' ? 'Microphone is off.' : "The microphone isn't on yet."}</AlertTitle>
              <AlertDescription>{s.mic === 'denied' ? 'Type the answers, or turn the microphone on in Settings.' : 'Turn it on to say the answers, or type them.'}</AlertDescription>
              <Button variant="outline" size="sm" className="mt-3 self-start" onPress={s.mic === 'denied' ? openSettings : async () => set({ mic: await requestMic() })}>
                <Text>{s.mic === 'denied' ? 'Open Settings' : 'Turn on microphone'}</Text>
              </Button>
            </Alert>
          )}
          {f.source === 'voice' && f.heard ? (
            <View className="bg-muted gap-1 rounded-lg p-3">
              <Text className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Heard</Text>
              <Text className="text-base leading-6">“{f.heard}”</Text>
              <Text className="text-muted-foreground text-xs">Prototype: a sample answer. Speech recognition isn't connected yet.</Text>
            </View>
          ) : null}
          {!answered ? (
            <Button variant="ghost" onPress={() => setTyping(true)}>
              <Text>Type the answers instead</Text>
            </Button>
          ) : null}
        </Card>

        {answered ? (
          <Animated.View entering={FadeIn.duration(220)} className="gap-6">
            {f.source === 'voice' && !f.noFlaws && !f.flaws ? (
              <Alert icon={CircleHelp} className="border-primary border-2">
                <AlertTitle>Any flaws?</AlertTitle>
                <AlertDescription>Buyers return items when a flaw wasn't mentioned. Add them, or tap No flaws.</AlertDescription>
              </Alert>
            ) : null}
            {f.source === 'voice' && !f.cond ? (
              <Alert icon={CircleHelp} className="border-primary border-2">
                <AlertTitle>What condition is it in?</AlertTitle>
                <AlertDescription>Pick one below. Listly won't guess it from the photos.</AlertDescription>
              </Alert>
            ) : null}

            <View className="gap-3">
              <Overline>Required</Overline>
              <Card className="gap-5 px-4 py-5">
                <Field label="Condition">
                  <View className="flex-row flex-wrap gap-2" accessibilityRole="radiogroup">
                    {CONDITIONS.map((c) => (
                      <Chip key={c} mode="single" label={c} selected={f.cond === c} onPress={() => setF({ cond: c })} />
                    ))}
                  </View>
                </Field>
                <Field label="Flaws">
                  <Input value={f.flaws} onChangeText={(v) => setF({ flaws: v, noFlaws: false })} accessibilityLabel="Flaws" placeholder={f.noFlaws ? 'No flaws' : 'e.g. Small mark on the left cuff'} />
                  <View className="flex-row pt-1">
                    <Chip label="No flaws" selected={f.noFlaws} onPress={() => setF({ noFlaws: !f.noFlaws, flaws: '' })} />
                  </View>
                </Field>
              </Card>
            </View>

            <View className="gap-3">
              <Overline>About the item</Overline>
              <Card className="gap-5 px-4 py-5">
                <Field label="Brand">
                  <Input value={f.brand} onChangeText={(v) => setF({ brand: v })} accessibilityLabel="Brand" placeholder="Not given" autoCapitalize="words" />
                </Field>
                <Field label="Men's, women's or unisex">
                  <View className="flex-row flex-wrap gap-2" accessibilityRole="radiogroup">
                    {DEPARTMENTS.map((d) => (
                      <Chip key={d} mode="single" label={d} selected={f.dept === d} onPress={() => setF({ dept: f.dept === d ? '' : d })} />
                    ))}
                  </View>
                </Field>
                <Field label="Size">
                  <Input value={f.size} onChangeText={(v) => setF({ size: v })} accessibilityLabel="Size" placeholder="As on the tag, e.g. M or 32x30" />
                </Field>
                <Field label="Measurements">
                  <Input value={f.meas} onChangeText={(v) => setF({ meas: v })} accessibilityLabel="Measurements" placeholder="e.g. Pit to pit 21 in" />
                </Field>
              </Card>
            </View>

            <View className="gap-3">
              <Overline>Only for you</Overline>
              <Card className="px-4 py-5">
                <Field label="Bin" helper="Where you're keeping it. Never shown in a listing.">
                  <Input value={f.bin} onChangeText={(v) => setF({ bin: v })} accessibilityLabel="Bin" />
                </Field>
              </Card>
            </View>
          </Animated.View>
        ) : null}
      </Animated.View>
    </Screen>
  )
}
