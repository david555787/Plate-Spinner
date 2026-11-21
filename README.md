# Plate Spinner

## About

Plate Spinner picks a restaurant from my list and lets me keep track of what I ate. I chose this idea because I often know which places I like and still get stuck deciding where to go for lunch.

## Screens

### Spin

Tap **Spin** to pick a restaurant at random. Each restaurant has an equal chance, and the wheel stops with the chosen restaurant under the pointer. To save the pick, tap **Log as Breakfast**, **Log as Lunch**, or **Log as Dinner**. Each spin can be logged once for the current day.

### Restaurants

The list starts with four sample restaurants. Add your favorite places or delete ones you no longer visit. The list holds up to 12 restaurants, and the wheel needs at least two to spin. Past meal entries keep the restaurant’s name even after you remove it from the list.

### History

Meals appear by date, newest first, with breakfast, lunch, and dinner grouped under each day. You can also enter a meal by hand. For example, to log last night’s dinner, tap **Previous Day**, choose **Dinner**, type what you ate, and tap **Save**. Use **Delete** to remove an individual entry.

## Setup and Run

Plate Spinner uses Expo SDK 58.0.26 with Expo Router and TypeScript. Use Node.js 22.13 or newer (I used v26.8.2). I tested on my own iPhone with Expo Go for SDK 58.

1. Open a terminal at the root of your existing clone and run `npm install` to install the project's dependencies.
2. Run `npx expo login` on your computer and sign in to the same Expo account in Expo Go on your iPhone.
3. Start the development server with `npx expo start`.
4. Connect your iPhone and computer to the same Wi-Fi network. Scan the terminal's QR code with the iPhone Camera app and tap the link to open Plate Spinner in Expo Go.

If the phone cannot connect over Wi-Fi, restart the server with `npx expo start --tunnel` and scan the new QR code.

To add a new package, run `npx expo install <package>` from the project root.

Data (restaurants and meal history) is stored locally on the device with AsyncStorage.

## Something That Surprised Me

I thought a ten-character limit would be enough to keep a restaurant name inside its slice. With 12 restaurants on the wheel, ten lowercase m’s can spill over the edge even when ten lowercase i’s fit easily. That’s why the wheel now scales each label to fit the space inside its slice.

## Response to the AI Review

[REVIEW.md](REVIEW.md) is the unedited output of a second Codex session.

**Fixed:** Finding 20 (wheel labels overflowing slices), 27 (History button spacing), 28 and 29 (README setup instructions).

**Not fixed, and why:**

- **Finding 10** — If deleting a restaurant takes long enough, I can still tap a meal button and log the old result before the deletion finishes. I expect that window to be short on my phone, and the wheel updates as soon as the deletion is saved.
- **Finding 21** — Edits can overwrite each other when two browser tabs have the app open at once. On my iPhone, I use a single instance of the app, so there’s no second tab writing to the same list.
- **Finding 22** — If the saved JSON for either list is damaged, the app also blocks access to the other list. The app writes valid JSON during normal use, so I deferred recovery from cases such as a manual storage edit or an interrupted write.
- **Finding 23** — The Restaurants form already rejects duplicate names and a thirteenth restaurant. Since a user can’t create either case through the app, I left the startup checks as they are.
- **Finding 24** — History can lose an unsaved entry if the window crosses the 780-point layout breakpoint. This can happen in a resizable window. The iPhone app is locked to portrait in `app.json`, so turning the phone doesn’t trigger that layout change.
- **Finding 25** — A name with a combining accent or a multi-part emoji can be shortened in an awkward place on the wheel. The full name still appears in the restaurant list and the spin result, so I left this display issue for later.
- **Finding 26** — History renders all entries for one day together, which could slow down a day with hundreds of entries. I expect to log only a few meals a day, so I kept the simpler layout.
- **Finding 32** — Spin and History each define the save confirmation text, and both match the wording in the spec. I left the duplication in place because a refactor could introduce a wording error in a message that already works.

**I verified Findings 2, 17, and 18 on my phone.** I checked the spin timing and pointer, confirmed that my data survived closing and reopening Expo Go, and verified that an empty restaurant list stayed empty after a restart.
