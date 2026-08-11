# BookEverything

A personal reading tracker built with Expo Router: add books, track reading
progress page-by-page, rate what you've finished, and see a running library.
All data is local (`AsyncStorage`) — no backend.

## Screens

| Route | What it is |
|---|---|
| `/(tabs)` (Library) | Your books, grouped/filterable by status |
| `/(tabs)/stats` | Aggregate stats — total books, pages read, etc. |
| `/(tabs)/profile` | Profile tab |
| `/add` | Add a book (title, author, pages, status, rating) |
| `/book/[id]` | Book detail — progress bar with ±10/±50 page buttons, star rating, delete |

## Notes from a recent audit pass

**The app had apparently never actually been run.** `npx expo start`
failed immediately — `expo-asset`, a package Expo's own Metro config
requires unconditionally regardless of target platform, was never
installed. Fixing that surfaced a second missing package,`expo-font`,
required by `@expo/vector-icons` (used on every screen). `npx expo
install --check` then found three more dependencies out of sync with the
installed Expo SDK, the most significant being
`@react-native-async-storage/async-storage@2.2.0` against an expected
`1.23.1` — a major-version gap in the library this app's entire
persistence layer depends on. Fixed all of it (`expo install
expo-asset expo-font` + `expo install --fix`); verified by actually
bundling and serving the app (`expo start --web`) — real title, no
bundler errors. There was also no `package-lock.json` committed at all,
so even `npm install` alone was never fully reproducible before this
pass.

Also found:

- **A full, byte-identical duplicate of the entire project** nested at
  `bookreviews/` — same `app/`, same `package.json`, same every file,
  tracked in git (15 files). Almost certainly `npx create-expo-app` (or
  similar) run inside the repo instead of elsewhere. Removed.
- TypeScript had never been checked with `@types/react` installed at
  all — `strict: true` is set in `tsconfig.json`, but every file was
  silently failing with implicit-`any` errors that nobody had seen. Fixed
  by adding `@types/react` at the version Expo 52 itself declares. Once
  the noise cleared, one real bug remained underneath: the Library tab's
  icon used `Ionicons name="books"`, which isn't a valid icon name
  (`"book"` is) — TypeScript's own suggestion, once it could actually run.
- ESLint had never been configured either — `expo lint` did its
  first-run setup, which then caught one real unused import
  (`TouchableOpacity` in the profile screen).
- `app.json` references `./assets/icon.png`, but no `assets/` directory
  exists anywhere in the repo. Didn't block `expo start --web` in this
  pass, but would very likely block a real iOS/Android build (EAS Build
  requires the configured icon to exist). Not fixed — fabricating app
  icon artwork isn't something to do blind; flagging it here instead.

Cleared what `npm audit fix` could reach; the remaining findings are all
inside Expo's own build tooling (`@expo/prebuild-config` → `node-tar`,
`postcss`) and need an Expo SDK major bump to clear, not attempted here.

## Development

```bash
npm install
npm run web     # or: npm run ios / npm run android
npm run lint
```
