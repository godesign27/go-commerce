# Listly

The Expo start screen previews the shared GO Mobile Design System. It follows system appearance and provides a button counter to demonstrate enabled and disabled states.

From the Listly folder, run `npm ci` and `npm start`. Use `npm run web` for the browser or `npm run ios` on a Mac with an iOS simulator set up.

```sh
npm run validate
npm run typecheck
npm run bundle:ios
```

## iOS acceptance

- Switch system appearance with the app open. The background, card, button, and status bar should update and retain the counter value.
- Activate the enabled button once. The counter should increment once. The disabled button should leave it unchanged.
- With VoiceOver, check the heading and the button labels, roles, and disabled state.
- At the largest accessibility text size, check that labels wrap, content scrolls, and the buttons remain at least 44 × 44 points.
