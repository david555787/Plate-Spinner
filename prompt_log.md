# Plate Spinner Prompt Log

## 1. React Native and web pages

**Prompt**

> What's the difference between React Native and a regular website? How is a View different from a div?

**Response summary**

A `div` is an HTML container rendered by a browser. A React Native `View` serves a similar purpose on a phone, where iOS or Android draws the native interface. A `View` stacks its children vertically by default and accepts a JavaScript style object through its `style` prop. Visible text goes inside `Text`, and a tappable control can use `Pressable` with `onPress`.

## 2. How the starter project fits together

**Prompt**

> I'm brand new to React Native. Can you explain at a high level how these files create a working app?

**Response summary**

The assistant traced startup from `package.json`, which points to `expo-router/entry`, to the starter screens in `src/app/`. The root layout loads the theme and renders `AppTabs`. The tab bar connects Home to `index.tsx` and Explore to `explore.tsx`. The screens can import reusable UI from `src/components/`, shared logic from `src/hooks/`, and colors and spacing from `src/constants/theme.ts`. The project also has a separate `app-tabs.web.tsx` for the browser.

## 3. Handling text input and button presses

**Prompt topic** *(reconstructed from the response because the original question is outside the screenshot)*

How do `TextInput`, `Pressable`, and `useState` work together on a screen?

**Response summary**

The assistant showed a “Say hello” example with two state values. Typing updates `draft` through `onChangeText`. Tapping the button calls `setName(draft)`, and the greeting displays that name. For example, after submitting `Jessie`, the greeting stays `Hello, Jessie` while the user edits the input. It changes on the next tap. The same pattern applies to the Restaurants screen, where the user can type a name and tap **Add** when it is ready.

## 4. How Expo Router creates screens

**Prompt**

> This project uses Expo Router. How does a file in src/app/ become a screen, and what is _layout.tsx for?

**Response summary**

Expo Router uses a route file's path to determine its URL and its default export to determine which component appears. In the starter project, `src/app/index.tsx` maps to `/` and `src/app/explore.tsx` maps to `/explore`. The shared `_layout.tsx` stays mounted when the user switches tabs. For Plate Spinner, adding `src/app/history.tsx` creates the `/history` route. Adding a matching `history` tab in `src/components/app-tabs.tsx` makes that screen accessible from the bottom tab bar.

## 5. — Implementing and verifying Plate Spinner

**Prompt**

> Read SPEC.md in this project. Implement the full mobile app exactly as specified.
> This is an Expo project using Expo Router, so screens belong in src/app/.
> Check package.json for the exact Expo SDK version and write code for that version.
> Create all necessary files, components, and navigation. Make sure that appropriate data is persistent.
> Avoid security risks for sensitive data. Include proper error handling.
> Make sure the app starts without errors and displays the home screen correctly.

**Response summary**

The assistant reported building the Spin, Restaurants, and History tabs for Expo 58.0.26. The wheel used SVG slices and React Native’s Animated API. AsyncStorage kept restaurant names and meal entries on the device. When I checked the project folder, I found a placeholder home screen and a Stack layout, so I asked the assistant to verify the files on disk.

**Follow-up prompt**

> Your implementation is not in /Users/jessielu/Plate Spinner. In that folder, src/app contains only a placeholder index.tsx and a Stack-only _layout.tsx, and none of the screens from SPEC.md exist, and I could not find store.ts anywhere on my machine. First run pwd and tell me the exact directory you are working in. Then write the complete implementation into /Users/jessielu/Plate Spinner, and finally run ls -R src there and list every file you created or changed.

**Response summary**

`pwd` returned `/Users/jessielu/Plate Spinner`. The assistant confirmed the two placeholders, replaced them, and created 15 source files. The final `ls -R src` listing showed all three screens in `src/app/`, the tab configuration in `src/components/app-tabs.tsx`, and the storage logic in `src/data/store.ts`.

Lint, TypeScript, and the iOS, Android, and web exports passed. Browser tests showed that a spin stopped on the displayed restaurant, rapid taps logged only one meal, and saved entries survived a reload. Testing on a physical phone remained pending.
