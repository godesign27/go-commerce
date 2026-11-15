import { IconBadge, Stepper } from '@/components/listly/bits'
import { Screen } from '@/components/listly/screen'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { router } from 'expo-router'
import { Camera, CircleCheck, Copy, Gift, Mic, Tags } from 'lucide-react-native'
import { View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

const STEPS = [
  { icon: Camera, title: 'Photograph the pile', body: '2 to 4 photos of each item. Listly sorts them into items.' },
  { icon: Mic, title: 'Say what you know', body: 'Brand, size, flaws and condition. Listly never makes facts up.' },
  { icon: Copy, title: 'Copy to every marketplace', body: 'A listing drafted for each one, ready to paste.' },
]

/** A preview of the result, so a new seller sees the payoff before any setup. Synthetic. */
function Preview() {
  return (
    <View className="bg-card border-border gap-3 rounded-2xl border p-4 shadow-lg shadow-black/10" accessible accessibilityLabel="Example: a denim jacket listing, ready for eBay, Poshmark and Mercari">
      <View className="flex-row items-center gap-3">
        <View className="bg-accent size-14 items-center justify-center rounded-xl">
          <Icon as={Tags} size={26} className="text-accent-foreground" />
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-base font-semibold">Levi's Denim Trucker Jacket, M</Text>
          <Text className="text-muted-foreground text-sm">Good condition · small mark on the cuff</Text>
        </View>
      </View>
      <View className="flex-row flex-wrap gap-2">
        {['eBay', 'Poshmark', 'Mercari'].map((m) => (
          <Badge key={m} variant="success">
            <Icon as={CircleCheck} size={12} className="text-success" />
            <Text>{m}</Text>
          </Badge>
        ))}
      </View>
    </View>
  )
}

// R-33 step 1 · C-01 · DD-01
export default function Welcome() {
  return (
    <Screen
      footer={
        <>
          <Button size="lg" onPress={() => router.push('/markets')}>
            <Text>Get started</Text>
          </Button>
          <Button variant="ghost" onPress={() => router.push('/sign-in')}>
            <Text>I already have an account</Text>
          </Button>
        </>
      }
    >
      <Stepper step={1} total={4} />
      <Animated.View entering={FadeInDown.duration(420)} className="gap-5">
        <Preview />
        <Text role="heading" className="text-[34px] font-bold leading-[41px] tracking-tight">
          List a whole haul from your phone.
        </Text>
        <Text className="text-muted-foreground text-base leading-6">
          Sell on eBay, Poshmark, Mercari, Depop and Facebook Marketplace. Always know what's sold, where it is and what you made.
        </Text>
      </Animated.View>
      <View className="gap-4">
        {STEPS.map((s, i) => (
          <Animated.View key={s.title} entering={FadeInDown.delay(120 + i * 70).duration(380)}>
            <View className="flex-row items-start gap-3" accessible accessibilityLabel={`${s.title}. ${s.body}`}>
              <IconBadge icon={s.icon} size={40} />
              <View className="flex-1 gap-0.5">
                <Text className="text-base font-semibold">{s.title}</Text>
                <Text className="text-muted-foreground text-sm leading-5">{s.body}</Text>
              </View>
            </View>
          </Animated.View>
        ))}
      </View>
      <View className="bg-accent flex-row items-center gap-3 rounded-xl p-4">
        <Icon as={Gift} size={22} className="text-accent-foreground" />
        <View className="flex-1">
          <Text className="text-accent-foreground text-base font-semibold">Your first 3 listings are free</Text>
          <Text className="text-accent-foreground text-sm">No card needed. See the listings before you decide.</Text>
        </View>
      </View>
    </Screen>
  )
}
