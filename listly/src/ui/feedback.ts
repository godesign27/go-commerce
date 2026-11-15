import * as Haptics from 'expo-haptics'
import { AccessibilityInfo } from 'react-native'

/** Status changes are announced (R-24). */
export const announce = (msg: string) => AccessibilityInfo.announceForAccessibility(msg)

/** Haptics: light for a tap that changes something, success for a finished step. Never the only feedback. */
export const tap = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {})
export const select = () => Haptics.selectionAsync().catch(() => {})
export const success = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {})
export const warn = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {})
