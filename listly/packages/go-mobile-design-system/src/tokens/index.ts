import { createFont, createTokens, isWeb } from 'tamagui'

export const metrics = {
  space: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, 5: 24 },
  radius: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16 },
  size: { 0: 0, 1: 24, 2: 32, 3: 40, 4: 44, 5: 52 },
  zIndex: { 0: 0, 1: 10, 2: 100 },
  color: {},
} as const

export const tokens = createTokens(metrics)

const body = createFont({
  family: isWeb ? 'system-ui, sans-serif' : 'System',
  size: { 1: 14, 2: 16, 3: 20, true: 16 },
  lineHeight: { 1: 20, 2: 24, 3: 28, true: 24 },
  weight: { 1: '400', 2: '600', 3: '700', true: '400' },
  letterSpacing: { 1: 0 },
})

export const fonts = { body, heading: body }
