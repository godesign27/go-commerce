import { createTamagui } from 'tamagui'
import { themes } from './themes'
import { fonts, tokens } from './tokens'

export const config = createTamagui({
  tokens,
  fonts,
  themes,
  defaultFont: 'body',
})

type GoConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends GoConfig {}
}

export default config
