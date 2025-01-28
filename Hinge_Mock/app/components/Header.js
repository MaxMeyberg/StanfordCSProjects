import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  Dimensions
} from "react-native";

/* Files called index.js are treated specially by Node.js. 
 * You can import them by giving the name of the folder the index.js
 * is located in! */ 
import Icons from "../../assets/Icons";

/* This handy trick grabs the width and height of the device's window,
 * which lets you set the sizes of your UI elements relative to the
 * dimensions of the device. */
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const Header = () => {
  return (
    <View style={styles.header}>
      <View stile = {styles.HeHimPronouns}>
      <Text style={styles.name}>{Profiles.landay.name}</Text>
      <Text>{Profiles.landay.pronouns}</Text>
      </View>
      <Image 
        source={Icons.sun /* For dark mode, use Icons.moon */} 
        style={styles.headerIcon} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerIcon: {
    height: windowWidth * 0.09,
    width: windowWidth * 0.09,
    
  },
  header: {
    
    flexDirection: 'row',
    //borderWidth: 1,
    width: "100%",
    //paddingStart: 100,
    
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    
    // fill this in!
  },

  HeHimPronouns:{
    flexDirection: 'column',
  },
  name: {
    // We've loaded this font for you in App.js
    fontFamily: 'Sydney-Bold', // 'Sydney' is the non-bold version
    fontSize: 35,
    
    
  },
  //add more styles for other components!
  pronouns: {
    fontFamily: 'Sydney', 
    fontSize: 1,  // Smaller size for pronouns
    fontWeight: '300',
  },
});

export default Header;
