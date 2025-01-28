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
                  source={require('@/assets/images/giphy.gif')}  
                  style={{width: 30, height: 30 }}
              />
              <Text style={styles.headerText}>NoteApp</Text>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="details"
        options={{
          headerTitleAlign: "center",
          headerTitle: () => (
            <Text style={styles.commentsHeaderText}>Comments</Text>
          ),
        }}
      />
      <Stack.Screen
        name="newpost"
        options={{
          headerShown: false,
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
    color: "black"
  },
  commentsHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
