import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Built into Expo

export default function Dashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>LinkReveal Dashboard</Text>
      
      {/* Banner Area */}
      <View style={styles.bannerContainer}>
        <MaterialCommunityIcons name="shield-search" size={50} color="#00ffcc" />
        <Text style={styles.bannerText}>https://secure-site.com/login</Text>
        <Text style={styles.bannerSubtext}>AI Threat Analysis Engine Active</Text>
      </View>

      {/* 2x2 Grid container */}
      <View style={styles.grid}>
        
        {/* Module 1: Analyze */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/analyze')}>
          <MaterialCommunityIcons name="magnify-scan" size={32} color="#00ffcc" style={styles.icon} />
          <Text style={styles.cardTitle}>Analyze URL</Text>
          <Text style={styles.cardSub}>Analyze a new URL link</Text>
        </TouchableOpacity>

        {/* Module 2: Scanner */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/scanner')}>
          <MaterialCommunityIcons name="vector-polyline" size={32} color="#ff3366" style={styles.icon} />
          <Text style={styles.cardTitle}>Scanner</Text>
          <Text style={styles.cardSub}>Check redirect chains</Text>
        </TouchableOpacity>

        {/* Module 3: Domain Info */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/domain')}>
          <MaterialCommunityIcons name="web" size={32} color="#ffcc00" style={styles.icon} />
          <Text style={styles.cardTitle}>Domain Info</Text>
          <Text style={styles.cardSub}>Domain reputation check</Text>
        </TouchableOpacity>

        {/* Module 4: Risk Report */}
        <TouchableOpacity style={styles.card} onPress={() => router.push('/risk')}>
          <MaterialCommunityIcons name="shield-alert-outline" size={32} color="#33cc33" style={styles.icon} />
          <Text style={styles.cardTitle}>Risk Report</Text>
          <Text style={styles.cardSub}>View latest security report</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#0a0a0a', // Deep dark mode background
    paddingTop: 60 
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#bb86fc', // Purple accent from your screenshot
    marginBottom: 20 
  },
  bannerContainer: { 
    width: '100%', 
    height: 160, 
    backgroundColor: '#1e1e2e',
    borderRadius: 15, 
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  bannerText: { color: '#00ffcc', fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  bannerSubtext: { color: '#aaaaaa', fontSize: 12, marginTop: 5 },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  card: { 
    width: '48%', 
    backgroundColor: '#16161a', 
    padding: 15, 
    borderRadius: 15, 
    marginBottom: 15,
    minHeight: 130,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#222'
  },
  icon: { marginBottom: 10 },
  cardTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  cardSub: { color: '#888888', fontSize: 11, lineHeight: 16 }
});