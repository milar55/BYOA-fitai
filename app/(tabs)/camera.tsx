import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text,
  Vibration,
  View,
  useWindowDimensions,
} from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuthUser } from '@/hooks/useAuthUser';
import { getFileSizeBytes } from '@/lib/image-utils';
import { uploadMealPhoto } from '@/lib/storage';

type Facing = 'front' | 'back';
type Flash = 'off' | 'on';

export default function CameraTabScreen() {
  const router = useRouter();
  const { userId } = useAuthUser();
  const [permission, requestPermission] = useCameraPermissions();
  const window = useWindowDimensions();

  const cameraRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<Facing>('back');
  const [flash, setFlash] = useState<Flash>('off');
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [lastSizeBytes, setLastSizeBytes] = useState<number | null>(null);

  const canUseCamera = permission?.granted === true;

  const toggleFacing = useCallback(() => {
    setFacing((p) => (p === 'back' ? 'front' : 'back'));
  }, []);

  const toggleFlash = useCallback(() => {
    setFlash((p) => (p === 'off' ? 'on' : 'off'));
  }, []);

  const setUriAndSize = useCallback(async (uri: string) => {
    setCapturedUri(uri);
    setUploadUrl(null);
    const size = await getFileSizeBytes(uri);
    setLastSizeBytes(size);
  }, []);

  const takePhoto = useCallback(async () => {
    if (!cameraRef.current) return;
    try {
      Vibration.vibrate(10);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7, // basic compression
        skipProcessing: false,
      });
      if (photo?.uri) {
        await setUriAndSize(photo.uri);
      }
    } catch (e: any) {
      Alert.alert('Camera error', e?.message ?? 'Failed to take photo');
    }
  }, [setUriAndSize]);

  const pickFromLibrary = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to pick a meal photo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7, // basic compression
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      await setUriAndSize(result.assets[0].uri);
    }
  }, [setUriAndSize]);

  const upload = useCallback(async () => {
    if (!userId) {
      Alert.alert('Not signed in', 'Please sign in to upload meal photos.');
      router.push('/(auth)/login');
      return;
    }
    if (!capturedUri) return;

    try {
      setUploading(true);
      const { publicUrl } = await uploadMealPhoto({ uri: capturedUri, userId });
      setUploadUrl(publicUrl);
      Vibration.vibrate(18);
      
      // Navigate to log-meal screen with the local URI and public URL
      router.push({
        pathname: '/log-meal',
        params: { 
          imageUri: capturedUri,
          imageUrl: publicUrl 
        }
      });
    } catch (e: any) {
      Alert.alert(
        'Upload failed',
        e?.message ??
          'Could not upload the photo. Confirm the `meal-photos` bucket exists in Supabase Storage.'
      );
    } finally {
      setUploading(false);
    }
  }, [capturedUri, router, userId]);

  const sizeLabel = useMemo(() => {
    if (!lastSizeBytes) return null;
    const mb = lastSizeBytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }, [lastSizeBytes]);

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center px-6">
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (!canUseCamera) {
    return (
      <SafeAreaView className="flex-1 bg-white px-6 justify-center">
        <Card>
          <Text className="text-deepTeal font-poppins-bold text-2xl">Camera access</Text>
          <Text className="text-deepTeal/60 font-inter mt-2">
            FitAI needs camera access to snap your meals for analysis.
          </Text>
          <View className="mt-4">
            <Button title="Enable Camera" onPress={requestPermission} />
          </View>
          <View className="mt-3">
            <Button title="Pick from Photos" variant="outline" onPress={pickFromLibrary} />
          </View>
        </Card>
      </SafeAreaView>
    );
  }

  return (
    <View
      className="flex-1 bg-black"
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        console.log('[DBG_CAMERA_LAYOUT] root onLayout', {
          width,
          height,
          windowW: window.width,
          windowH: window.height,
        });
      }}
    >
      <CameraView
        ref={cameraRef}
        // NativeWind `className` isn't reliably applied to `CameraView` on iOS.
        // Force full-height layout via style.
        style={{ flex: 1 }}
        className="flex-1"
        facing={facing}
        flash={flash}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          console.log('[DBG_CAMERA_LAYOUT] CameraView onLayout', { width, height, facing, flash });
        }}
      >
        {/* Top controls */}
        <SafeAreaView className="px-4 pt-2">
          <View className="flex-row items-center justify-between">
            <View className="bg-black/40 rounded-full px-4 py-2">
              <Text className="text-white font-poppins-semibold">FitAI Snap</Text>
            </View>
            <View className="flex-row gap-x-2">
              <Button
                title={flash === 'on' ? 'Flash On' : 'Flash Off'}
                variant="ghost"
                onPress={toggleFlash}
                className="bg-black/40 px-3 py-2 rounded-full"
              />
              <Button
                title="Flip"
                variant="ghost"
                onPress={toggleFacing}
                className="bg-black/40 px-3 py-2 rounded-full"
              />
            </View>
          </View>
        </SafeAreaView>

        {/* Bottom controls */}
        <View className="absolute left-0 right-0 bottom-0">
          <SafeAreaView className="px-6 pb-4">
            <View className="bg-black/40 rounded-[28px] p-4">
              <View className="flex-row items-center justify-between">
                <Button
                  title="Photos"
                  variant="outline"
                  onPress={pickFromLibrary}
                  className="px-5 py-3"
                />

                <View className="items-center">
                  <View className="w-20 h-20 rounded-full border-4 border-white/80 items-center justify-center">
                    <View className="w-16 h-16 rounded-full bg-white/95" />
                  </View>
                  <Text className="text-white/70 font-inter text-xs mt-2">
                    Tap below to capture
                  </Text>
                </View>

                <Button
                  title={capturedUri ? 'Retake' : 'Capture'}
                  onPress={capturedUri ? () => setCapturedUri(null) : takePhoto}
                  className="px-5 py-3"
                />
              </View>

              {capturedUri && (
                <View className="mt-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-white font-poppins-semibold">
                      Ready to upload
                    </Text>
                    {sizeLabel && (
                      <Text className="text-white/70 font-inter text-xs">
                        {sizeLabel}
                      </Text>
                    )}
                  </View>

                  <View className="mt-3">
                    <Button
                      title={uploading ? 'Uploading…' : uploadUrl ? 'Uploaded ✓' : 'Upload to Supabase'}
                      onPress={upload}
                      loading={uploading}
                      disabled={uploading || !!uploadUrl}
                    />
                  </View>

                  {uploadUrl && (
                    <Text className="text-white/70 font-inter text-xs mt-2">
                      Stored in bucket: meal-photos
                    </Text>
                  )}
                </View>
              )}
            </View>
          </SafeAreaView>
        </View>
      </CameraView>
    </View>
  );
}


