import React from "react";
import { View, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import Theme from "@/assets/theme";

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Theme.colors.iconPrimary,
          tabBarInactiveTintColor: Theme.colors.iconSecondary,
          tabBarStyle: {
            backgroundColor: Theme.colors.backgroundPrimary,
          },
          headerStyle: {
            backgroundColor: Theme.colors.backgroundPrimary,
          },
        }}
      >
        <Tabs.Screen
          name="feed"
          options={{
            title: "Feed",
            tabBarIcon: ({ size, color }) => (
              <FontAwesome size={size} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="folders"
          options={{
            title: "AIBot",
            tabBarIcon: ({ size, color }) => (
              <FontAwesome size={size} name="search" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ size, color }) => (
              <FontAwesome size={size} name="user" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundPrimary,
  },
});
