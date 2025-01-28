import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Text, View, Image, Pressable } from 'react-native';
import useSpotifyAuth from './utils/useSpotifyAuth';  
import { getMyTopTracks } from './utils/apiOptions';
import { Themes } from './assets/Themes';
import images from './assets/Images/images.js';  
import Song from "./Song.js";  

export default function App() {
  const { token, getSpotifyAuth } = useSpotifyAuth();  
  const [tracks, setTracks] = useState(null);  

  useEffect(() => {
    if (token) {
      console.log('Fetching tracks with token:', token);  
      getMyTopTracks(token)
        .then((fetchedTracks) => {
          console.log('Tracks fetched:', fetchedTracks);  
          setTracks(fetchedTracks);  
        })
        .catch((error) => console.error('Error fetching tracks:', error));  
    }
  }, [token]);

  const renderTrack = ({ item, index }) => (
    <Song
      index={index}
      title={item.songTitle}
      artist={item.songArtists[0]?.name}
      album={item.albumName}
      imageUrl={item.imageUrl}
      duration={item.duration}
    />
  );

  const SpotifyAuthButton = () => (
    <Pressable onPress={() => getSpotifyAuth()} style={styles.button}>
      <Image source={images.spotify} style={styles.logo} />
      <Text style={styles.buttonText}>Connect with Spotify</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {token && ( // Render header only if the token exists
        <View style={styles.header}>
          <Image source={images.spotify} style={styles.headerLogo} />
          <Text style={styles.headerText}>My Top Tracks</Text>
        </View>
      )}
      {!token ? ( // Only show the button when there is no token
        <SpotifyAuthButton />
      ) : (
        <FlatList
          style={styles.songList}
          data={tracks}
          renderItem={renderTrack}
          keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Themes.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 10, // Adjusted padding for a better fit
    borderRadius: 25,
    width: 200, // Set a fixed width for the button
    height: 50, // Set a fixed height for the button
  },
  logo: {
    width: 20, // Adjusted width for the logo
    height: 20, // Adjusted height for the logo
    marginRight: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: Themes.colors.headerBackground,
    width: '100%',
  },
  headerLogo: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  headerText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  buttonText: { // Ensure this style is defined
    color: 'white', // Set text color to white
    fontSize: 13,
  },
  songList: {
    width: "100%",
  },
});
