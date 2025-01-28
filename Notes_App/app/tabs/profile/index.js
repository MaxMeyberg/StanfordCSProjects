import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import db from "@/database/db";
import useSession from "@/utils/useSession";

export default function Profile() {
  const session = useSession();
  const router = useRouter();

  const signOut = async () => {
    try {
      const { error } = await db.auth.signOut();
      if (error) {
        Alert.alert(error.message);
      } else {
        router.navigate("/");
        Alert.alert("Sign out successful.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Welcome, {session?.user?.email || "User"}!</Text>
      <TouchableOpacity onPress={() => signOut()}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7", padding: 20 },
  buttonText: { color: "blue", marginTop: 20, fontSize: 16 },
});
