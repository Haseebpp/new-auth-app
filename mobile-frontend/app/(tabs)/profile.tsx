import { Link } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useAuthStore } from '@/store/useAuthStore';

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{user ? 'Profile' : 'Guest'}</Text>
        <Text style={styles.subtitle}>{user?.email ?? 'Not signed in'}</Text>
        <View style={{ height: 8 }} />
        {user ? (
          <Pressable style={[styles.button, styles.outline]} onPress={signOut}>
            <Text style={styles.buttonDark}>Sign out</Text>
          </Pressable>
        ) : (
          <Link href="/login" asChild>
            <Pressable style={[styles.button, styles.primary]}>
              <Text style={styles.buttonLight}>Sign in</Text>
            </Pressable>
          </Link>
        )}
        <View style={{ height: 8 }} />
        <Link href="/profile/edit" asChild>
          <Pressable style={[styles.button, styles.secondary]}>
            <Text style={styles.buttonDark}>Edit profile</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#64748b' },
  button: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, alignItems: 'center' },
  primary: { backgroundColor: '#0d9488' },
  secondary: { backgroundColor: '#e2e8f0' },
  outline: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  buttonLight: { color: '#fff', fontWeight: '600' },
  buttonDark: { color: '#0f172a', fontWeight: '600' },
});
