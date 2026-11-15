import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { announce } from '@/src/ui/feedback'
import { X } from 'lucide-react-native'
import { useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, Pressable, View } from 'react-native'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'

const SECONDS = 10

type Props = {
  message: string
  onUndo: () => void
  /** After a tick: reverts the sale and every tick since (D-10). */
  onUndoSale?: () => void
  onClose: () => void
  /** Profile → Accessibility → "Keep Undo until I dismiss it" (WCAG 2.2.1 "turn off"). */
  keep: boolean
}

/**
 * Undo with a visible 10-second countdown (DD-14, A-20). Meets WCAG 2.2.1 three ways: it can be turned off,
 * it pauses while touched, and it warns at 3 seconds. With a screen reader on it doesn't time out [H].
 */
export function UndoBar({ message, onUndo, onUndoSale, onClose, keep }: Props) {
  const [left, setLeft] = useState(SECONDS)
  const [screenReader, setScreenReader] = useState(false)
  const held = useRef(false)
  const timed = !keep && !screenReader

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setScreenReader)
  }, [])
  useEffect(() => setLeft(SECONDS), [message])
  useEffect(() => {
    if (!timed) return
    const t = setInterval(() => {
      if (held.current) return
      setLeft((l) => {
        if (l === 4) announce('Undo closes in 3 seconds.')
        if (l <= 1) {
          clearInterval(t)
          setTimeout(onClose, 0)
          return 0
        }
        return l - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [timed, message, onClose])

  return (
    <Animated.View entering={FadeInDown.duration(220)} exiting={FadeOutDown.duration(160)}>
      <View
        onTouchStart={() => (held.current = true)}
        onTouchEnd={() => (held.current = false)}
        onTouchCancel={() => (held.current = false)}
        accessibilityRole="alert"
        className="bg-foreground gap-2 rounded-xl px-4 py-3 shadow-lg shadow-black/25"
      >
        <View className="flex-row items-center gap-2">
          <Text className="text-background flex-1 text-base font-medium">{message}</Text>
          {timed ? (
            <Text className="text-background/70 text-sm" accessible={false}>
              {left} s
            </Text>
          ) : null}
          <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" onPress={onClose} hitSlop={8} className="size-11 items-center justify-center -mr-2">
            <Icon as={X} size={18} className="text-background" />
          </Pressable>
        </View>
        <View className="flex-row gap-2">
          <Button size="sm" variant="secondary" onPress={onUndo}>
            <Text>Undo</Text>
          </Button>
          {onUndoSale ? (
            <Button size="sm" variant="secondary" onPress={onUndoSale}>
              <Text>Undo sale</Text>
            </Button>
          ) : null}
        </View>
        {timed ? (
          <View className="bg-background/20 h-0.5 overflow-hidden rounded-full" accessible={false}>
            <View className="bg-background h-full" style={{ width: `${(left / SECONDS) * 100}%` }} />
          </View>
        ) : null}
      </View>
    </Animated.View>
  )
}
