/**
 * You don't need to edit this file, but you can if you want!
 * Almost of the work for this assignment is in Header.js, Body.js, and Footer.js.
 * 
 * If you're doing the light/dark mode toggle extension, you will need to make
 * a couple tweaks here.
 */

import { useCallback } from "react";
import { StyleSheet, View, StatusBar } from "react-native";

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { Themes } from "./assets/Themes";
import Header from "./app/components/Header";
import Body from "./app/components/Body";
import Footer from "./app/components/Footer";

/* Keep the splash screen visible while we fetch resources */
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Sydney: require("./assets/Fonts/Sydney-Serial-Regular.ttf"),
    "Sydney-Bold": require("./assets/Fonts/Sydney-Serial-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  /* ^Don't mind/edit the code above, it's there to load the font for you! */
  StatusBar.setBarStyle(Themes.light.statusBar);
  /* ^Don't mind/edit this one either unless you decide to do the dark theme one, in that case, you will have to change it accordingly */

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <Header />
      <Body />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  // Feel free to change this if you want!
  container: {
    flex: 1,
    backgroundColor: Themes.light.bg,
    alignItems: "center",
    paddingHorizontal: 16,
  },
});
