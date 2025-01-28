import { Stack } from "expo-router";
import Theme from "@/assets/theme";
import { View, Image, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "white",
        },
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitleAlign: "center",

          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Image 
                  source={require('@/assets/images/open-ai-icon.png')}  
                  style={{width: 30, height: 30 }}
              />
              <Text style={styles.headerText}>Hey Look its ChatGPT</Text>
            </View>
          ),
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
    color: "black",
  },
  commentsHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
  },
});
