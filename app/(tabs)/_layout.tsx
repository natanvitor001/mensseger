import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { MessageSquare, Users, Settings } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { display: 'none' }, // Hide the tab bar
        headerShown: false,
      }}>
      <Tabs.Screen name="chats" />
      <Tabs.Screen name="contacts" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}