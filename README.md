# Plate Spinner

Plate Spinner helps you decide where to eat. Spin the wheel to pick a restaurant from your list, then save the pick as breakfast, lunch, or dinner. You can also log what you ate by hand. The app runs on iOS, Android, and the web and stores your restaurants and meal history locally.

## Using the app

- **Spin** — The wheel starts with four sample restaurants. Tap **Spin** to pick one at random. Each restaurant has an equal chance. If you go there for lunch, tap **Log as Lunch** to save the pick to today’s history.
- **Restaurants** — Use **Add** and **Delete** to manage up to 12 restaurants. The wheel needs at least two to spin. Past meal entries keep the restaurant’s name even after you remove it from the wheel.
- **History** — Browse meals by date, newest first, or add an entry yourself. To log last night’s dinner, tap **Previous Day**, choose **Dinner**, enter what you ate, and tap **Save**. You can delete individual entries here.

## Run locally

The project uses Expo SDK 58 and npm. With Node.js 24 LTS (24.3.0 or later in the 24.x series), run these commands from the project root to install the locked dependencies and start the development server.

```sh
npm ci
npx expo start --go
```

To try the app on a phone, install a version of Expo Go that supports SDK 58 and connect the phone and computer to the same Wi-Fi network.

- **Android** — Scan the QR code in the terminal with Expo Go.
- **iPhone** — Run `npx expo login` on your computer, sign in to the same account in Expo Go, then scan the QR code with the Camera app. [Expo device setup guide](https://docs.expo.dev/get-started/start-developing/)

For a browser preview, press `w` in the terminal. If you have a simulator or emulator configured, press `i` for iOS or `a` for Android.

## Development

The app uses TypeScript and Expo Router. The three screens live in [src/app/](src/app/). The [wheel component](src/components/restaurant-wheel.tsx) draws the slices with `react-native-svg`. The [data layer](src/data/) defines restaurants and meal entries and persists them with AsyncStorage. See the [project specification](SPEC.md) for detailed behavior.

Add dependencies with `npx expo install <package>`. Run the linter and type checker before committing changes.

```sh
npm run lint
npx tsc --noEmit
```
