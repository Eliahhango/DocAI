# DocAI Mobile App

React Native mobile application for DocAI using Expo.

## Setup

1. Install dependencies:
```bash
cd mobile-app
npm install
```

2. Install Expo CLI globally:
```bash
npm install -g expo-cli
```

3. Start the development server:
```bash
npm start
```

4. Run on iOS:
```bash
npm run ios
```

5. Run on Android:
```bash
npm run android
```

## Configuration

Update API endpoints in:
- `src/screens/DocumentsScreen.tsx`
- `src/screens/GenerateScreen.tsx`
- `src/screens/LoginScreen.tsx`
- `src/screens/DocumentDetailScreen.tsx`

Replace `http://localhost:3000` with your production API URL and add proper authentication tokens.

## Features

- Document generation
- Document viewing
- User authentication
- Settings management

## Building for Production

```bash
expo build:ios
expo build:android
```
