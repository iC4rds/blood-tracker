import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, Modal, SafeAreaView, Platform } from "react-native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../types/navigation"
import { supabase } from "../lib/supabase"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Props = NativeStackScreenProps<RootStackParamList, "Home">

interface Measurement {
  id: string
  systolic: number
  diastolic: number
  pulse?: number
  created_at: string
}

export default function HomeScreen({ navigation }: Props) {
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [systolic, setSystolic] = useState("")
  const [diastolic, setDiastolic] = useState("")
  const [pulse, setPulse] = useState("")

  useEffect(() => {
    loadMeasurements()
  }, [])

  const loadMeasurements = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from("measurements")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      Alert.alert("Fehler", error.message)
    } else {
      setMeasurements(data || [])
    }
  }

  const saveMeasurement = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      Alert.alert("Fehler", "Nicht eingeloggt")
      return
    }

    const { error } = await supabase.from("measurements").insert([
      {
        user_id: user.id,
        systolic: Number.parseInt(systolic, 10),
        diastolic: Number.parseInt(diastolic, 10),
        pulse: pulse ? Number.parseInt(pulse, 10) : null,
      },
    ])

    if (error) {
      Alert.alert("Fehler", error.message)
    } else {
      setSystolic("")
      setDiastolic("")
      setPulse("")
      setShowAddModal(false)
      loadMeasurements()
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    await AsyncStorage.removeItem("supabase_session")
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    })
  }

  const getBloodPressureCategory = (systolic: number, diastolic: number) => {
    if (systolic < 90 || diastolic < 60) {
      return { category: "Hypotonie (zu niedrig)", color: "bg-blue-500" };
    } 
    // Normalbereich: 90-120 / 60-80
    else if (systolic >= 90 && systolic <= 120 && diastolic >= 60 && diastolic <= 80) {
      return { category: "Normal", color: "bg-green-500" };
    } 
    // Erhöhter Blutdruck: 121-130 / <80
    else if (systolic > 120 && systolic <= 130 && diastolic < 80) {
      return { category: "Erhöht", color: "bg-yellow-500" };
    } 
    // Hypertonie Stufe 1: 131-140 / 81-90
    else if ((systolic > 130 && systolic <= 140) || (diastolic > 80 && diastolic <= 90)) {
      return { category: "Hypertonie Stufe 1", color: "bg-orange-500" };
    } 
    // Hypertonie Stufe 2: >140 / >90
    else if (systolic > 140 || diastolic >= 90) {
      return { category: "Hypertonie Stufe 2", color: "bg-red-500" };
    } 
    else {
      return { category: "Unbekannt", color: "bg-gray-500" };
    }
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderMeasurement = ({ item }: { item: Measurement }) => {
    const { category, color } = getBloodPressureCategory(item.systolic, item.diastolic)

    return (
      <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
        <View className="flex-row justify-between items-center mb-2">
          <View className={`${color} px-2 py-1 rounded-md`}>
            <Text className="text-white text-xs font-semibold">{category}</Text>
          </View>
          <Text className="text-slate-500 text-sm">{formatDate(item.created_at)}</Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-bold text-slate-800">
            {item.systolic}/{item.diastolic} mmHg
          </Text>
          {item.pulse && <Text className="text-base text-slate-600">Puls: {item.pulse} bpm</Text>}
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className={`flex-row justify-between items-center px-5 py-4 bg-white border-b border-gray-200 
        ${Platform.OS === 'android' ? 'pt-10' : ''}`}
      >
        <Text className="text-2xl font-bold text-slate-800">Meine Messungen</Text>
        <TouchableOpacity className="px-3 py-1.5" onPress={logout}>
          <Text className="text-red-500 text-base">Abmelden</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={measurements}
        renderItem={renderMeasurement}
        keyExtractor={(item) => item.id}
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center mt-16">
            <Text className="text-lg text-slate-500 mb-1">Noch keine Messungen vorhanden</Text>
            <Text className="text-sm text-gray-400">Füge deine erste Messung hinzu</Text>
          </View>
        }
      />

      <TouchableOpacity
        className="absolute bottom-8 right-5 w-14 h-14 bg-blue-500 rounded-full justify-center items-center shadow-lg"
        onPress={() => setShowAddModal(true)}
      >
        <Text className="text-white text-2xl font-bold">+</Text>
      </TouchableOpacity>

      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className="flex-1 bg-slate-50">
          <View className="flex-row justify-between items-center px-5 py-4 bg-white border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text className="text-red-500 text-base">Abbrechen</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-slate-800">Neue Messung</Text>
            <View className="w-20" />
          </View>

          <View className="flex-1 p-5">
            <View className="mb-5">
              <Text className="text-base font-semibold text-gray-700 mb-2">Systolisch (mmHg)</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-800"
                keyboardType="numeric"
                value={systolic}
                onChangeText={setSystolic}
                placeholder="120"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View className="mb-5">
              <Text className="text-base font-semibold text-gray-700 mb-2">Diastolisch (mmHg)</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-800"
                keyboardType="numeric"
                value={diastolic}
                onChangeText={setDiastolic}
                placeholder="80"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View className="mb-5">
              <Text className="text-base font-semibold text-gray-700 mb-2">Puls</Text>
              <TextInput
                className="bg-white border border-gray-300 rounded-xl px-4 py-3.5 text-base text-gray-800"
                keyboardType="numeric"
                value={pulse}
                onChangeText={setPulse}
                placeholder="70"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <TouchableOpacity className="bg-blue-500 rounded-xl py-4 mt-5" onPress={saveMeasurement}>
              <Text className="text-white text-base font-semibold text-center">Speichern</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}
