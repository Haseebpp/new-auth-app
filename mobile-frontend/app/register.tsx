import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const router = useRouter();

  const onSubmit = () => {
    // TODO: Call real API; for now, simulate
    setToken('demo-token');
    setUser({ id: 'u1', email: `${number}@example.com` });
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join with your phone number</Text>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Phone number" value={number} onChangeText={setNumber} />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <Pressable style={[styles.button, styles.primary]} onPress={onSubmit}>
          <Text style={styles.buttonLight}>Create account</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
          <Text style={{ color: '#6b7280' }}>Already have an account?</Text>
          <Link href="/login">
            <Text style={{ color: '#2563eb' }}>Sign in</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 16, borderColor: '#e2e8f0', borderWidth: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#64748b', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginTop: 8 },
  button: { marginTop: 12, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  primary: { backgroundColor: '#0d9488' },
  buttonLight: { color: '#fff', fontWeight: '600' },
});
