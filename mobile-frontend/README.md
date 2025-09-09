# Mobile Frontend (Expo + React Native)

A clean, scalable mobile app scaffold built with Expo (SDK 53), React Native, and Expo Router. It’s intentionally minimal but structured for growth and maintainability.

## Quick Start

- Copy `.env.example` to `.env` and adjust values.
- Install deps: `npm install`
- Run the app: `npm run start` (or `npm run android` / `npm run ios` / `npm run web`)

## Project Structure

- `app/`: Route-based screens using Expo Router (+ tabs).
- `components/`: Reusable UI components and hooks.
- `constants/`: Theme and constants.
- `services/`: API clients and integrations (e.g., `services/api/client.ts`).
- `store/`: Global state with Zustand (persisted via AsyncStorage).
- `types/`: Shared TypeScript definitions.
- `assets/`: Images, fonts, icons.

## Environment Config

Configuration comes from `app.config.ts` and `.env` (via `dotenv`). Values are injected into `expoConfig.extra` and read with `expo-constants`:

```ts
import Constants from 'expo-constants';
const API_URL = (Constants.expoConfig?.extra as any)?.API_URL;
```

Default fallback for `API_URL` is `http://10.0.2.2:3000` to work with Android emulators.

## State & API

- Global auth state lives in `store/useAuthStore.ts` (Zustand + persist).
- Axios client at `services/api/client.ts` attaches the auth token automatically.

## Scripts

- `start` / `android` / `ios` / `web`: Run the app.
- `typecheck`: TypeScript project check.
- `format`: Prettier formatting.

## Next Steps

- Add feature folders under `features/` (e.g., `features/orders/`).
- Introduce a UI kit (React Native Paper, NativeWind, or Restyle).
- Add authentication screens and deep linking.
- Add E2E tests (Detox) and unit tests as needed.
- Wire analytics and error tracking when ready.

