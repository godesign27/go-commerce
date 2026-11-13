# GO Mobile Design System

A private, source-first React Native package for Listly and other GO apps. Tamagui provides themed layout and typography, and React Native Pressable handles the button interaction and accessibility state.

| Location | Contents |
| --- | --- |
| `src/components` | GoButton and GoCard |
| `src/tokens` | Spacing, sizing, radii, stacking, and typography |
| `src/themes` | Light and dark semantic roles and the original Emerald Cyber generator input |
| `contracts/components.json` | Component props, states, usage, and accessibility requirements for coding agents |
| `skills/tamagui-theme-generator/SKILL.md` | Supplied v3.0.0 skill |

The shipped color roles are a hand-mapped Emerald Cyber interpretation with action colors tuned for text contrast. The original input remains available for the supplied preview workflow.

## Phased plan

1. **Foundation.** Establish the package, original theme source, two components, and agent contracts. Run `npm run validate` with Node 22.18+ and `npm run typecheck` after installing the package dependencies.
2. **Expo pilot.** Add or locate the Listly Expo app and link this source package through its workspace. Align the app and package on one React, React Native, and Tamagui installation. Install Expo-compatible peers per the [Tamagui Expo guide](https://tamagui.dev/docs/guides/expo). Mount one provider and render a card with enabled and disabled buttons on a dedicated preview screen. Use `useColorScheme()` at the root to choose the theme, falling back to light.
3. **iOS acceptance.** Run the preview on an iOS simulator or device. Verify both schemes, one callback per activation, disabled behavior, VoiceOver label and state, a 44 × 44 point minimum target, and legibility at large text sizes. Check that the system theme switches while the app is open.
4. **First Listly feature.** Adopt the package on one product screen and add components as actual use cases require them. Update agent contracts alongside each change.

## Expo pilot example

The consuming app supplies navigation, content, and action callbacks.

```tsx
import { useColorScheme } from 'react-native'
import { TamaguiProvider, Text } from 'tamagui'
import { GoButton, GoCard } from '@go-commerce/mobile-design-system'
import { config } from '@go-commerce/mobile-design-system/config'

export function Preview({ onContinue }: { onContinue: () => void }) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light'

  return (
    <TamaguiProvider config={config} defaultTheme={scheme}>
      <GoCard>
        <Text color="$color" fontFamily="$body" fontSize="$2">Listly preview</Text>
        <GoButton label="Continue" onPress={onContinue} />
        <GoButton label="Publish" onPress={onContinue} disabled />
      </GoCard>
    </TamaguiProvider>
  )
}
```
