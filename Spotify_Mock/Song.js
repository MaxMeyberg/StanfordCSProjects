import { View, Text, Image, StyleSheet } from "react-native";
import millisToMinutesAndSeconds from "./utils/millisToMinutesAndSeconds";

const Song = ({ index, imageUrl, title, artist, album, duration }) => (
  <View style={styles.songContainer}>
    <View style={styles.indexContainer}>
      {/* Display the index of the song */}
      <Text style={styles.index}>{index + 1}</Text>
    </View>
    <Image source={{ uri: imageUrl }} style={styles.albumImage} />
    
    <View style = {styles.titleArtistContainer}>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode='tail'>{title}</Text>
      <Text style={styles.artist} numberOfLines={1} ellipsizeMode='tail'>{artist}</Text>
    </View>
    <View style = {styles.albumContainer}>
      <Text style={styles.album} numberOfLines={1} ellipsizeMode='tail'>{album}</Text>
    </View>
    <View style = {styles.durationContainer}>
      <Text style={styles.duration}>{millisToMinutesAndSeconds(duration)}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  songContainer: { 
    flexDirection: "row", 
    padding: 10, 
    alignItems: "center", 
    width: "100%",    
  },
  indexContainer: {
    width: 30, // Fixed width for index
    alignItems: 'center'
  },
  index: {
    fontSize: 10,
    color: "gray",
  },
  albumImage: { 
    width: 50, 
    height: 50, 
    marginRight: 10, 
    
  },
  titleArtistContainer:{
    flex: 1,
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  title: { 
    fontSize: 12, 
    color: "white" 
  },
  artist: { 
    color: "gray" , 
    fontSize: 12, 
  },
  albumContainer:{
    flex: 1,
    justifyContent: 'flex-start',
  },
  album: { 
    fontStyle: "italic", 
    fontSize: 12, 
    color: "white" 
  },
  durationContainer: {
    alignItems: 'flex-end',
    width: 50,
  },
  duration: { 
    color: "white", 
    fontSize: 12, // Consistent font size
  },
});

export default Song;
