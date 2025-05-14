
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.cc48338183bc4f1d91b0330a0d5f2c95',
  appName: 'HealthTrack',
  webDir: 'dist',
  server: {
    url: 'https://cc483381-83bc-4f1d-91b0-330a0d5f2c95.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
    }
  }
};

export default config;
