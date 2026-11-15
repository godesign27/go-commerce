import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native'

/** The same shadcn tokens as global.css, for React Navigation (tab bar, headers, screen backgrounds). */
export const THEME = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 47.4% 11.2%)',
    card: 'hsl(0 0% 100%)',
    primary: 'hsl(219 74.7% 48%)',
    primaryForeground: 'hsl(0 0% 100%)',
    muted: 'hsl(210 40% 96.1%)',
    mutedForeground: 'hsl(215 13.6% 37.3%)',
    accent: 'hsl(218.2 84.6% 94.9%)',
    accentForeground: 'hsl(219.4 74.8% 40.4%)',
    border: 'hsl(214.3 31.8% 91.4%)',
    destructive: 'hsl(4.2 76.5% 40%)',
    success: 'hsl(146.5 67.9% 26.9%)',
  },
  dark: {
    background: 'hsl(222.9 84% 4.9%)',
    foreground: 'hsl(210 40% 98%)',
    card: 'hsl(221.7 51.1% 8.8%)',
    primary: 'hsl(216.5 100% 73.9%)',
    primaryForeground: 'hsl(216 76.9% 10.2%)',
    muted: 'hsl(217.2 32.6% 17.5%)',
    mutedForeground: 'hsl(215 20.2% 65.1%)',
    accent: 'hsl(217.3 55.6% 15.9%)',
    accentForeground: 'hsl(217.9 100% 82.9%)',
    border: 'hsl(217.2 32.6% 17.5%)',
    destructive: 'hsl(4.7 100% 75.1%)',
    success: 'hsl(149.2 58.4% 61.4%)',
  },
}

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: { background: THEME.light.background, border: THEME.light.border, card: THEME.light.card, notification: THEME.light.destructive, primary: THEME.light.primary, text: THEME.light.foreground },
  },
  dark: {
    ...DarkTheme,
    colors: { background: THEME.dark.background, border: THEME.dark.border, card: THEME.dark.card, notification: THEME.dark.destructive, primary: THEME.dark.primary, text: THEME.dark.foreground },
  },
}
