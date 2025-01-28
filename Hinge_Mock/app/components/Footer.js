import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from "react-native";
import { Icons, Themes } from "../../assets/Themes";
import Heart from "../../assets/Icons/heart_light.png"; 
import DM from "../../assets/Icons/messages_light.png"; 

const windowWidth = Dimensions.get("window").width;

const Footer = () => {
  return (
    <View style={styles.navigationContainer}>
      {/* Discover Icon */}
      <View style={styles.navItem}>
        <Image source={Icons.discover.light} style={styles.icon} />
        <Text style={styles.label}>Discover</Text>
      </View>
      
      {/* Matches Icon */}
      <View style={styles.navItem}>
        <Image source={Heart} style={styles.icon} />
        <Text style={styles.label}>Matches</Text>
      </View>

      {/* Messages Icon */}
      <View style={styles.navItem}>
        <Image source={DM} style={styles.icon} />
        <Text style={styles.label}>DMs</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-around", // Ensure the icons and labels are evenly distributed across the screen
    alignItems: "center",
    backgroundColor: Themes.light.navigation,
    width: windowWidth,
    paddingVertical: 15, // More padding for a slightly taller footer
    position: 'absolute', // Fix footer at the bottom
    bottom: 0,
  },
  navItem: {
    alignItems: "center",
    flex: 1, // Each navigation item takes up equal space for balanced distribution
  },
  icon: {
    width: 35, // Slightly larger icon for better visibility
    height: 35,
    resizeMode: "contain",
    marginBottom: 5,
  },
  label: {
    fontFamily: "Sydney",
    fontSize: 16, // Increased font size for better readability
    color: "white", // Changed text color to white to match "good" image
  },
});

export default Footer;
