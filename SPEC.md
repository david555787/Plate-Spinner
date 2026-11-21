# Plate Spinner

## 1. Overview

Plate Spinner helps me decide where to eat when I cannot choose a restaurant. I can spin a wheel to pick a place from my list, then save the result or type in what I ate for breakfast, lunch, or dinner.

## 2. Technical Requirements

- Use the project's existing Expo SDK 58 (`expo` is declared as `~58.0.26` in `package.json`), Expo Router, and TypeScript.
- Draw the wheel with `react-native-svg` and animate its rotation with React Native's built-in `Animated` API.
- Install dependencies with `npx expo install`. Do not use `npm install`.
- Store data locally with `@react-native-async-storage/async-storage`.
- Configure the three native bottom tabs in `src/components/app-tabs.tsx`. The root layout in `src/app/_layout.tsx` renders `<AppTabs />`.
- Give each tab a visible text label and a simple, easy-to-distinguish icon. The specific icon design is left to the implementation.
- Set `expo.name` in `app.json` to `Plate Spinner`.
- Follow the phone's system appearance setting. All three screens must support light and dark mode.

| Tab | Screen file | Purpose |
| --- | --- | --- |
| Spin | `src/app/index.tsx` | Pick a restaurant and log the result |
| Restaurants | `src/app/explore.tsx` | Add and delete restaurants |
| History | `src/app/history.tsx` | Review, add, and delete meal entries |

## 3. Data and Storage

| Record | Fields |
| --- | --- |
| Restaurant | `id` (unique string), `name` (string) |
| Meal entry | `id` (unique string), `date` (local `YYYY-MM-DD`), `meal` (`breakfast`, `lunch`, or `dinner`), `food` (string) |

| AsyncStorage key | Initial contents |
| --- | --- |
| `plateSpinner.restaurants` | Four restaurants in this order: `Campus Cafe`, `Noodle House`, `Pizza Corner`, `Rice Bowl` |
| `plateSpinner.meals` | An empty array |

Store each list as a JSON array. Initialize a list only when its key is missing. Save every addition and deletion, including an empty list after the last item is deleted.

Logging a spin copies the restaurant's full name into the meal entry's `food` field. Each entry keeps that text even if the restaurant is later deleted.

## 4. Screens

### 4.1 Spin

- Draw one equal slice per restaurant, in list order, with its name inside the slice. Place a fixed pointer at the top of the wheel.
- When the user taps **Spin**, first select a restaurant at random. Each restaurant has an equal chance of being selected. Calculate the final angle from the wheel's current rotation so the center of the selected slice stops under the pointer.
- Rotate the wheel at least three full turns over approximately three seconds, gradually slowing to a stop. Hide the previous result, logging buttons, and save confirmation as soon as a new spin starts.
- When the wheel stops, show the restaurant's full name below it with three buttons: **Log as Breakfast**, **Log as Lunch**, and **Log as Dinner**.
- The first tap on a logging button saves one entry for the phone's local date at the time of the tap. Disable all three logging buttons immediately. After saving, show `Saved to Breakfast.`, `Saved to Lunch.`, or `Saved to Dinner.`
- Each completed spin can be logged once. A later spin that selects the same restaurant can be logged as a separate entry.

### 4.2 Restaurants

- Show a restaurant name field, an **Add** button, and the restaurants in insertion order. Give each restaurant a **Delete** button.
- On a valid addition, trim the name, append it to the list, and clear the field. On invalid input, show the applicable message from Section 5 and keep the list unchanged.
- Delete a restaurant immediately when the user taps **Delete**, without a confirmation dialog.
- After a successful addition or deletion, update the wheel and clear the previous result, logging buttons, and save confirmation. If a spin is in progress, cancel it. A canceled spin must never display a winner.

### 4.3 History

