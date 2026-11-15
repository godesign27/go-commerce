import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { AppState } from 'react-native'

const url = process.env.EXPO_PUBLIC_SUPABASE_URL
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY

/** True when .env.local has the project URL and publishable key. Without them the app runs on-device only. */
export const backendConfigured = !!(url && key)

export const supabase = createClient(url ?? 'http://localhost', key ?? 'missing', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Refresh the session only while the app is in the foreground (Supabase's guidance for React Native).
AppState.addEventListener('change', (state) => {
  if (!backendConfigured) return
  if (state === 'active') supabase.auth.startAutoRefresh()
  else supabase.auth.stopAutoRefresh()
})
