# MarketplaceApp

A simple marketplace mobile application built with Expo, React Native, TypeScript, expo-router, and Redux Toolkit + redux-saga. The goal of this README is to let a new developer clone the repo and run the app quickly in development.

## Requirements

- Node.js 18+ (LTS recommended)
- npm or yarn
- macOS with Xcode (for iOS simulator) — optional if only targeting Android
- Android Studio with an Android Virtual Device (for Android emulator)
- A physical device with Expo Go (optional)

No environment variables are required.

## Development Conditions

- Development was performed on macOS 13.7.5 (22H527).
- Node.js v22.14.0 was used.
- Android Studio Ladybug | 2024.2.1 with an Android emulator: Medium Phone (API 36).
- Android emulator was used during development. Due to technical reasons, iOS devices/simulators were not available, so iOS was not tested.
- npm was used to run all commands. In theory, yarn should work as well.
- No system issues were encountered. No additional constraints beyond those noted above.

## Getting Started

- **Clone the repository**

  ```bash
  git clone https://github.com/NoKiMa/MarketplaceApp.git
  cd MarketplaceApp
  ```

- **Install dependencies (choose one)**

  ```bash
  npm install
  # or
  yarn
  ```

## Running (Development)

- **Start the Metro bundler**

  ```bash
  npm start
  # or
  yarn start
  ```

- **Open on iOS simulator** (requires Xcode):

  ```bash
  npm run ios
  # or
  yarn ios
  ```

- **Open on Android emulator** (requires Android Studio):

  ```bash
  npm run android
  # or
  yarn android
  ```

- **Open on a physical device** using Expo Go:
  - Scan the QR code shown in the terminal/Expo DevTools.

## Scripts

- Start: `npm start` | `yarn start`
- iOS: `npm run ios` | `yarn ios`
- Android: `npm run android` | `yarn android`
- Lint: `npm run lint` | `yarn lint`
- Tests: `npm test` | `yarn test`
- Watch tests: `npm run test:watch`
- Coverage: `npm run test:coverage`

## Testing

The project uses Jest and @testing-library/react-native for unit/integration tests.

```bash
npm test
# or
yarn test
```

Additional scripts:

```bash
npm run test:watch
npm run test:coverage
```

## Linting

ESLint is configured via `eslint-config-expo`.

```bash
npm run lint
# or
yarn lint
```

## Project Structure

- `app/` — file-based routing using expo-router (`_layout.tsx`, screens)
- `src/`
  - `presentation/` — Redux store, slices, sagas, UI components
  - `domain/` — models, use cases
  - `data/` — repositories, API-related code
  - `contexts/` — React contexts
  - `__tests__/` — tests
- `assets/` — images, icons, splash assets
- `app.json` — Expo app configuration
- `babel.config.js`, `tsconfig.json`, `jest.config.js` — tooling configs

## Tech Stack

- Expo SDK 54, React Native 0.81, React 19
- expo-router (file-based navigation)
- Redux Toolkit + redux-saga
- TypeScript, ESLint
- styled-components
- Testing: Jest + Testing Library

## Production Build (brief)

For production builds, use EAS Build (recommended by Expo). You will need an Expo account and to configure credentials in your Expo project.

- Docs: https://docs.expo.dev/build/introduction/
- Example commands:

  ```bash
  # configure if needed
  npx expo prebuild   # only if you move to the prebuild workflow

  # build for iOS or Android in the cloud
  npx expo build:ios     # or use EAS: npx eas build --platform ios
  npx expo build:android # or use EAS: npx eas build --platform android
  ```

Note: This project is primarily intended for development mode; production steps are provided at a high level only.

## Troubleshooting

- Clear Expo cache if something looks stuck:

  ```bash
  npx expo start -c
  ```

- Ensure Xcode/Android Studio and their simulators/emulators are installed and updated.
- If emulator/simulator does not connect, try restarting Metro, the simulator/emulator, and your device.

## License

MIT
