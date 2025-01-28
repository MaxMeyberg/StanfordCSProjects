import { 
  View, 
  StyleSheet, 
  Text,
  Dimensions,
  Image 
} from "react-native";
import Profiles from "../../assets/Profiles";
import Heart from "../../assets/Icons/like_regular_light.png"; 
import AudioWaveform from "../../assets/Icons/audio_waveform_light.png";
import PlayerIcon from "../../assets/Icons/player_light.png"; // Importing player icon (like button)

const windowWidth = Dimensions.get("window").width;

const Body = () => {
  return (
    <View style={styles.container}>
      {/* White box containing the image and text */}
      <View style={styles.whiteBox}>
        {/* Me and my best friend text */}
        <Text style={styles.label}>Me and my best friend</Text>
        
        {/* Image and Heart icon */}
        <View style={styles.imageContainer}>
          <Image
            source={Profiles.landay.image}
            style={styles.image}
          />
          <View style={styles.heartContainer}>
            <Image 
              source={Heart}
              style={styles.heartIcon} 
            />
          </View>
        </View>
      </View>

      {/* My hottest take section */}
      <View style={styles.audioBox}>
        <Text style={styles.audioLabel}>My hottest take</Text>
        <View style={styles.audioContent}>
          <Image
            source={PlayerIcon}
            style={styles.playerIcon}
          />
          <Image
            source={AudioWaveform}
            style={styles.audioWaveform}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'center',
    flex: 1,
    paddingVertical: 20,
    //backgroundColor: 'white', // Added background color to match the rest of the content
  },
  whiteBox: {
    backgroundColor: 'white', 
    borderRadius: 20, 
    alignItems: 'center',
    width: windowWidth * 0.85, // Set box width relative to the screen (reduced width)
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Sydney',
    fontSize: 22, // Reduced font size for better proportion
    color: 'black',
    marginBottom: 10,
    width: '100%',
    textAlign: 'left', // Align text to the left side
  },
  imageContainer: {
    position: 'relative',
    width: '100%', // Full width of the white box
    height: windowWidth * 0.75, // Adjusted height to match width ratio for full coverage
    overflow: 'hidden', // Ensure the image doesn't overflow the container
  },
  image: {
    width: '100%',
    height: '100%', // Fill the entire container without any padding
    borderRadius: 0, // Removed any border radius to ensure it fills the container completely
    resizeMode: 'cover', // Ensure the image fully covers the container
  },
  heartContainer: {
    position: 'absolute',
    bottom: 10, // Slightly adjusted to align with the "good" example
    right: 10,
    width: 50, // Circle width for the heart container (adjust as needed)
    height: 50, // Circle height for the heart container (adjust as needed)
    borderRadius: 25, // Make it a circle (width / 2)
    backgroundColor: 'white', // White background for the circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    width: 30, // Reduced size for better proportion within the circle
    height: 30,
    resizeMode: 'contain',
  },
  audioBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'flex-start',
    width: windowWidth * 0.85, // Same width as whiteBox for consistency
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  audioLabel: {
    fontFamily: 'Sydney',
    fontSize: 22,
    color: 'black',
    marginBottom: 10,
    textAlign: 'left', // Align text to the left side
    width: '100%',
  },
  audioContent: {
    flexDirection: 'row', // Align items horizontally
    alignItems: 'center',
    width: '100%', // Full width to keep the layout aligned properly
  },
  playerIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10, // Add some spacing between the play button and the waveform
  },
  audioWaveform: {
    flex: 1, // Take remaining space after the play button
    height: windowWidth * 0.15,
    resizeMode: 'contain',
  },
});

export default Body;
