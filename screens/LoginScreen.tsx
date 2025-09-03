import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { supabase } from "../lib/supabase"
import type { RootStackParamList } from "../types/navigation"

type Props = NativeStackScreenProps<RootStackParamList, "Login">

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      Alert.alert("Fehler", error.message)
    } else {
      if (data.session) {
        await AsyncStorage.setItem("supabase_session", JSON.stringify(data.session))
      }

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      })
    }
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-slate-800 text-center mb-2">Anmelden</Text>

        <View className="mb-5">
          <Text className="text-base font-semibold text-gray-700 mb-2">E-Mail</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-800"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="deine@email.com"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View className="mb-5">
          <Text className="text-base font-semibold text-gray-700 mb-2">Passwort</Text>
          <TextInput
            className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-800"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Dein Passwort"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <TouchableOpacity className="bg-blue-500 rounded-xl py-4 mt-2 mb-4" onPress={handleLogin}>
          <Text className="text-white text-base font-semibold text-center">Anmelden</Text>
        </TouchableOpacity>

        <TouchableOpacity className="py-3" onPress={() => navigation.navigate("Signup")}>
          <Text className="text-blue-500 text-base text-center">Noch kein Konto? Registrieren</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
