# Upgrade Plan

## Current state

- Before this pass: **4/10** — working Expo Router reading tracker, but CI
  masked every failure with `|| true`, `lib/` lived under `app/` (so Expo
  Router treated storage helpers as routes), no tests, storage `JSON.parse`
  could crash the app on corrupt data, a want-to-read book could never be
  started, and the stats screen duplicated (and mis-counted) aggregates.
- After this pass: **7/10** — tested pure logic, honest CI, detail screen can
  change status and rating, stats come from one tested function.

## Backlog

### P0
- Notes field: `Book.notes` exists but no screen edits it (add a notes editor
  on `/book/[id]`).

### P1
- Component tests (jest-expo + @testing-library/react-native) for add/detail.
- Edit title/author/pages after creation; custom page entry instead of only
  ±10/+50 buttons.
- Export/import library as JSON (backup; AsyncStorage is device-only).

### P2
- Upgrade Expo SDK 52 -> 53+ (clears remaining `npm audit` findings in Expo
  build tooling) and move to ESLint 9 flat config.
- Real light theme (`userInterfaceStyle: automatic` but colors are dark-only).

## Done in this pass

- Moved `app/lib/*` to top-level `lib/` so they are no longer Expo Router routes.
- `lib/books.ts`: pure logic (progress, page delta with auto-complete/resume,
  strict page parsing, form validation, stats incl. real top-author counts,
  defensive `parseStoredBooks`) with Vitest tests (`npm test`).
- Library tab: status filter chips + title/author search (`filterBooks`), no more `NaN%` progress for books without a page count.
- Add screen validates pages/rating via the lib; detail screen gains status
  switcher and tappable star rating (with accessibility roles/labels).
- `useBooks()` throws a clear error outside the provider; load errors no longer
  leave the app stuck on loading; unique ids; `dateCompleted` set on add.
- CI runs `npm ci`, lint, typecheck, tests and an Android bundle export with no
  failure masking; EAS preview build is owner-triggered; `eas.json` committed.
