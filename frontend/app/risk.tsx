import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RiskScreen() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ total: 0, safe: 0, danger: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('@scan_history');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
        
        // Calculate the statistics
        let safeCount = 0;
        let dangerCount = 0;
        
        parsedHistory.forEach(item => {
          if (item.safetyStatus === 'SAFE') safeCount++;
          if (item.safetyStatus === 'DANGER') dangerCount++;
        });

        setStats({
          total: parsedHistory.length,
          safe: safeCount,
          danger: dangerCount
        });
      }
    } catch (e) {
      console.error("Failed to load history for Risk Report", e);
    }
  };

  // Filter history to only show the dangerous ones for the Threat Log
  const threats = history.filter(item => item.safetyStatus === 'DANGER');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.inner}>
      
      {/* TOP NAVIGATION */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <MaterialCommunityIcons name="arrow-left" size={20} color="#33cc33" />
        <Text style={styles.backText}>Dashboard</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <MaterialCommunityIcons name="shield-alert-outline" size={48} color="#33cc33" style={{marginBottom: 10}} />
        <Text style={styles.title}>Risk Report</Text>
        <Text style={styles.subtitle}>Your local device security statistics</Text>
      </View>

      {/* STATISTICS GRID */}
      <View style={styles.statsContainer}>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total Scans</Text>
        </View>

        <View style={[styles.statCard, { borderColor: '#00ffcc', borderWidth: 1 }]}>
          <Text style={[styles.statNumber, { color: '#00ffcc' }]}>{stats.safe}</Text>
          <Text style={styles.statLabel}>Safe Links</Text>
        </View>

        <View style={[styles.statCard, { borderColor: '#ff3366', borderWidth: 1 }]}>
          <Text style={[styles.statNumber, { color: '#ff3366' }]}>{stats.danger}</Text>
          <Text style={styles.statLabel}>Threats Blocked</Text>
        </View>

      </View>

      {/* THREAT LOG */}
      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Detected Threats Log</Text>
        
        {threats.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="shield-check" size={40} color="#00ffcc" />
            <Text style={styles.emptyText}>No malicious links detected yet.</Text>
          </View>
        ) : (
          threats.map((item) => (
            <View key={item.id} style={styles.threatCard}>
              <View style={styles.threatHeader}>
                <MaterialCommunityIcons name="skull-outline" size={20} color="#ff3366" />
                <Text style={styles.threatTime}>{item.timestamp}</Text>
              </View>
              <Text style={styles.threatUrl} numberOfLines={2}>{item.original}</Text>
              {item.threats && item.threats.length > 0 && (
                <Text style={styles.threatType}>Type: {item.threats.join(', ')}</Text>
              )}
            </View>
          ))
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  inner: { padding: 20, paddingTop: 50, paddingBottom: 40 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, alignSelf: 'flex-start' },
  backText: { color: '#33cc33', fontSize: 16, marginLeft: 5, fontWeight: 'bold' },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#888888' },
  
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  statCard: { width: '31%', backgroundColor: '#16161a', paddingVertical: 20, borderRadius: 12, alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  statLabel: { fontSize: 11, color: '#888', textTransform: 'uppercase', textAlign: 'center' },

  logContainer: { marginTop: 10 },
  logTitle: { fontSize: 18, color: '#fff', fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#222', paddingBottom: 10, marginBottom: 15 },
  
  emptyState: { alignItems: 'center', paddingVertical: 40, backgroundColor: '#16161a', borderRadius: 12, borderWidth: 1, borderColor: '#222' },
  emptyText: { color: '#888', marginTop: 10 },

  threatCard: { backgroundColor: '#16161a', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#ff3366', marginBottom: 12 },
  threatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  threatTime: { color: '#888', fontSize: 12 },
  threatUrl: { color: '#fff', fontSize: 14, marginBottom: 8 },
  threatType: { color: '#ff3366', fontSize: 12, fontWeight: 'bold' }
});