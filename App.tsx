import "./app.css"
import { useEffect, useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { supabase } from "./lib/supabase"
import type { RootStackParamList } from "./types/navigation"

import SignupScreen from "./screens/SignupScreen"
import LoginScreen from "./screens/LoginScreen"
import HomeScreen from "./screens/HomeScreen"

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  const [initialRoute, setInitialRoute] = useState<"Login" | "Home">("Login")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      const sessionStr = await AsyncStorage.getItem("supabase_session")
      if (sessionStr) {
        const session = JSON.parse(sessionStr)
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        })
        setInitialRoute("Home")
      }
      setLoading(false)
    }
    restoreSession()
  }, [])

  if (loading) return null

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
