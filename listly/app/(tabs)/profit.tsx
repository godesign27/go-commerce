import { IconBadge } from '@/components/listly/bits'
import { Screen } from '@/components/listly/screen'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { ChartColumn } from 'lucide-react-native'
import { View } from 'react-native'

// R-16 · S-31 · empty state (the tracker comes in the next pass)
export default function Profit() {
  return (
    <Screen tone="grouped">
      <Text role="heading" className="text-[34px] font-bold leading-[41px] tracking-tight">
        Profit
      </Text>
      <View className="flex-row gap-3">
        {[
          ['$0.00', 'Net profit this month'],
          ['0', 'Sold'],
        ].map(([v, l]) => (
          <Card key={l} className="flex-1 gap-1 px-4 py-4">
            <Text className="text-3xl font-bold tracking-tight">{v}</Text>
            <Text className="text-muted-foreground text-sm">{l}</Text>
          </Card>
        ))}
      </View>
      <Card className="items-center gap-3 px-5 py-8">
        <IconBadge icon={ChartColumn} size={64} />
        <Text role="heading" className="text-center text-xl font-semibold">
          No sales yet
        </Text>
        <Text className="text-muted-foreground text-center text-base leading-6">When you mark an item sold, Profit shows what you made after each marketplace's fees, shipping and what you paid.</Text>
      </Card>
    </Screen>
  )
}
