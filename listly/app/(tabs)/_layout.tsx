import { Icon } from '@/components/ui/icon'
import { THEME } from '@/lib/theme'
import { useStore } from '@/src/store'
import { tap } from '@/src/ui/feedback'
import { Redirect, router, Tabs } from 'expo-router'
import { ChartColumn, House, Plus, Tags, UserRound, type LucideIcon } from 'lucide-react-native'
import { useColorScheme } from 'nativewind'
import { View } from 'react-native'

const tabIcon = (icon: LucideIcon) => ({ color }: { color: unknown }) => <Icon as={icon} size={24} color={String(color)} />

// R-32 · S-04 · DD-25: five tabs, New haul in the centre. The haul opens full screen without the tab bar.
export default function TabsLayout() {
  const { colorScheme } = useColorScheme()
  const t = THEME[colorScheme === 'dark' ? 'dark' : 'light']
  const { s, startHaul } = useStore()
  if (!s.onboarded) return <Redirect href="/welcome" />
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.primary,
        tabBarInactiveTintColor: t.mutedForeground,
        tabBarStyle: { backgroundColor: t.card, borderTopColor: t.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon(House) }} />
      <Tabs.Screen name="listings" options={{ title: 'Listings', tabBarIcon: tabIcon(Tags) }} />
      <Tabs.Screen
        name="new"
        options={{
          title: 'New haul',
          tabBarAccessibilityLabel: 'New haul',
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <View className="bg-primary mt-3 size-12 items-center justify-center rounded-full shadow-md shadow-black/20">
              <Icon as={Plus} size={26} className="text-primary-foreground" />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault()
            tap()
            if (!s.haul) startHaul()
            router.push('/haul')
          },
        }}
      />
      <Tabs.Screen name="profit" options={{ title: 'Profit', tabBarIcon: tabIcon(ChartColumn) }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon(UserRound) }} />
    </Tabs>
  )
}
