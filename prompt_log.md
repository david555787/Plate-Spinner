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