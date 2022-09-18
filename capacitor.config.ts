import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'angular-to-ionic',
  webDir: 'dist/angular-to-ionic',
  bundledWebRuntime: false,
  server: {
    url: 'http://192.168.1.100:4200',
    cleartext: true
  },
};

export default config;