- Group entries by local date, newest first. Show a date group only if it contains at least one entry.
- Within each date group, show **Breakfast**, **Lunch**, and **Dinner** in that order. Display `No entries.` under an empty meal. For a meal with multiple entries, list them in the order they were saved.
- The manual form opens with today's local date, **Breakfast** selected, and an empty food field. Display the selected date as `YYYY-MM-DD`.
- **Previous Day** moves back one calendar day. **Next Day** moves forward one calendar day and is disabled when the selected date is today.
- On **Save**, trim the food text. If it is empty, show `Enter what you ate.` and keep the form open. Otherwise, append one entry using the displayed date and selected meal.
- After a successful save, clear the food field, keep the selected date and meal, and show the same meal-specific confirmation used on the Spin screen.
- Each entry has a **Delete** button. Delete only that entry, without a confirmation dialog. Remove the date group when its last entry is deleted.
- When the entire history is empty, show `No meals logged yet.` and keep the manual form available.

## 5. Edge Cases

| Condition | Required behavior |
| --- | --- |
| 0 restaurants | Show no slices. Disable **Spin** and display `Add at least 2 restaurants to spin.` |
| 1 restaurant | Show one labeled circle. Keep **Spin** disabled and display the same message. |
| 12 restaurants | Show all 12 on the wheel. Reject an attempt to add a 13th with `You can save up to 12 restaurants.` |
| Empty or whitespace-only restaurant name | Reject it with `Enter a restaurant name.` |
| Duplicate restaurant name | Compare trimmed names without case sensitivity. If `Rice Bowl` exists, reject ` rice bowl ` with `That restaurant is already on your list.` |
| Spin in progress | Disable **Spin** immediately. Further taps cannot start another animation. |
| Restaurant name longer than 10 characters | On the wheel, show the first 9 characters followed by `…`. Use the full name in Restaurants, the spin result, and History. |
| Same date and meal already have an entry | Append the new entry with its own ID. Entries with identical food text are allowed. |
| A logged restaurant is deleted | Remove it from Restaurants and Spin. Preserve its existing meal entries. |

## 6. Visual Requirements

Use the system theme consistently across screen backgrounds, inputs, lists, buttons, the wheel, and the tab bar.

| Element | Light mode | Dark mode |
| --- | --- | --- |
| Screen background | Warm cream `#FFF8EE` | Deep charcoal `#1C1B19` |
| Inputs and list surfaces | Warm white `#FFFCF7` | Raised charcoal `#302E2B` |
| Main text and fixed pointer | Dark brown `#30251F` | Warm ivory `#FFF4E5` |
| Primary button | Terracotta `#93442F` with white text | Light terracotta `#F0A88B` with dark brown text |
| Wheel slices | Alternate pale terracotta `#F1B59D` and pale sage `#BCD2B0`, with dark brown labels | Alternate deep terracotta `#754335` and deep sage `#405940`, with warm ivory labels |

- Give each slice a thin contrasting border so its boundaries remain visible with an odd number of restaurants. Keep labels inside their slices and the pointer visible against the wheel. If the pointer overlaps a slice, give it a contrasting outline.
- Use a readable system font and at least 16 pt for form inputs, list entries, and primary button labels. Use 16 pt horizontal screen padding and 8 pt spacing between related controls.
- In both themes, keep tab labels, icons, input placeholders, validation errors, and save confirmations readable. Disabled controls should look muted while their labels remain legible.

## 7. Acceptance Criteria

Unless a check specifies a different setup, start with the four default restaurants and an empty History.

