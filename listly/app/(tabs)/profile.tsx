import { ListGroup, ListRow } from '@/components/listly/bits'
import { Overline, Screen } from '@/components/listly/screen'
import { Text } from '@/components/ui/text'
import { THEME } from '@/lib/theme'
import { marketName } from '@/src/model'
import { useStore } from '@/src/store'
import { announce } from '@/src/ui/feedback'
import { router } from 'expo-router'
import { useColorScheme } from 'nativewind'
import { Switch, View } from 'react-native'

function Group({ title, footer, children }: { title: string; footer?: string; children: React.ReactNode }) {
  return (
    <View className="gap-2">
      <Overline>{title}</Overline>
      <ListGroup footer={footer}>{children}</ListGroup>
    </View>
  )
}

// R-31 · S-33 · DD-14 (Keep Undo), DD-35 (Apple's hidden email)
export default function Profile() {
  const { s, set, reset, loadSamples } = useStore()
  const { colorScheme } = useColorScheme()
  const t = THEME[colorScheme === 'dark' ? 'dark' : 'light']
  const email = s.account?.email ?? 'Not signed in'
  return (
    <Screen tone="grouped">
      <Text role="heading" className="text-[34px] font-bold leading-[41px] tracking-tight">
        Profile
      </Text>
      <Group title="Account" footer={s.account?.method === 'apple' && /privaterelay|Hidden/.test(email) ? 'Hidden by Apple — emails still reach you.' : undefined}>
        <ListRow title={email} subtitle={s.account ? `Signed in with ${s.account.method === 'apple' ? 'Apple' : s.account.method === 'google' ? 'Google' : 'email'}` : undefined} />
        <ListRow title="Sign out" onPress={() => { reset(); router.replace('/welcome') }} />
      </Group>
      <Group title="Plan">
        <ListRow title={s.plan === 'reseller' ? 'Reseller plan' : s.plan === 'pass' ? 'Clear-out Pass' : 'Free trial'} trailing={!s.plan ? `${s.freeLeft} of 3 left` : undefined} />
        <ListRow title={s.plan ? 'Manage subscription' : 'See plans'} chevron onPress={() => router.push('/paywall')} />
        <ListRow title="Restore purchases" onPress={() => announce('Checking the App Store for your purchases.')} />
      </Group>
      <Group title="Marketplaces">
        <ListRow title="Drafting for" subtitle={s.markets.length ? s.markets.map(marketName).join(', ') : 'All five marketplaces'} chevron onPress={() => announce('Marketplaces and connections open here.')} />
      </Group>
      <Group title="Selling defaults">
        <ListRow title="Shipping, usually" trailing={{ buyer: 'Buyer pays', me: 'I pay', free: 'Free shipping' }[s.shipBy]} chevron onPress={() => router.push('/setup-defaults')} />
        <ListRow title="Default bin" trailing={s.defaultBin} chevron onPress={() => router.push('/setup-defaults')} />
      </Group>
      <Group title="Accessibility" footer="Undo normally closes after 10 seconds. It pauses while you're touching it.">
        <ListRow
          title="Keep Undo until I dismiss it"
          trailing={<Switch value={s.keepUndo} onValueChange={(v) => set({ keepUndo: v })} trackColor={{ true: t.primary, false: t.muted }} accessibilityLabel="Keep Undo until I dismiss it" />}
        />
      </Group>
      <Group title="Privacy and data">
        <ListRow title="How your data is used" chevron onPress={() => announce('Privacy details open here.')} />
        <ListRow title="Export all my data" chevron onPress={() => announce('Export opens here.')} />
        <ListRow title="Delete account and data" destructive onPress={() => announce('Delete asks you to confirm first.')} />
      </Group>
      <Group title="Prototype" footer="Adds 4 synthetic listings, including one sale, so you can try Mark sold, the checklist and Profit.">
        <ListRow
          title="Add sample listings"
          onPress={() => {
            loadSamples()
            announce('4 sample listings added.')
            router.navigate('/(tabs)/listings')
          }}
        />
      </Group>
      <Text className="text-muted-foreground text-center text-xs">Listly 0.1.0 · Prototype build</Text>
    </Screen>
  )
}
