import '../global.css'

import { ThemeProvider } from '@react-navigation/native'
import { PortalHost } from '@rn-primitives/portal'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useColorScheme } from 'nativewind'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { NAV_THEME } from '@/lib/theme'
import { usePermissionSync } from '@/src/permissions'
import { StoreProvider } from '@/src/store'

function Navigator() {
  usePermissionSync()
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      {/* The haul is a full-screen flow without the tab bar (DD-02). */}
      <Stack.Screen name="haul" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
      <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
      <Stack.Screen name="setup-defaults" options={{ presentation: 'modal' }} />
      <Stack.Screen name="item/[id]" />
      <Stack.Screen name="sold/[id]" options={{ presentation: 'modal' }} />
      <Stack.Screen name="checklist/[id]" options={{ gestureEnabled: false }} />
    </Stack>
  )
}

export default function RootLayout() {
  const { colorScheme } = useColorScheme()
  const scheme = colorScheme === 'dark' ? 'dark' : 'light'
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={NAV_THEME[scheme]}>
          <StoreProvider>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            <Navigator />
            <PortalHost />
          </StoreProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
