import { useState } from 'react'
import { ScrollView, StatusBar, useColorScheme } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { TamaguiProvider, Text, YStack } from 'tamagui'
import { GoButton, GoCard } from '@go-commerce/mobile-design-system'
import { config } from '@go-commerce/mobile-design-system/config'

function DesignSystemPreview() {
  const [activationCount, setActivationCount] = useState(0)

  function recordActivation() {
    setActivationCount((count) => count + 1)
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
          <YStack alignSelf="center" width="100%" maxWidth={520} padding="$4">
            <GoCard>
              <Text
                accessibilityRole="header"
                color="$color"
                fontFamily="$heading"
                fontSize="$3"
                lineHeight="$3"
                fontWeight="$3"
              >
                Listly design system preview
              </Text>
              <Text color="$color" fontFamily="$body" fontSize="$2" lineHeight="$2">
                Activations: {activationCount}
              </Text>
              <GoButton label="Record activation" onPress={recordActivation} />
              <GoButton label="Record activation (disabled)" onPress={recordActivation} disabled />
            </GoCard>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    </YStack>
  )
}

export default function App() {
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light'

  return (
    <SafeAreaProvider>
      <TamaguiProvider config={config} defaultTheme={theme}>
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
        <DesignSystemPreview />
      </TamaguiProvider>
    </SafeAreaProvider>
  )
}
