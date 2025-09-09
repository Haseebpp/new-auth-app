import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { getServices, seedServices, type Service } from '@/services/api/services';
import { useBookingStore } from '@/store/useBookingStore';

export default function ServiceSelectScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [status, setStatus] = useState<'idle'|'loading'|'succeeded'|'failed'>('idle');
  const [query, setQuery] = useState('');
  const [seeding, setSeeding] = useState(false);
  const setServiceId = useBookingStore((s) => s.setServiceId);
  const router = useRouter();

  useEffect(() => {
    if (status === 'idle') {
      setStatus('loading');
      getServices()
        .then((data) => { setServices(data.services); setStatus('succeeded'); })
        .catch(() => setStatus('failed'));
    }
  }, [status]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) => [s.name, s.description ?? ''].some((v) => v.toLowerCase().includes(q)));
  }, [services, query]);

  const onChoose = (id: string) => {
    setServiceId(id);
    router.push('/orders/new/schedule');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Choose a Service</Text>
      {status === 'succeeded' && (
        <Text style={styles.count}>{filtered.length} of {services.length} services</Text>
      )}

      {status === 'succeeded' && services.length > 0 && (
        <TextInput style={styles.input} placeholder="Search services..." value={query} onChangeText={setQuery} />
      )}

      {status === 'loading' && (
        <View style={{ gap: 12, marginTop: 8 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={[styles.card, { opacity: 0.6 }]}> 
              <View style={{ padding: 16 }}>
                <View style={{ height: 20, width: 120, backgroundColor: '#e2e8f0', borderRadius: 6 }} />
                <View style={{ height: 12, width: '80%', backgroundColor: '#f1f5f9', borderRadius: 6, marginTop: 10 }} />
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                  <View style={{ height: 24, width: 60, backgroundColor: '#e2e8f0', borderRadius: 999 }} />
                  <View style={{ height: 24, width: 80, backgroundColor: '#e2e8f0', borderRadius: 999 }} />
                </View>
                <View style={{ height: 36, width: '100%', backgroundColor: '#e2e8f0', borderRadius: 10, marginTop: 12 }} />
              </View>
            </View>
          ))}
        </View>
      )}
      {status === 'failed' && (
        <View style={styles.alert}>
          <Text style={styles.alertText}>Failed to load services.</Text>
          <Pressable style={[styles.button, styles.outline]} onPress={() => setStatus('idle')}>
            <Text>Retry</Text>
          </Pressable>
        </View>
      )}

      {status === 'succeeded' && services.length === 0 && (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>No services available yet</Text>
          <Text style={styles.emptyText}>If you’re developing locally, seed sample services below.</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              style={[styles.button, styles.outline]}
              onPress={() => setStatus('idle')}
              disabled={seeding}
            >
              <Text>Retry</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.primary]}
              onPress={async () => {
                try {
                  setSeeding(true);
                  await seedServices();
                  // Re-fetch services
                  setStatus('idle');
                } catch (e) {
                  // Show a simple inline message by flashing failed state then back
                  setStatus('failed');
                  setTimeout(() => setStatus('idle'), 1200);
                } finally {
                  setSeeding(false);
                }
              }}
              disabled={seeding}
            >
              <Text style={styles.buttonLight}>{seeding ? 'Seeding…' : 'Seed sample services'}</Text>
            </Pressable>
          </View>
        </View>
      )}

      {status === 'succeeded' && services.length > 0 && (
        <View style={{ gap: 12 }}>
          {filtered.map((s) => (
            <Pressable key={s._id} onPress={() => onChoose(s._id)} style={styles.card}>
              <View style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.cardTitle}>{s.name}</Text>
                  <Text style={styles.price}>SAR {s.price.toFixed(2)}</Text>
                </View>
                <Text style={styles.desc}>{s.description ?? 'No description'}</Text>
                <Text style={styles.meta}>Duration: {s.durationMinutes} min</Text>
                <Pressable onPress={() => onChoose(s._id)} style={[styles.button, styles.primary]}>
                  <Text style={styles.buttonLight}>Select</Text>
                </Pressable>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  count: { color: '#6b7280' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginTop: 8 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderColor: '#e2e8f0', borderWidth: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  price: { fontWeight: '700' },
  desc: { color: '#64748b', marginTop: 4 },
  meta: { color: '#334155', marginTop: 6 },
  button: { marginTop: 10, borderRadius: 12, alignItems: 'center', paddingVertical: 10 },
  primary: { backgroundColor: '#0d9488' },
  outline: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  buttonLight: { color: '#fff', fontWeight: '600' },
  alert: { marginTop: 8, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#fecaca', backgroundColor: '#fef2f2', gap: 8 },
  alertText: { color: '#b91c1c' },
  emptyWrap: { marginTop: 8, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  emptyText: { color: '#64748b' },
});
