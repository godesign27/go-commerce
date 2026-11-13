# GO Mobile Design System

- Check `contracts/components.json` for supported components, props, states, and usage before composing a screen.
- Import components from `@go-commerce/mobile-design-system` and load its config once at the Expo app root.
- Use semantic theme roles for colors and shared tokens for geometry. Check new theme roles in light and dark mode.
- Keep product copy, navigation, and business logic in the consuming app. Pass callbacks and content through the documented props.
- Update the contract alongside public component changes and run the package validation commands.
- Use the supplied `skills/tamagui-theme-generator/SKILL.md` for palette previews. Its Emerald Cyber input is copied to `src/themes/emerald-cyber.json`.