1. **First launch.** Open the app for the first time → Spin shows four labeled 90-degree slices and one fixed pointer. Restaurants lists the four default names in the order given in Section 3.
2. **Spin and pointer.** Tap **Spin** once → the wheel makes at least three full turns, slows down, and stops within 2.5–3.5 seconds. The full name below the wheel identifies the slice centered under the pointer.
3. **Start another spin.** Finish one spin, tap **Spin** again, and try tapping it twice more during the animation → the old result and its three logging buttons disappear immediately. **Spin** remains disabled during the animation, and exactly one new result appears when it ends.
4. **Too few restaurants.** Delete three of the four restaurants → one labeled circle remains, **Spin** is disabled, and `Add at least 2 restaurants to spin.` appears. Delete the last restaurant → zero slices remain and the message stays visible.
5. **Add and synchronize.** Enter `  Sushi Spot  ` and tap **Add** → `Sushi Spot` appears fifth in Restaurants and the field clears. Switch to Spin → the wheel already shows five equal slices, including `Sushi Spot`.
6. **Reject invalid names.** Try adding an empty name, three spaces, and ` rice bowl ` → the first two attempts show `Enter a restaurant name.` The third shows `That restaurant is already on your list.` The restaurant count stays at four.
7. **Enforce the limit.** Add eight distinct restaurants, then try adding one more → the 13th addition shows `You can save up to 12 restaurants.` Restaurants and Spin each show exactly 12 choices.
8. **Check long names in one spin.** Set up exactly two restaurants, `Mediterranean Kitchen` and `Blueberry Bakery` → Restaurants shows both full names, and the two wheel labels read `Mediterra…` and `Blueberry…`. Spin once and tap **Log as Lunch** → whichever restaurant wins, its full name appears below the wheel and in History.
9. **Edit after a spin.** Finish one spin, add one restaurant, and return to Spin → five slices appear and the old result and logging buttons are gone. Finish another spin and delete one restaurant → deletion takes one tap with no dialog, the wheel returns to four slices, and the result clears again.
10. **Cancel a spin after a list change.** Open Restaurants and locate a **Delete** button before starting. Switch to Spin, tap **Spin**, then switch back to Restaurants and tap that **Delete** button while the wheel is still turning. If the spin finishes before deletion, start another spin and retry. After one deletion during an active spin, return to Spin and wait four seconds → the wheel shows one fewer slice, no winner or logging buttons appear, and **Spin** is enabled as long as at least two restaurants remain.
11. **Log once per spin.** Finish one spin and rapidly tap **Log as Lunch** twice → `Saved to Lunch.` appears, all three logging buttons are disabled, and History contains exactly one Lunch entry for today's local date with the winner's full name.
12. **Manual entry and defaults.** Open History for the first time → today's date and Breakfast are selected, and **Next Day** is disabled. Enter `Soup`, select Lunch, and tap **Save** → `Saved to Lunch.` appears, the food field clears, and the date and Lunch selection stay in place. Save `Toast` → Lunch lists `Soup` first and `Toast` second.
13. **Group and sort dates.** On today's date, save `Eggs` as Breakfast. Tap **Previous Day** once and save `Pasta` as Dinner → today's group remains above yesterday's even though yesterday's entry was saved last. Both dates show Breakfast, Lunch, and Dinner in order, and the four empty meal sections each show `No entries.` Tap **Next Day** once → the form returns to today and **Next Day** becomes disabled.
14. **Reject blank food text.** Tap **Save** with an empty food field, then try again with three spaces → both attempts show `Enter what you ate.` and create zero entries.
15. **Preserve history after deletion.** Log one spin as Dinner and delete the winning restaurant → its slice disappears, and the Dinner entry still shows its full name.
16. **Delete entries and show the empty state.** With two entries under today's Lunch and no other entries, delete the first → the second remains and no dialog appears. Delete the second → the date group disappears, `No meals logged yet.` appears, and the manual form is still available.
17. **Persist after closing Expo Go.** Add a fifth restaurant and save two meal entries. Fully close Expo Go, reopen it, and open the same project → all five restaurants and both entries remain, with their original names, dates, meals, and food text.
18. **Persist an empty restaurant list.** Delete all four restaurants, fully close Expo Go, and reopen the same project → Restaurants contains zero items and **Spin** remains disabled.
19. **Navigate between tabs.** Tap Restaurants, History, and Spin in sequence → each of the three tabs opens its corresponding screen. Each tab has a visible label and an icon distinguishable from the other two.
20. **Check both themes.** With 12 restaurants on the wheel, set the phone to light mode and visit all three tabs. Repeat in dark mode → the screens use the matching palette from Section 6. In each mode, all 12 wheel labels stay inside their slices, the pointer is visible, and tab labels and form fields are readable. On History, try saving an empty entry, then save `Soup` as Lunch → both `Enter what you ate.` and `Saved to Lunch.` are readable in the active theme.

## 8. Out of Scope

Accounts and login, network services, charts and statistics, calendar date pickers, notifications, and sharing.