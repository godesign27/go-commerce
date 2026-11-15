import * as AppleAuthentication from 'expo-apple-authentication'
import { useColorScheme } from 'nativewind'
import { useEffect, useState } from 'react'
import { Platform } from 'react-native'

/** Apple's own button (platform UI; Apple's rules say not to restyle it), 52 pt. */
export function AppleButton({ onPress }: { onPress: () => void }) {
  const { colorScheme } = useColorScheme()
  const [ok, setOk] = useState(Platform.OS === 'ios')
  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setOk).catch(() => setOk(false))
  }, [])
  if (!ok) return null
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
      buttonStyle={colorScheme === 'dark' ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={12}
      style={{ height: 52, width: '100%' }}
      onPress={onPress}
    />
  )
}

/** Cancelling is not an error (DD-34). No Listly server yet: success creates a local account only. */
export async function signInWithApple(): Promise<'cancelled' | 'failed' | { email: string }> {
  try {
    const c = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.EMAIL, AppleAuthentication.AppleAuthenticationScope.FULL_NAME],
    })
    return { email: c.email ?? 'Hidden by Apple' }
  } catch (e) {
    return (e as { code?: string }).code === 'ERR_REQUEST_CANCELED' ? 'cancelled' : 'failed'
  }
}
