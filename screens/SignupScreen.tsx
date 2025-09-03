import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../types/navigation"
import { supabase } from "../lib/supabase"

type Props = NativeStackScreenProps<RootStackParamList, "Signup">

export default function SignupScreen({ navigation }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      Alert.alert("Fehler", error.message)
    } else {
      Alert.alert("Erfolg", "Überprüfe dein E-Mail-Postfach")
      navigation.navigate("Login")
    }
  }

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-1 justify-center px-6">
        <Text className="text-3xl font-bold text-slate-800 text-center mb-2">Registrieren</Text>
        <Text className="text-base text-slate-500 text-center mb-8">Erstelle dein Konto für die Blutdruck-App</Text>

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
            placeholder="Mindestens 6 Zeichen"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <TouchableOpacity className="bg-blue-500 rounded-xl py-4 mt-2 mb-4" onPress={handleSignup}>
          <Text className="text-white text-base font-semibold text-center">Registrieren</Text>
        </TouchableOpacity>

        <TouchableOpacity className="py-3" onPress={() => navigation.navigate("Login")}>
          <Text className="text-blue-500 text-base text-center">Bereits ein Konto? Anmelden</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
