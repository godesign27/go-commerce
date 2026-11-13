import { Pressable } from 'react-native'
import { Text, YStack } from 'tamagui'

export type GoButtonProps = {
  label: string
  onPress: () => void
  disabled?: boolean
}

export function GoButton({ label, onPress, disabled = false }: GoButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
    >
      {({ pressed }) => (
        <YStack
          minHeight="$4"
          minWidth="$4"
          justifyContent="center"
          alignItems="center"
          paddingHorizontal="$4"
          paddingVertical="$2"
          borderRadius="$2"
          borderWidth={1}
          borderColor={disabled ? '$borderColor' : 'transparent'}
          backgroundColor={disabled ? '$surface' : pressed ? '$actionPressed' : '$actionBackground'}
        >
          <Text
            color={disabled ? '$color' : '$actionColor'}
            fontFamily="$body"
            fontSize="$2"
            lineHeight="$2"
            fontWeight="$2"
            textAlign="center"
          >
            {label}
          </Text>
        </YStack>
      )}
    </Pressable>
  )
}
