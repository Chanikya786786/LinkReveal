import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AnalyzeScreen() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]); 

  const BACKEND_URL = 'https://linkreveal-core-engine.onrender.com';

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('@scan_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  const saveToHistory = async (newReport) => {
    try {
      const updatedHistory = [newReport, ...history].slice(0, 10);
      setHistory(updatedHistory);
      await AsyncStorage.setItem('@scan_history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('@scan_history');
      setHistory([]);
    } catch (e) {
      console.error("Failed to clear history", e);
    }
  };

  const handleScan = async () => {
    setError('');
    setReport(null);

    if (!url.trim()) {
      setError('Please enter a URL.');
      return;
    }

    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(url.trim())) {
      setError('Invalid format. Please enter a real URL.');
      return;
    }

    let target = url.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }

    setIsLoading(true);

    try {
      const expandRes = await axios.post(`${BACKEND_URL}/api/expand`, { shortUrl: target });
      const finalUrl = expandRes.data.expandedUrl;

      const analyzeRes = await axios.post(`${BACKEND_URL}/api/analyze`, { targetUrl: finalUrl });
      
      const newReport = {
        id: Date.now().toString(),
        original: target,
        expanded: finalUrl,
        safetyStatus: analyzeRes.data.status,
        threats: analyzeRes.data.threats || [],
        timestamp: new Date().toLocaleTimeString()
      };

      setReport(newReport);
      saveToHistory(newReport);

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error + ": " + (err.response.data.message || ''));
      } else {
        setError('Network error. Ensure your backend is running.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        
        {/* TOP NAVIGATION */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#00ffcc" />
          <Text style={styles.backText}>Dashboard</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <MaterialCommunityIcons name="magnify-scan" size={48} color="#00ffcc" style={{marginBottom: 10}} />
          <Text style={styles.title}>Analyze URL</Text>
          <Text style={styles.subtitle}>Deep scan any suspicious link</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Paste a link to scan..."
            placeholderTextColor="#666"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleScan} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#0a0a0a" /> : <Text style={styles.buttonText}>Scan Link</Text>}
          </TouchableOpacity>
        </View>

        {/* CURRENT SCAN REPORT */}
        {report && (
          <View style={[styles.reportCard, { borderColor: report.safetyStatus === 'SAFE' ? '#00ffcc' : '#ff3366' }]}>
            <Text style={styles.reportTitle}>Security Report</Text>
            <View style={styles.reportRow}>
              <Text style={styles.reportLabel}>Status:</Text>
              <Text style={[styles.reportValue, { color: report.safetyStatus === 'SAFE' ? '#00ffcc' : '#ff3366', fontWeight: 'bold' }]}>
                {report.safetyStatus}
              </Text>
            </View>
            <View style={styles.reportRow}>
              <Text style={styles.reportLabel}>Destination:</Text>
              <Text style={styles.reportValue}>{report.expanded}</Text>
            </View>
            {report.safetyStatus === 'DANGER' && (
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Threats:</Text>
                <Text style={[styles.reportValue, { color: '#ff3366' }]}>{report.threats.join(', ')}</Text>
              </View>
            )}
          </View>
        )}

        {/* RECENT SCANS HISTORY */}
        {history.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Recent Scans</Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            {history.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyLeft}>
                  <Text style={styles.historyOriginal} numberOfLines={1}>{item.original}</Text>
                  <Text style={styles.historyTime}>{item.timestamp}</Text>
                </View>
                <Text style={[styles.historyStatus, { color: item.safetyStatus === 'SAFE' ? '#00ffcc' : '#ff3366' }]}>
                  {item.safetyStatus}
                </Text>
              </View>
            ))}
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  inner: { flexGrow: 1, padding: 20, paddingTop: 50 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, alignSelf: 'flex-start' },
  backText: { color: '#00ffcc', fontSize: 16, marginLeft: 5, fontWeight: 'bold' },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#888888' },
  inputContainer: { width: '100%', marginBottom: 20 },
  input: { backgroundColor: '#16161a', color: '#FFFFFF', borderWidth: 1, borderColor: '#333', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 8 },
  errorText: { color: '#ff3366', fontSize: 14, marginBottom: 12, marginLeft: 4 },
  button: { backgroundColor: '#00ffcc', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#0a0a0a', fontSize: 16, fontWeight: 'bold' },
  reportCard: { backgroundColor: '#16161a', padding: 20, borderRadius: 12, borderWidth: 1, marginTop: 10 },
  reportTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 10 },
  reportRow: { marginBottom: 12 },
  reportLabel: { color: '#888', fontSize: 12, marginBottom: 2, textTransform: 'uppercase' },
  reportValue: { color: '#FFF', fontSize: 15 },
  historySection: { marginTop: 40, borderTopWidth: 1, borderTopColor: '#222', paddingTop: 20 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  historyTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  clearText: { color: '#ff3366', fontSize: 14 },
  historyItem: { backgroundColor: '#16161a', padding: 15, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#222' },
  historyLeft: { flex: 1, marginRight: 10 },
  historyOriginal: { color: '#FFF', fontSize: 14, marginBottom: 4 },
  historyTime: { color: '#666', fontSize: 12 },
  historyStatus: { fontWeight: 'bold', fontSize: 14 },
});