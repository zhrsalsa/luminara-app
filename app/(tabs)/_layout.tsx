import React from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, Tabs, Stack } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: string;
  color: string;
  type: 'Entypo' | 'FontAwesome' | 'MaterialCommunityIcons';
  size?: number;
}) {
  const { name, color, type, size = 25 } = props;

  if (type === 'Entypo') {
    return <Entypo name={name as React.ComponentProps<typeof Entypo>['name']} size={size} color={color} />;
  }

  if (type === 'FontAwesome') {
    return <FontAwesome name={name as React.ComponentProps<typeof FontAwesome>['name']} size={size} color={color} />;
  }

  if (type === 'MaterialCommunityIcons') {
    return (
      <MaterialCommunityIcons
        name={name as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
        size={size}
        color={color}
      />
    );
  }

  return null;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName='index'
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} type="Entypo" />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="user-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      
      <Tabs.Screen
        name="three"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} type="FontAwesome" />,
        }}
      />
    </Tabs>
  );
}
