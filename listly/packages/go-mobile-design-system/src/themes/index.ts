export type GoThemeName = 'light' | 'dark'

export type GoTheme = {
  background: string
  surface: string
  color: string
  borderColor: string
  actionBackground: string
  actionPressed: string
  actionColor: string
}

// Emerald Cyber semantic values. Action colors are tuned for text contrast.
export const themes = {
  light: {
    background: '#FCFDFD',
    surface: '#F0F6F4',
    color: '#232925',
    borderColor: '#627C72',
    actionBackground: '#006840',
    actionPressed: '#005333',
    actionColor: '#FFFFFF',
  },
  dark: {
    background: '#040605',
    surface: '#182420',
    color: '#EAF0EE',
    borderColor: '#79958A',
    actionBackground: '#38DD98',
    actionPressed: '#26C987',
    actionColor: '#082219',
  },
} satisfies Record<GoThemeName, GoTheme>
