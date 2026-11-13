import type { ReactNode } from 'react'
import { YStack } from 'tamagui'

export type GoCardProps = { children: ReactNode }

export function GoCard({ children }: GoCardProps) {
  return (
    <YStack
      backgroundColor="$surface"
      borderColor="$borderColor"
      borderWidth={1}
      borderRadius="$3"
      padding="$4"
      gap="$3"
    >
      {children}
    </YStack>
  )
}
