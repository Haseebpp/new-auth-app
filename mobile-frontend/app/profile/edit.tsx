import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileEditScreen() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Edit Profile</Text>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Phone number" value={number} onChangeText={setNumber} />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Pressable style={[styles.button, styles.primary]} onPress={() => router.back()}>
          <Text style={styles.buttonLight}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 16, borderColor: '#e2e8f0', borderWidth: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginTop: 8 },
  button: { marginTop: 12, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  primary: { backgroundColor: '#0d9488' },
  buttonLight: { color: '#fff', fontWeight: '600' },
});

