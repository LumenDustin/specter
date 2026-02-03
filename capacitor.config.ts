import type { CapacitorConfig } from '@capacitor/cli'

// Set to true for development with live reload
const useDevServer = false

const config: CapacitorConfig = {
  appId: 'dev.specter.app',
  appName: 'SPECTER',
  webDir: 'out',
  server: useDevServer
    ? {
        // Development: Live reload from Next.js dev server
        // Update the IP to your local machine's IP address
        url: 'http://192.168.1.175:3000',
        cleartext: true,
      }
    : {
        // Production: Load from bundled static files
        androidScheme: 'https',
      },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#000000',
  },
  android: {
    backgroundColor: '#000000',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#000000',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000',
    },
  },
}

export default config
