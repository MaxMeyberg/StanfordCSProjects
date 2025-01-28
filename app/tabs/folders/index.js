import { OPENAI_API_KEY } from "@env";
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";

export default function App() {
  const [userInput, setUserInput] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    setResponseText("");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userInput }],
          max_tokens: 100,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const completion = response.data.choices[0].message.content;
      setResponseText(completion.trim());
    } catch (error) {
      console.error("Error fetching from OpenAI:", error);
      setResponseText("Error: Could not get a response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OpenAI Chat Integration</Text>
      <TextInput
        style={styles.input}
        placeholder="Ask me anything..."
        onChangeText={setUserInput}
        value={userInput}
      />
      <Button title="Send" onPress={handleSend} disabled={loading} />
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <Text style={styles.response}>{responseText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 40,
    marginBottom: 10,
    borderRadius: 4,
  },
  loading: {
    marginTop: 10,
    fontStyle: "italic",
  },
  response: {
    marginTop: 10,
  },
});
