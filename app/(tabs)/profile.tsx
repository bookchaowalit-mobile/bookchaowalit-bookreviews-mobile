import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={48} color="#e94560" />
      </View>
      <Text style={styles.name}>BookEverything</Text>
      <Text style={styles.subtitle}>Track your reading journey</Text>
      <View style={styles.features}>
        {['Track books you are reading', 'Rate and review completed books', 'View reading statistics', 'Set reading goals', 'Add personal notes'].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={20} color="#2a9d8f" />
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>
      <View style={styles.version}>
        <Text style={styles.versionText}>BookEverything v1.0.0</Text>
        <Text style={styles.versionSub}>Built with Expo + React Native</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a2e', paddingTop: 80, paddingHorizontal: 20, alignItems: 'center' },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#16213e', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  name: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#888', fontSize: 16, marginTop: 4 },
  features: { marginTop: 32, width: '100%', backgroundColor: '#16213e', borderRadius: 16, padding: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  featureText: { color: '#ccc', fontSize: 16 },
  version: { marginTop: 40, alignItems: 'center' },
  versionText: { color: '#555', fontSize: 14 },
  versionSub: { color: '#444', fontSize: 12, marginTop: 4 },
});
