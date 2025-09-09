import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const plans = [
  { id: 'family', name: 'Family Plan', subtitle: 'Weekly Bulk Wash · 24kg/month', price: 'SAR 249/month', popular: true, savings: 'Save 15%', icon: 'users' as const, features: ['Weekly pickup', 'Free delivery', 'Ironing included'] },
  { id: 'student', name: 'Student Plan', subtitle: 'Weekly 6kg · Perfect for students', price: 'SAR 99/month', popular: false, savings: 'Low cost', icon: 'graduation-cap' as const, features: ['Weekly pickup', 'Free delivery'] },
  { id: 'office', name: 'Office Staff Plan', subtitle: 'Uniform Care · 40 items/month', price: 'SAR 349/month', popular: false, savings: 'Business-friendly', icon: 'shopping-bag' as const, features: ['Biweekly pickup', 'Ironing included', 'Eco wash'] },
];

export default function SubscriptionsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Subscriptions & Bundles</Text>
        <Text style={styles.subtitle}>Pick a plan that suits your lifestyle</Text>
      </View>

      <View style={{ gap: 12 }}>
        {plans.map((p) => (
          <View key={p.id} style={styles.card}>
            {p.popular && (
              <View style={styles.popular}><Text style={{ color: '#fff', fontSize: 12 }}>Most Popular</Text></View>
            )}
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <FontAwesome name={p.icon} size={20} color="#0f766e" />
                <Text style={styles.cardTitle}>{p.name}</Text>
              </View>
              <Text style={styles.cardDesc}>{p.subtitle}</Text>
              <Text style={styles.price}>{p.price}</Text>
              <View style={styles.tag}><Text style={{ color: '#0f766e' }}>{p.savings}</Text></View>
              <View style={{ marginTop: 8, gap: 6 }}>
                {p.features.map((f) => (
                  <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <FontAwesome name="check" size={14} color="#0d9488" />
                    <Text style={{ color: '#334155' }}>{f}</Text>
                  </View>
                ))}
              </View>
              <Pressable style={[styles.button, styles.buttonPrimary]}>
                <Text style={styles.buttonText}>Subscribe Now</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  headerRow: { gap: 4 },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  subtitle: { color: '#64748b' },
  card: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  popular: { position: 'absolute', top: 8, left: 12, backgroundColor: '#0d9488', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, zIndex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  cardDesc: { color: '#64748b', marginTop: 4 },
  price: { fontSize: 20, fontWeight: '700', marginTop: 8 },
  tag: { alignSelf: 'flex-start', marginTop: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, backgroundColor: '#f1f5f9' },
  button: { marginTop: 12, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  buttonPrimary: { backgroundColor: '#0d9488' },
  buttonText: { color: '#fff', fontWeight: '600' },
});

