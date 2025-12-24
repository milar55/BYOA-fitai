import { Redirect } from 'expo-router';

export default function CameraScreen() {
  // Keep `/camera` working, but the real camera is now the `Snap` tab.
  return <Redirect href="/(tabs)/camera" />;
}


