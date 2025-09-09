import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { getServiceSlots, getServices, type Service } from '@/services/api/services';
import { useBookingStore } from '@/store/useBookingStore';

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function ScheduleSelectScreen() {
  const router = useRouter();
  const serviceId = useBookingStore((s) => s.serviceId);
  const date = useBookingStore((s) => s.date);
  const setDate = useBookingStore((s) => s.setDate);
  const setScheduledAt = useBookingStore((s) => s.setScheduledAt);

  const [localDate, setLocalDate] = useState(date || toISODate(new Date()));
  const [slots, setSlots] = useState<{ start: string; end: string }[]>([]);
  const [status, setStatus] = useState<'idle'|'loading'|'succeeded'|'failed'>('idle');

  useEffect(() => {
    if (!serviceId) {
      router.replace('/orders/new/service');
      return;
    }
  }, [serviceId]);

  useEffect(() => {
    if (!serviceId) return;
    setStatus('loading');
    setDate(localDate);
    getServiceSlots(serviceId, localDate)
      .then((data) => { setSlots(data.slots); setStatus('succeeded'); })
      .catch(() => setStatus('failed'));
  }, [serviceId, localDate]);

  const [service, setService] = useState<Service | null>(null);
  useEffect(() => {
    // Fetch service meta for display
    (async () => {
      if (!serviceId) return;
      try {
        const res = await getServices();
        const found = res.services.find((s) => s._id === serviceId) || null;
        setService(found);
      } catch {}
    })();
  }, [serviceId]);

  const title = useMemo(() => service?.name || 'Select schedule', [service]);

  const changeDay = (delta: number) => {
    const d = new Date(localDate);
    d.setDate(d.getDate() + delta);
    setLocalDate(d.toISOString().slice(0, 10));
  };

  const onChooseSlot = (iso: string) => {
    setScheduledAt(iso);
    router.push('/orders/new/review');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.navRow}>
        <Pressable style={[styles.button, styles.outline]} onPress={() => changeDay(-1)}><Text>Prev</Text></Pressable>
        <Text style={styles.dateLabel}>{localDate}</Text>
        <Pressable style={[styles.button, styles.outline]} onPress={() => changeDay(1)}><Text>Next</Text></Pressable>
      </View>
      <Text style={styles.hint}>Times shown in your local timezone</Text>

      <View style={styles.card}>
        <View style={{ padding: 16 }}>
          {status === 'loading' && <Text style={{ color: '#64748b' }}>Loading slots…</Text>}
          {status === 'failed' && <Text style={{ color: '#b91c1c' }}>Failed to load slots</Text>}

          <View style={styles.slotGrid}>
            {slots.map((s) => {
              const dt = new Date(s.start);
              const label = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <Pressable key={s.start} style={[styles.button, styles.outline]} onPress={() => onChooseSlot(s.start)}>
                  <Text>{label}</Text>
                </Pressable>
              );
            })}
          </View>

          {slots.length === 0 && status === 'succeeded' && (
            <Text style={{ color: '#64748b' }}>No slots available. Try another day.</Text>
          )}

          <View style={{ marginTop: 12, gap: 8 }}>
            <Text style={{ color: '#334155', fontWeight: '600' }}>Or enter a custom date & time:</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput style={[styles.input, { flex: 1 }]} value={localDate} onChangeText={setLocalDate} />
              <ManualTimePicker onPick={onChooseSlot} date={localDate} />
            </View>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
        <Pressable style={[styles.button, styles.outline]} onPress={() => router.push('/orders/new/service')}><Text>Back</Text></Pressable>
      </View>
    </ScrollView>
  );
}

function ManualTimePicker({ onPick, date }: { onPick: (iso: string) => void; date: string }) {
  const [time, setTime] = useState('09:00');
  const onSubmit = () => {
    const d = new Date(`${date}T${time}:00`);
    if (!isNaN(d.getTime())) onPick(d.toISOString());
  };
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      <TextInput style={[styles.input, { width: 100 }]} value={time} onChangeText={setTime} />
      <Pressable style={[styles.button, styles.primary]} onPress={onSubmit}><Text style={{ color: '#fff', fontWeight: '600' }}>Use</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateLabel: { color: '#0f172a', fontWeight: '600' },
  hint: { textAlign: 'right', color: '#94a3b8' },
  card: { backgroundColor: '#fff', borderRadius: 16, borderColor: '#e2e8f0', borderWidth: 1 },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  button: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, alignItems: 'center' },
  outline: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  primary: { backgroundColor: '#0d9488' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10 },
});
