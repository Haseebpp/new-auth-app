import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SupportScreen() {
  const faq = [
    { q: 'Delivery times & service windows', a: 'Pickup within 2 hours and delivery under 24 hours. Express may apply.' },
    { q: 'Rewash policy', a: 'Unhappy within 48h? We’ll rewash free. Terms apply.' },
    { q: 'Refunds & wallet credits', a: 'SLA breaches credit your wallet automatically.' },
    { q: 'Payments & receipts', a: 'Apple Pay, Mada, and wallet. Receipts emailed and in orders.' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Support & Help</Text>
      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.secondary]}> 
          <FontAwesome name="comment" size={16} />
          <Text style={styles.buttonLabel}>Chat</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.outline]}> 
          <FontAwesome name="whatsapp" size={16} color="#22c55e" />
          <Text style={styles.buttonDarkLabel}>WhatsApp</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.primary]}> 
          <FontAwesome name="phone" size={16} color="#fff" />
          <Text style={styles.buttonLightLabel}>Call</Text>
        </Pressable>
      </View>

      <View style={{ gap: 8 }}>
        {faq.map((item, i) => (
          <View key={i} style={styles.card}>
            <Text style={styles.cardTitle}>{item.q}</Text>
            <Text style={styles.cardDesc}>{item.a}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  actions: { flexDirection: 'row', gap: 8 },
  button: { flexDirection: 'row', gap: 8, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12 },
  primary: { backgroundColor: '#0d9488' },
  secondary: { backgroundColor: '#e2e8f0' },
  outline: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0' },
  buttonLabel: { color: '#0f172a', fontWeight: '600' },
  buttonDarkLabel: { color: '#0f172a', fontWeight: '600' },
  buttonLightLabel: { color: '#fff', fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  cardDesc: { color: '#475569', marginTop: 4 },
});

