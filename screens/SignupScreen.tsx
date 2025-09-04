import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../types/navigation"
import { supabase } from "../lib/supabase"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Props = NativeStackScreenProps<RootStackParamList, "Signup">

export default function SignupScreen({ navigation }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Fehler", "Die Passwörter stimmen nicht überein")
      return
    }

    if (password.length < 6) {
      Alert.alert("Fehler", "Das Passwort muss mindestens 6 Zeichen lang sein")
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      Alert.alert("Fehler", error.message)
    } else {
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
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView 
        className="flex-1 bg-slate-50" 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
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
            <Text className="text-base font-semibold text-gray-700 mb-2">Passwort (Mindestens 6 Zeichen)</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-800"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholderTextColor="#9ca3af"
              placeholder="••••••••"
              autoComplete="password"
              autoCapitalize="none"
            />
          </View>

          <View className="mb-5">
            <Text className="text-base font-semibold text-gray-700 mb-2">Passwort bestätigen</Text>
            <TextInput
              className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-800"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#9ca3af"
              placeholder="••••••••"
              autoComplete="password"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity className="bg-blue-500 rounded-xl py-4 mt-2 mb-4" onPress={handleSignup}>
            <Text className="text-white text-base font-semibold text-center">Registrieren</Text>
          </TouchableOpacity>

          <TouchableOpacity className="py-3" onPress={() => navigation.navigate("Login")}>
            <Text className="text-blue-500 text-base text-center">Bereits ein Konto? Anmelden</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
