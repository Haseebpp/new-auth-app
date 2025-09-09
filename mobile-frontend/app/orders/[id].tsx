import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { getOrders, type Order as APIOrder, cancelOrder } from '@/services/api/orders';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<APIOrder | null>(null);
  const [status, setStatus] = useState<'loading'|'succeeded'|'failed'>('loading');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await getOrders();
        const found = res.orders.find((o) => o._id === id);
        setOrder(found ?? null);
        setStatus('succeeded');
      } catch (e) {
        setStatus('failed');
      }
    })();
  }, [id]);

  const onCancel = async () => {
    if (!order) return;
    try {
      const res = await cancelOrder(order._id);
      setOrder(res.order);
    } catch {}
  };

  if (status === 'loading') {
    return <View style={styles.center}><Text style={{ color: '#64748b' }}>Loading…</Text></View>;
  }
  if (!order) {
    return <View style={styles.center}><Text style={{ color: '#b91c1c' }}>Order not found</Text></View>;
  }

  const svcName = typeof order.service === 'string' ? 'Order' : order.service?.name;
  const date = new Date(order.scheduledAt).toLocaleDateString();
  const time = new Date(order.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{svcName}</Text>
      <View style={styles.card}>
        <View style={{ padding: 16, gap: 8 }}>
          <Row label="Order ID" value={`#${order._id.slice(-6)}`} />
          <Row label="Date & Time" value={`${date}, ${time}`} />
          <Row label="Status" value={order.status} />
          {order.notes ? <Row label="Notes" value={order.notes} /> : null}
        </View>
        <View style={{ flexDirection: 'row', gap: 8, padding: 16 }}>
          <Link href="/(tabs)/orders" asChild>
            <Pressable style={[styles.button, styles.outline]}>
              <Text>Back</Text>
            </Pressable>
          </Link>
          <Pressable style={[styles.button, styles.primary]} onPress={onCancel} disabled={order.status !== 'pending'}>
            <FontAwesome name="close" color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 8, fontWeight: '600' }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ color: '#334155' }}>{label}</Text>
      <Text style={{ fontWeight: '600' }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  card: { backgroundColor: '#fff', borderRadius: 16, borderColor: '#e2e8f0', borderWidth: 1 },
  button: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  primary: { backgroundColor: '#0d9488' },
  outline: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
});

