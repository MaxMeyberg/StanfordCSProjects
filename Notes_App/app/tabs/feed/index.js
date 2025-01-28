import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Button,
  Alert,
  Confirm,
  Share,
} from "react-native";

import { useRouter } from "expo-router";

import Theme from "@/assets/theme";
import db from "@/database/db";
import useSession from "@/utils/useSession";

export default function Profile() {
  const session = useSession();
  const router = useRouter();

  const [folders, setFolders] = useState([]); // State for folders
  const [selectedFolder, setSelectedFolder] = useState(null); // Selected folder
  const [notes, setNotes] = useState([]); // State for notes
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility for notes
  const [title, setTitle] = useState(""); // Note title
  const [content, setContent] = useState(""); // Note content
  const [selectedNote, setSelectedNote] = useState(null); // Note selected for editing
  const [folderModalVisible, setFolderModalVisible] = useState(false); // Folder modal visibility
  const [newFolderName, setNewFolderName] = useState(""); // New folder name

  // Signout Page
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

  // Fetch folders from the database
  const fetchFolders = async () => {
    if (!session?.user?.id) {
      console.error("Session user is null or undefined.");
      return;
    }
    try {
      const { data, error } = await db
        .from("folders")
        .select("*")
        .eq("user_id", session.user.id);
  
      if (error) {
        console.error("Error fetching folders:", error.message);
        Alert.alert("Error", "Failed to load folders.");
        return;
      }
  
      setFolders(data || []);
    } catch (err) {
      console.error("Unexpected Error:", err);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };
  

  // Fetch notes from the database
  const fetchNotes = async () => {
    if (!session?.user?.id) {
      console.error("Session user is null or undefined.");
      return;
    }
    try {
      let query = db.from("notes").select("*").eq("user_id", session.user.id);
  
      // If a folder is selected, fetch notes only for that folder
      if (selectedFolder) {
        query = query.eq("folder_id", selectedFolder.id);
      }
  
      const { data, error } = await query;
  
      if (error) {
        console.error("Error fetching notes:", error.message);
        Alert.alert("Error", "Failed to load notes.");
        return;
      }
  
      setNotes(data || []);
    } catch (err) {
      console.error("Unexpected Error:", err);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };
  

  // Add a new folder and refresh the folder list
  const handleAddFolder = async () => {
    if (!newFolderName.trim()) {
      Alert.alert("Error", "Folder name cannot be empty.");
      return;
    }

    try {
      const { data, error } = await db.from("folders").insert({
        name: newFolderName,
        user_id: session.user.id,
      });

      if (error) {
        console.error("Error adding folder:", error.message);
        Alert.alert("Error", "Failed to add folder.");
        return;
      }

      setNewFolderName("");
      setFolderModalVisible(false);

      // Refresh folder list after adding a new folder
      await fetchFolders();
    } catch (err) {
      console.error("Unexpected Error:", err);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  // Add or update a note
  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Error", "All fields must be filled.");
      return;
    }

    try {
      // debug trick

      const noteToSave = {
        id: selectedNote ? selectedNote?.id : undefined,
        title,
        content,
        folder_id: selectedFolder ? selectedFolder.id : undefined, // Save to selected folder or no folder
        user_id: session.user.id,
      };

      const { data, error } = await db
        .from("notes")
        .upsert(noteToSave)
        .select();

      if (error) {
        console.error("Database Upsert Error:", error.message);
        Alert.alert("Error", "Failed to save the note.");
        return;
      }

      if (!selectedNote && data?.length > 0) {
        setNotes([...notes, data[0]]);
      } else {
        const updatedNotes = notes.map((note) =>
          note.id === selectedNote.id ? { ...note, title, content } : note
        );
        setNotes(updatedNotes);
      }

      setTitle("");
      setContent("");
      setSelectedNote(null);
      setModalVisible(false);
    } catch (err) {
      setTitle("");
      setContent("");
      setSelectedNote(null);
      setModalVisible(false);
      console.error("Upsert Error:", err);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  // Edit a note
  const handleEditNote = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setModalVisible(true);
  };

  const handleShareNote = async () => {
    if (selectedNote) {
      try {
        await Share.share({
          message: `${selectedNote.title}\n\n${selectedNote.content}`,
        });
      } catch (error) {
        console.error("Error sharing note:", error.message);
        Alert.alert("Error", "Failed to share the note.");
      }
    }
  };

  // Delete a note
  const NotehandleDelete = async (note) => {
    try {
      const { error } = await db.from("notes").delete().eq("id", note.id);

      if (error) {
        console.error("Error deleting note:", error.message);
        Alert.alert("Error", "Failed to delete the note.");
        return;
      }
      setNotes(notes.filter((item) => item.id !== note.id));
      setSelectedNote(null);
      setModalVisible(false);
    } catch (err) {
      console.error("Unexpected Delete Error:", err);
      Alert.alert("Error", "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchFolders();
      fetchNotes();
    }
  }, [session]);

  useEffect(() => {
    if (session?.user) {
      fetchFolders();
      fetchNotes();
    }
  }, [session]);
  
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={() => signOut()}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity> */}

      <Text style={styles.title}>Folders</Text>
      <ScrollView style={styles.folderContainer}>
        <TouchableOpacity
          style={[
            styles.folderButton,
            !selectedFolder && styles.selectedFolder,
          ]}
          onPress={() => setSelectedFolder(null)}
        >
          <Text style={styles.folderButtonText}>All Notes</Text>
        </TouchableOpacity>
        {folders.map((folder) => (
          <TouchableOpacity
            key={folder.id}
            style={[
              styles.folderButton,
              selectedFolder?.id === folder.id && styles.selectedFolder,
            ]}
            onPress={() => setSelectedFolder(folder)}
          >
            <Text style={styles.folderButtonText}>{folder.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addFolderButton}
        onPress={() => setFolderModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Folder</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Notes</Text>
      <ScrollView style={styles.notesContainer}>
        {notes.map((note) => (
          <TouchableOpacity
            key={note.id}
            style={styles.noteCard}
            onPress={() => handleEditNote(note)}
          >
            <View style={styles.NoteHeader}>
              <Text style={styles.noteTitle}>{note.title}</Text>
              {/* This is the delete button */}
              <TouchableOpacity
                style={styles.deleteNote} // WORKZONE!!!
                onPress={() =>
                  Alert.alert("Confirmation", "Do you want to proceed?", [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                    },
                    { text: "OK", onPress: () => NotehandleDelete(note) },
                  ])
                }
              >
                <Text style={styles.addButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>

            {/* <Text style={styles.noteContent}>{note.content}</Text> */}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addNoteButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Note</Text>
      </TouchableOpacity>

      {/* Folder Modal */}
      <Modal
        visible={folderModalVisible}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.addNoteTitle}> {"New Folder"}</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter folder name"
            value={newFolderName}
            onChangeText={setNewFolderName}
          />
          <View style={styles.buttonContainer}>
            <Button
              title="Add Folder"
              onPress={handleAddFolder}
              color="#007BFF"
            />
            <Button
              title="Cancel"
              onPress={() => setFolderModalVisible(false)}
              color="#FF3B30"
            />
          </View>
        </View>
      </Modal>
      {/* This needs 2 modals, we only have 1 */}
      {/* Note Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <Text style={styles.addNoteTitle}> {"New Note"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter note title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.contentInput}
            multiline
            placeholder="Enter note content"
            value={content}
            onChangeText={setContent}
          />
          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={handleSaveNote} color="#007BFF" />
            <Button title="Share" onPress={handleShareNote} color="#28A745" />

            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              color="#FF3B30"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7", padding: 20 },
  title: { fontSize: 18, fontWeight: "bold", marginVertical: 10 },
  folderContainer: { marginBottom: 20 },
  folderButton: { padding: 10, marginVertical: 5, backgroundColor: "#ddd" },
  selectedFolder: { backgroundColor: "#007BFF", color: "white" },
  folderButtonText: { fontSize: 16 },
  addFolderButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  notesContainer: { marginVertical: 10 },
  noteCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  noteTitle: { fontSize: 16, fontWeight: "bold" },
  noteContent: { fontSize: 14, color: "#666" },
  addNoteButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  modalContainer: { paddingTop: 100, padding: 10, flex: 1 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, marginBottom: 15 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-around" },
  addNoteTitle: { fontSize: 32, color: "black", fontWeight: "bold" },
  deleteNote: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },

  NoteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
