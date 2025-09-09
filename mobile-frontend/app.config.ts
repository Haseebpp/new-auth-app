import type { ConfigContext, ExpoConfig } from 'expo/config';
import * as dotenv from 'dotenv';

// Load env from mobile-frontend/.env and also fallback to monorepo root ../.env
dotenv.config();
dotenv.config({ path: '../.env' });

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'mobile-frontend',
  slug: 'mobile-frontend',
  scheme: 'mobilefrontend',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  icon: './assets/images/icon.png',
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    edgeToEdgeEnabled: true,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: ['expo-router'],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    // Access via: Constants.expoConfig?.extra?.API_URL
    // Priority: MOBILE_API_URL > API_URL > VITE_API_URL (from web)
    API_URL:
      process.env.MOBILE_API_URL ||
      process.env.API_URL ||
      process.env.VITE_API_URL ||
      'http://10.0.2.2:5000/api',
    ENV: process.env.NODE_ENV ?? 'development',
  },
});
