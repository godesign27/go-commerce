import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { themes } from './src/themes/index.ts'

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8')
const skill = await read('./skills/tamagui-theme-generator/SKILL.md')
const source = JSON.parse(await read('./src/themes/emerald-cyber.json'))
const example = skill.match(/```json\n([\s\S]*?)\n```/)
assert.ok(example, 'The skill must include its example JSON')
assert.deepEqual(source, JSON.parse(example[1]))
assert.deepEqual(source.schemes, { light: true, dark: true })
assert.deepEqual(Object.keys(themes.light).sort(), Object.keys(themes.dark).sort())

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((value) => {
    const srgb = Number.parseInt(value, 16) / 255
    return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4
  })
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
}

for (const [name, theme] of Object.entries(themes)) {
  const textPairs = [
    ['color', 'background'],
    ['color', 'surface'],
    ['actionColor', 'actionBackground'],
    ['actionColor', 'actionPressed'],
  ]

  for (const [foreground, background] of textPairs) {
    const values = [luminance(theme[foreground]), luminance(theme[background])]
    const ratio = (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05)
    assert.ok(ratio >= 4.5, `${name} ${foreground}/${background} contrast is ${ratio.toFixed(2)}`)
  }
}

const manifest = JSON.parse(await read('./contracts/components.json'))
const entry = await read('./src/index.ts')
for (const component of Object.keys(manifest.components)) {
  assert.match(entry, new RegExp(`export \\{ ${component},`))
}

console.log('Theme example, text contrast, and component contract exports passed.')
