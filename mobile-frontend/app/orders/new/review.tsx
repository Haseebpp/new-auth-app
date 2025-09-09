import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useBookingStore } from '@/store/useBookingStore';
import { createOrder } from '@/services/api/orders';

export default function OrderReviewScreen() {
  const router = useRouter();
  const { serviceId, scheduledAt, notes, setNotes, reset } = useBookingStore();
  const [status, setStatus] = useState<'idle'|'loading'|'failed'|'succeeded'>('idle');

  useEffect(() => {
    if (!serviceId || !scheduledAt) {
      router.replace('/orders/new/service');
    }
  }, [serviceId, scheduledAt]);

  const dt = useMemo(() => (scheduledAt ? new Date(scheduledAt) : null), [scheduledAt]);
  const dateLabel = dt ? dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-';
  const timeLabel = dt ? dt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '-';

  const onConfirm = async () => {
    if (!serviceId || !scheduledAt) return;
    setStatus('loading');
    try {
      await createOrder({ serviceId, scheduledAt, notes });
      setStatus('succeeded');
      reset();
      router.replace('/orders');
    } catch (e) {
      setStatus('failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Review your booking</Text>
      <View style={styles.card}>
        <View style={{ padding: 16, gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: '#334155' }}>Date & Time</Text>
            <Text style={{ fontWeight: '600' }}>{dateLabel}, {timeLabel}</Text>
          </View>
          <View>
            <Text style={{ color: '#334155', marginBottom: 6 }}>Notes (optional)</Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Any special instructions"
              multiline
              numberOfLines={3}
              style={styles.textarea}
            />
          </View>
          {status === 'failed' && (
            <Text style={{ color: '#b91c1c' }}>Failed to create order</Text>
          )}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
            <Link href="/orders/new/schedule" asChild>
              <Pressable style={[styles.button, styles.outline]}><Text>Back</Text></Pressable>
            </Link>
            <Pressable style={[styles.button, styles.primary]} onPress={onConfirm} disabled={status==='loading'}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>{status==='loading' ? 'Placing...' : 'Confirm Booking'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  card: { backgroundColor: '#fff', borderRadius: 16, borderColor: '#e2e8f0', borderWidth: 1 },
  textarea: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, minHeight: 80, textAlignVertical: 'top' },
  button: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, alignItems: 'center' },
  outline: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  primary: { backgroundColor: '#0d9488' },
});
