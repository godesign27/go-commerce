import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { openSettings, requestCamera } from '@/src/permissions'
import { useStore } from '@/src/store'
import { announce, select, tap, warn } from '@/src/ui/feedback'
import { CameraView } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ArrowRight, Camera, CameraOff, Images, X, type LucideIcon } from 'lucide-react-native'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

/** A round glass control over the camera. 44 pt minimum, labelled. */
function Round({ icon, label, onPress, size = 44 }: { icon: LucideIcon; label: string; onPress: () => void; size?: number }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={6} className="items-center justify-center rounded-full bg-black/55 active:opacity-70" style={{ width: size, height: size }}>
      <Icon as={icon} size={Math.round(size * 0.46)} className="text-white" />
    </Pressable>
  )
}

// Flow 1 · R-4 · S-05 · DD-02, DD-36, DD-37 · C-05, C-70. Always dark: it's a camera.
export default function Capture() {
  const { s, set, startHaul, addPhotos, markNextItem, group } = useStore()
  const insets = useSafeAreaInsets()
  const cam = useRef<CameraView>(null)
  const [ready, setReady] = useState(false)
  const [noCamera, setNoCamera] = useState(false)
  useEffect(() => {
    if (!s.haul) startHaul()
  }, [s.haul, startHaul])
  // The simulator and some devices have no camera: say so instead of showing a black screen.
  useEffect(() => {
    if (s.cam !== 'granted') return
    const t = setTimeout(() => !ready && setNoCamera(true), 2500)
    return () => clearTimeout(t)
  }, [s.cam, ready])

  const photos = s.haul?.photos ?? []
  const marks = s.haul?.marks ?? []
  const itemNo = marks.length + 1
  const live = s.cam === 'granted' && !noCamera

  const shoot = async () => {
    if (!ready || !cam.current) {
      warn()
      setNoCamera(true)
      return announce('No camera on this device. Add photos from your library.')
    }
    tap()
    const p = await cam.current.takePictureAsync({ quality: 0.6 })
    if (p?.uri) {
      addPhotos([p.uri])
      announce(`${photos.length + 1} photos`)
    }
  }
  const library = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsMultipleSelection: true, selectionLimit: 40, quality: 0.6 })
    if (!r.canceled && r.assets.length) {
      addPhotos(r.assets.map((a) => a.uri))
      select()
      announce(`${r.assets.length} photos added. ${photos.length + r.assets.length} in all.`)
    }
  }
  const nextItem = () => {
    if (!photos.length) return
    select()
    markNextItem()
    announce(`Item ${itemNo + 1}. Photograph the next item.`)
  }
  const close = () => {
    announce(photos.length ? 'Saved. Continue this haul from Home.' : 'Haul closed. Nothing to save.')
    if (!photos.length) set({ haul: null })
    router.replace('/(tabs)')
  }

  return (
    <View className="flex-1 bg-[#05070A]">
      <StatusBar style="light" />
      {live ? <CameraView ref={cam} style={StyleSheet.absoluteFill} facing="back" onCameraReady={() => setReady(true)} accessibilityLabel="Camera viewfinder" /> : null}

      <View className="flex-row items-center justify-between px-4" style={{ paddingTop: insets.top + 8 }}>
        <Round icon={X} label={photos.length ? 'Close and save for later' : 'Close'} onPress={close} />
        <View className="h-8 justify-center rounded-full bg-black/55 px-3" accessible accessibilityLabel={`${photos.length} photos, item ${itemNo}`} accessibilityLiveRegion="polite">
          <Text className="text-sm font-semibold text-white">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'} · Item {itemNo}
          </Text>
        </View>
        <View className="w-11" />
      </View>

      <View className="flex-1 items-center justify-center gap-4 px-8">
        {live ? (
          photos.length === 0 ? (
            <Animated.View entering={FadeIn.delay(300)} className="max-w-[300px] rounded-2xl bg-black/55 px-4 py-3">
              <Text className="text-center text-base text-white">Take 2 to 4 photos of each item. Tap Next item before the next one.</Text>
            </Animated.View>
          ) : null
        ) : (
          <Animated.View entering={FadeIn} className="max-w-[320px] items-center gap-3">
            <View className="size-[72px] items-center justify-center rounded-full bg-white/10">
              <Icon as={noCamera ? CameraOff : Camera} size={32} className="text-white" />
            </View>
            <Text role="heading" className="text-center text-xl font-semibold text-white">
              {noCamera ? 'No camera on this device' : s.cam === 'denied' ? 'Camera access is off' : "The camera isn't on yet"}
            </Text>
            <Text className="text-center text-base text-white/75">
              {noCamera ? 'Add the photos from your library instead.' : s.cam === 'denied' ? 'Turn it on in Settings, or add photos from your library.' : 'Turn it on to photograph your haul here, or add photos from your library.'}
            </Text>
            {noCamera ? null : (
              <Button variant="secondary" onPress={s.cam === 'denied' ? openSettings : async () => set({ cam: await requestCamera() })}>
                <Text>{s.cam === 'denied' ? 'Open Settings' : 'Turn on camera'}</Text>
              </Button>
            )}
          </Animated.View>
        )}
      </View>

      <View className="gap-3 bg-black/60 pt-3" style={{ paddingBottom: insets.bottom + 12 }}>
        {photos.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 6, alignItems: 'center' }} accessibilityLabel="Photos in this haul">
            {photos.map((u, i) => (
              <Fragment key={`${u}-${i}`}>
                {marks.includes(i) ? <View className="mx-1 h-9 w-0.5 rounded-full bg-white/55" accessible={false} /> : null}
                <Animated.View entering={ZoomIn.duration(180)}>
                  <Image source={{ uri: u }} style={{ width: 44, height: 44, borderRadius: 8 }} accessible={false} />
                </Animated.View>
              </Fragment>
            ))}
          </ScrollView>
        ) : null}
        <View className="flex-row items-center justify-between px-8">
          <View className="w-[72px] items-center gap-1">
            <Round icon={Images} label="Add from library" onPress={library} size={52} />
            <Text className="text-xs text-white/75" accessible={false}>
              Library
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Take photo"
            accessibilityState={{ disabled: !live }}
            disabled={!live}
            onPress={shoot}
            className={cn('size-[76px] items-center justify-center rounded-full border-4 border-white active:scale-95', !live && 'opacity-35')}
          >
            <View className="size-[62px] rounded-full bg-white" />
          </Pressable>
          <View className={cn('w-[72px] items-center gap-1', !photos.length && 'opacity-40')}>
            <Round icon={ArrowRight} label="Next item" onPress={nextItem} size={52} />
            <Text className="text-xs text-white/75" accessible={false}>
              Next item
            </Text>
          </View>
        </View>
        <View className="px-4">
          <Button
            size="lg"
            disabled={!photos.length}
            onPress={() => {
              group()
              router.push('/haul/group')
            }}
          >
            <Text>{photos.length ? `Done · ${photos.length} photos` : 'Done'}</Text>
          </Button>
        </View>
      </View>
    </View>
  )
}
