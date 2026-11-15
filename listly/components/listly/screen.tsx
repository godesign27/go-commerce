import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react-native'
import type { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
  children: ReactNode
  /** Sticky actions above the home indicator. */
  footer?: ReactNode
  /** A back control. Its label names where it goes. */
  back?: { label: string; onPress: () => void }
  navTitle?: string
  right?: ReactNode
  /** Grouped screens sit on muted, so white cards stand out. */
  tone?: 'default' | 'grouped'
}

/** One layout for every screen: nav bar, scrolling content (16 pt gutter, 24 pt between sections), sticky footer. */
export function Screen({ children, footer, back, navTitle, right, tone = 'default' }: Props) {
  const insets = useSafeAreaInsets()
  const bar = !!(back || navTitle || right)
  return (
    <View className={cn('flex-1', tone === 'grouped' ? 'bg-muted/60 dark:bg-background' : 'bg-background')} style={{ paddingTop: insets.top }}>
      {bar ? (
        <View className="h-11 flex-row items-center px-2">
          <View className="flex-1 flex-row">
            {back ? (
              <Pressable accessibilityRole="button" accessibilityLabel={`Back to ${back.label}`} onPress={back.onPress} hitSlop={8} className="min-h-11 flex-row items-center pr-2 active:opacity-60">
                <Icon as={ChevronLeft} size={26} className="text-primary" />
                <Text className="text-primary text-[17px]">{back.label}</Text>
              </Pressable>
            ) : null}
          </View>
          {navTitle ? (
            <Text className="text-[17px] font-semibold" numberOfLines={1}>
              {navTitle}
            </Text>
          ) : null}
          <View className="flex-1 flex-row justify-end pr-2">{right}</View>
        </View>
      ) : null}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive">
          <View className={cn('gap-6 px-4 pb-8', bar ? 'pt-2' : 'pt-6')}>{children}</View>
        </ScrollView>
        {footer ? (
          <View className="bg-background border-border gap-2 border-t px-4 pt-3" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  )
}

export function Title({ children, sub, large }: { children: ReactNode; sub?: ReactNode; large?: boolean }) {
  return (
    <View className="gap-2">
      <Text role="heading" className={cn('font-bold tracking-tight', large ? 'text-[34px] leading-[41px]' : 'text-[28px] leading-[34px]')}>
        {children}
      </Text>
      {sub ? <Text className="text-muted-foreground text-base leading-6">{sub}</Text> : null}
    </View>
  )
}

export function Overline({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <View className="flex-row items-center justify-between px-1">
      <Text role="heading" className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
        {children}
      </Text>
      {right}
    </View>
  )
}
