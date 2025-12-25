import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-6 pt-2 pb-4">
        <Text className="text-deepTeal/60 font-poppins uppercase tracking-widest text-xs">
          Account
        </Text>
        <Text className="text-deepTeal font-poppins-bold text-3xl">Profile</Text>
      </View>

      <View className="px-6 gap-y-4">
        <Card>
          <Text className="text-deepTeal/60 font-poppins uppercase tracking-widest text-xs">
            Signed in as
          </Text>
          <Text className="text-deepTeal font-poppins-bold text-lg mt-1">
            {email ?? '—'}
          </Text>
        </Card>

        <Card>
          <Button
            title="Log out"
            variant="outline"
            onPress={async () => {
              await supabase.auth.signOut();
            }}
          />
        </Card>
      </View>
    </SafeAreaView>
  );
}


