import { Link, useRouter } from 'expo-router';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { ScrollView, View, Text, StyleSheet, Pressable, TextInput, RefreshControl } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getOrders, cancelOrder, type Order as APIOrder } from '@/services/api/orders';
import { useBookingStore } from '@/store/useBookingStore';
import { useFocusEffect } from '@react-navigation/native';

type Status = 'pending' | 'processing' | 'completed' | 'cancelled';
type FilterTab = 'all' | 'active' | Status;

type UIOrder = {
  id: string;
  title: string;
  start: string; // ISO
  end: string; // ISO
  notes?: string;
  status: Status;
};

export default function OrdersScreen() {
  const [tab, setTab] = useState<FilterTab>('all');
  const [q, setQ] = useState('');
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [status, setStatus] = useState<'idle'|'loading'|'succeeded'|'failed'>('idle');
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { setServiceId, setDate, setScheduledAt } = useBookingStore();

  const load = async () => {
    setStatus('loading');
    try {
      const res = await getOrders();
      setOrders(res.orders.map(mapOrderToUI));
      setStatus('succeeded');
    } catch (e) {
      setStatus('failed');
    }
  };

  useEffect(() => {
    if (status === 'idle') load();
  }, [status]);

  // Reload when screen gains focus
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const onCancel = async (id: string) => {
    try {
      const res = await cancelOrder(id);
      setOrders((prev) => prev.map((o) => (o.id === res.order._id ? mapOrderToUI(res.order) : o)));
    } catch {}
  };

  const onReorder = (api: APIOrder) => {
    const svc = (api as any).service;
    const serviceId = typeof svc === 'string' ? svc : svc?._id;
    if (serviceId) {
      setServiceId(serviceId);
      setDate(null);
      setScheduledAt(null);
      router.push('/orders/new/schedule');
    } else {
      router.push('/orders/new/service');
    }
  };

  const filtered = useMemo(() => orders.filter((o) =>
    (tab === 'all' || (tab === 'active' && (o.status === 'pending' || o.status === 'processing')) || o.status === tab) &&
    (q.trim() === '' || o.title.toLowerCase().includes(q.toLowerCase()) || (o.notes ?? '').toLowerCase().includes(q.toLowerCase()))
  ), [orders, tab, q]);

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> }>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>My Orders</Text>
          <Text style={styles.subtitle}>Track and manage your pickups</Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchWrap}>
          <FontAwesome name="search" size={14} color="#94a3b8" style={{ position: 'absolute', left: 10, top: 11 }} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search by service or notes"
            style={styles.search}
          />
        </View>
      </View>

      <View style={styles.tabs}>
        {['all','active','pending','processing','completed','cancelled'].map((t) => (
          <Pressable key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t as FilterTab)}>
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <View style={{ gap: 12 }}>
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          filtered.map((o) => (
            <OrderCard key={o.id} order={o} onCancel={onCancel} onReorder={onReorder} />
          ))
        )}
      </View>
      {/* Floating action button */}
      <Link href="/orders/new/service" asChild>
        <Pressable accessibilityLabel="Create new order" style={styles.fab}>
          <FontAwesome name="plus" size={18} color="#fff" />
          <Text style={styles.fabLabel}>New Order</Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

function OrderCard({ order, onCancel, onReorder }: { order: UIOrder; onCancel: (id: string) => void; onReorder: (api: APIOrder) => void }) {
  const { badgeText, badgeStyle } = statusMeta(order.status);
  return (
    <View style={styles.card}>
      <View style={{ padding: 16, gap: 6 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.cardTitle}>{order.title}</Text>
          <View style={[styles.badge, badgeStyle]}><Text style={styles.badgeLabel}>{badgeText}</Text></View>
        </View>
        <Text style={styles.cardMeta}><FontAwesome name="calendar" /> {fmtDate(order.start)}</Text>
        <Text style={styles.cardMeta}><FontAwesome name="clock-o" /> {fmtTime(order.start)} → {fmtTime(order.end)}</Text>
        {order.notes ? <Text style={styles.cardNotes}>Notes: {order.notes}</Text> : null}
      </View>
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 12 }}>
        <Link href={{ pathname: '/orders/[id]', params: { id: order.id } }} asChild>
          <Pressable style={[styles.button, styles.buttonOutline]}>
            <FontAwesome name="eye" size={14} />
            <Text style={[styles.buttonTextDark, { marginLeft: 6 }]}>View</Text>
          </Pressable>
        </Link>
        <Pressable style={[styles.button, styles.buttonOutline]} disabled={order.status !== 'pending'} onPress={() => onCancel(order.id)}>
          <FontAwesome name="close" size={14} />
          <Text style={[styles.buttonTextDark, { marginLeft: 6 }]}>Cancel</Text>
        </Pressable>
        {(order.status === 'completed' || order.status === 'cancelled') && (
          <Pressable style={[styles.button, styles.buttonPrimary]} onPress={() => onReorder(order as unknown as APIOrder)}>
            <FontAwesome name="refresh" color="#fff" size={14} />
            <Text style={[styles.buttonText, { marginLeft: 6 }]}>Reorder</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={[styles.card, { alignItems: 'center' }]}> 
      <View style={{ padding: 20, alignItems: 'center', gap: 8 }}>
        <FontAwesome name="archive" size={32} color="#0d9488" />
        <Text style={{ fontSize: 16, fontWeight: '600' }}>No orders yet</Text>
        <Text style={{ color: '#64748b', textAlign: 'center' }}>Create your first pickup or adjust filters to see past orders.</Text>
        <Link href="/orders/new/service" asChild>
          <Pressable style={[styles.button, styles.buttonPrimary]}>
            <Text style={styles.buttonText}>New Order</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

function statusMeta(status: Status) {
  switch (status) {
    case 'pending':
      return { badgeText: 'Pending', badgeStyle: { backgroundColor: '#e2e8f0' } };
    case 'processing':
      return { badgeText: 'Processing', badgeStyle: { backgroundColor: '#99f6e4' } };
    case 'completed':
      return { badgeText: 'Completed', badgeStyle: { backgroundColor: '#d1fae5' } };
    case 'cancelled':
      return { badgeText: 'Cancelled', badgeStyle: { backgroundColor: '#fee2e2' } };
  }
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString();
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function mapOrderToUI(o: APIOrder): UIOrder {
  const title = typeof o.service === 'string' ? 'Order' : (o.service?.name ?? 'Order');
  return {
    id: o._id,
    title,
    start: o.scheduledAt,
    end: o.scheduledEndAt,
    notes: o.notes,
    status: (o.status === 'confirmed' ? 'processing' : (o.status as any)) as Status,
  };
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12, paddingBottom: 96 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#64748b' },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  tab: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999, backgroundColor: '#f1f5f9' },
  tabActive: { backgroundColor: '#0d9488' },
  tabText: { color: '#334155', textTransform: 'capitalize' },
  tabTextActive: { color: '#fff' },
  searchRow: { marginTop: 8 },
  searchWrap: { position: 'relative' },
  search: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 12, paddingHorizontal: 32, paddingVertical: 8 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  cardMeta: { color: '#334155' },
  cardNotes: { color: '#64748b' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeLabel: { fontSize: 12, color: '#0f172a' },
  button: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
  buttonPrimary: { backgroundColor: '#0d9488' },
  buttonText: { color: '#fff', fontWeight: '600' },
  buttonOutline: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  buttonTextDark: { color: '#0f172a', fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    paddingHorizontal: 20,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0d9488',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  fabLabel: { color: '#fff', marginLeft: 8, fontWeight: '600' },
});
