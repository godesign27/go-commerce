import { IconBadge, Stepper } from '@/components/listly/bits'
import { Screen, Title } from '@/components/listly/screen'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { requestCamera, requestMic } from '@/src/permissions'
import { useStore } from '@/src/store'
import { announce } from '@/src/ui/feedback'
import { router } from 'expo-router'
import { Camera, CloudUpload, Hand, MapPinOff, Mic, ShieldCheck } from 'lucide-react-native'
import { useState } from 'react'
import { ActivityIndicator, View } from 'react-native'

const NOTICE = [
  { icon: CloudUpload, text: "They're sent to an AI service to sort your photos and draft listings." },
  { icon: MapPinOff, text: 'Location data is removed from photos first.' },
  { icon: Hand, text: 'Listly only writes facts you give it. Nothing is posted for you.' },
]

// R-33 step 4 · S-03 · R-23 · C-04, C-72 · DD-36: the explanation, then the camera prompt, then the microphone prompt.
export default function Permissions() {
  const { set, startHaul } = useStore()
  const [busy, setBusy] = useState(false)
  const begin = () => {
    set({ onboarded: true })
    startHaul()
    router.replace('/haul') // onboarding ends in a new haul (R-33)
  }
  const allow = async () => {
    setBusy(true)
    const cam = await requestCamera()
    const mic = await requestMic()
    set({ cam, mic })
    if (cam !== 'granted' && mic !== 'granted') announce('Camera and microphone are off. Add photos from your library and type the answers.')
    else if (cam !== 'granted') announce('Camera is off. Add photos from your library. You can still answer by voice.')
    else if (mic !== 'granted') announce("Microphone is off. You'll type each item's answers.")
    setBusy(false)
    begin()
  }
  return (
    <Screen
      footer={
        <>
          <Button size="lg" disabled={busy} onPress={allow}>
            {busy ? <ActivityIndicator color="white" /> : <Text>Allow and start my first haul</Text>}
          </Button>
          <Button
            variant="ghost"
            className="h-auto min-h-12 py-2.5"
            onPress={() => {
              announce('Nothing was asked. Add photos from your library and type the answers, or turn the camera on in the haul.')
              begin()
            }}
          >
            <Text className="text-center">Not now — I'll use my photo library and type</Text>
          </Button>
        </>
      }
    >
      <Stepper step={4} total={4} />
      <Title sub="Your phone will ask for each one next.">Camera and microphone</Title>
      <View className="gap-4">
        <View className="flex-row items-center gap-3" accessible>
          <IconBadge icon={Camera} />
          <View className="flex-1">
            <Text className="text-base font-semibold">Camera</Text>
            <Text className="text-muted-foreground text-sm">To photograph your haul.</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-3" accessible>
          <IconBadge icon={Mic} />
          <View className="flex-1">
            <Text className="text-base font-semibold">Microphone</Text>
            <Text className="text-muted-foreground text-sm">So you can say each item's brand, size, measurements, flaws and condition.</Text>
          </View>
        </View>
      </View>
      <Card className="gap-4 py-5">
        <CardHeader className="flex-row items-center gap-2 px-5">
          <Icon as={ShieldCheck} size={20} className="text-primary" />
          <CardTitle className="text-base">How your photos and answers are used</CardTitle>
        </CardHeader>
        <CardContent className="gap-3 px-5">
          {NOTICE.map((n) => (
            <View key={n.text} className="flex-row items-start gap-3" accessible>
              <Icon as={n.icon} size={18} className="text-muted-foreground mt-0.5" />
              <Text className="flex-1 text-sm leading-5">{n.text}</Text>
            </View>
          ))}
          <Button variant="link" className="self-start px-0" onPress={() => announce('Privacy details open here.')}>
            <Text>How your data is used</Text>
          </Button>
        </CardContent>
      </Card>
    </Screen>
  )
}
