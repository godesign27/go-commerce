import { requestRecordingPermissionsAsync, getRecordingPermissionsAsync } from 'expo-audio'
import { Camera } from 'expo-camera'
import { useEffect, useRef } from 'react'
import { AppState, Linking } from 'react-native'
import type { PermissionResponse } from 'expo'
import type { Perm } from './model'
import { useStore } from './store'
import { announce } from './ui/feedback'

const toPerm = (r: PermissionResponse): Perm => (r.granted ? 'granted' : r.status === 'undetermined' ? 'unasked' : 'denied')

export const requestCamera = async () => toPerm(await Camera.requestCameraPermissionsAsync())
export const requestMic = async () => toPerm(await requestRecordingPermissionsAsync())
export const openSettings = () => Linking.openSettings()

/** Reads permissions on launch and whenever the app comes back to the front, so access turned on in Settings is picked up without a restart (S-03, DD-37). */
export function usePermissionSync() {
  const { s, set } = useStore()
  const last = useRef({ cam: s.cam, mic: s.mic })
  last.current = { cam: s.cam, mic: s.mic }
  useEffect(() => {
    const read = async () => {
      const [c, m] = await Promise.all([Camera.getCameraPermissionsAsync(), getRecordingPermissionsAsync()])
      const cam = toPerm(c)
      const mic = toPerm(m)
      if (cam === 'granted' && last.current.cam === 'denied') announce('Camera is on.')
      if (mic === 'granted' && last.current.mic === 'denied') announce('Microphone is on.')
      if (cam !== last.current.cam || mic !== last.current.mic) set({ cam, mic })
    }
    read()
    const sub = AppState.addEventListener('change', (st) => st === 'active' && read())
    return () => sub.remove()
  }, [set])
}
