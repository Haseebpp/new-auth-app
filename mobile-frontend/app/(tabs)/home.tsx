import { Link, type Href } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Pickup in 2h • Delivery <Text style={{ color: '#0f766e' }}>&lt; 24h</Text></Text>
        <View style={styles.badgesRow}>
          <Badge text="Sealed Bag" icon="shield" />
          <Badge text="Non‑mixed Loads" icon="shield" />
          <Badge text="Eco Wash" icon="leaf" />
        </View>
        <View style={styles.ctaRow}>
          <Link href="/orders/new/service" asChild>
            <Pressable style={[styles.button, styles.buttonPrimary]}>
              <Text style={styles.buttonText}>Schedule Pickup</Text>
            </Pressable>
          </Link>
          <Link href="/subscriptions" asChild>
            <Pressable style={[styles.button, styles.buttonOutline]}>
              <Text style={[styles.buttonText, { color: '#0f172a' }]}>Subscriptions</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.cardsRow}>
        <InfoCard title="Schedule" description="Book a new pickup" price="SAR 6" icon="truck" link="/orders/new/service" />
        <InfoCard title="Subscriptions" description="Weekly or monthly plans" price="SAR 65" icon="credit-card" link="/subscriptions" />
        <InfoCard title="Bundles" description="Save with curated sets" price="SAR 9" icon="gift" />
      </View>

      <View style={styles.priceGrid}>
        <PriceItem label="Thobe" price="SAR 6" icon="shopping-bag" />
        <PriceItem label="Standard Wash (6kg)" price="SAR 65" icon="refresh" />
        <PriceItem label="Abaya" price="SAR 9" icon="female" />
      </View>
    </ScrollView>
  );
}

function Badge({ text, icon }: { text: string; icon: React.ComponentProps<typeof FontAwesome>['name'] }) {
  return (
    <View style={styles.badge}>
      <FontAwesome name={icon} size={14} color="#0f766e" />
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

function InfoCard({ title, description, price, icon, link }: { title: string; description: string; price: string; icon: React.ComponentProps<typeof FontAwesome>['name']; link?: Href }) {
  const inner = (
    <View style={styles.card}>
      <View style={{ padding: 16 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
        <View style={styles.cardBottomRow}>
          <Text style={styles.cardPrice}>{price}</Text>
          <FontAwesome name={icon} size={24} color="#0f766e" />
        </View>
      </View>
    </View>
  );
  if (link) {
    return (
      <Link href={link} asChild>
        <Pressable>{inner}</Pressable>
      </Link>
    );
  }
  return inner;
}

function PriceItem({ label, price, icon }: { label: string; price: string; icon: React.ComponentProps<typeof FontAwesome>['name'] }) {
  return (
    <View style={styles.priceCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={styles.priceIcon}><FontAwesome name={icon} size={18} color="#0f172a" /></View>
        <View>
          <Text style={styles.priceLabel}>{label}</Text>
          <Text style={styles.priceValue}>{price}</Text>
        </View>
      </View>
      <Text style={{ color: '#0f766e', fontWeight: '600' }}>Add</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  hero: { backgroundColor: '#f0fdfa', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#99f6e4' },
  heroTitle: { fontSize: 20, fontWeight: '600', color: '#0f172a' },
  badgesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
  badgeText: { color: '#334155', fontSize: 12 },
  ctaRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  button: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12 },
  buttonPrimary: { backgroundColor: '#0d9488' },
  buttonOutline: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  buttonText: { color: '#fff', fontWeight: '600' },
  cardsRow: { flexDirection: 'column', gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  cardDesc: { marginTop: 4, color: '#64748b', fontSize: 12 },
  cardBottomRow: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardPrice: { fontSize: 18, fontWeight: '700' },
  priceGrid: { gap: 8 },
  priceCard: { padding: 12, borderRadius: 12, borderColor: '#e2e8f0', borderWidth: 1, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceIcon: { height: 40, width: 40, borderRadius: 12, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  priceLabel: { color: '#64748b', fontSize: 12 },
  priceValue: { color: '#0f172a', fontWeight: '600' },
});
