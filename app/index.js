import { useEffect, useState, Text, View } from "react";

import { Redirect } from "expo-router";

import Login from "@/components/Login";
import db from "@/database/db";
import Loading from "@/components/Loading";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function App() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Default to true for initial load

  useEffect(() => {
    setIsLoading(true);

    db.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = db.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session) {
    return <Redirect href="tabs/feed" />;
  } else if (isLoading) {
    return <Loading />;
  } else {
    return <Login />;
  }
}
