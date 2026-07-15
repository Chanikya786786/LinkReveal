import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function ScannerScreen() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [traceResult, setTraceResult] = useState(null);

  const BACKEND_URL = 'https://linkreveal-core-engine.onrender.com';

  const handleTrace = async () => {
    setError('');
    setTraceResult(null);

    if (!url.trim()) {
      setError('Please enter a URL to trace.');
      return;
    }

    let target = url.trim();
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/trace`, { targetUrl: target });
      setTraceResult(res.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
        if (err.response.data.partialChain) {
           // Show whatever hops we managed to trace before it failed
           setTraceResult({ chain: err.response.data.partialChain, error: true });
        }
      } else {
        setError('Network error. Ensure your backend is reachable.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return '#00ffcc'; // Green/Cyan for OK
    if (status >= 300 && status < 400) return '#ffcc00'; // Yellow for Redirect
    return '#ff3366'; // Red for errors/404s
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        
        {/* TOP NAVIGATION */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#ff3366" />
          <Text style={styles.backText}>Dashboard</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <MaterialCommunityIcons name="vector-polyline" size={48} color="#ff3366" style={{marginBottom: 10}} />
          <Text style={styles.title}>Redirect Scanner</Text>
          <Text style={styles.subtitle}>Map the exact routing path of a link</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter a shortlink (e.g., bit.ly/...)"
            placeholderTextColor="#666"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleTrace} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#0a0a0a" /> : <Text style={styles.buttonText}>Trace Path</Text>}
          </TouchableOpacity>
        </View>

        {/* TRACE TIMELINE RESULTS */}
        {traceResult && traceResult.chain && (
          <View style={styles.timelineContainer}>
            <Text style={styles.timelineHeader}>Routing Path ({traceResult.chain.length} Hops)</Text>
            
            {traceResult.chain.map((hop, index) => {
              const isLast = index === traceResult.chain.length - 1;
              return (
                <View key={index} style={styles.hopRow}>
                  
                  {/* Vertical Line & Dot */}
                  <View style={styles.nodeColumn}>
                    <View style={[styles.dot, { backgroundColor: getStatusColor(hop.status) }]} />
                    {!isLast && <View style={styles.line} />}
                  </View>

                  {/* Hop Details */}
                  <View style={styles.hopCard}>
                    <View style={styles.hopHeader}>
                      <Text style={styles.hopStep}>Hop {hop.step}</Text>
                      <Text style={[styles.hopStatus, { color: getStatusColor(hop.status) }]}>
                        HTTP {hop.status}
                      </Text>
                    </View>
                    <Text style={styles.hopUrl} selectable={true}>{hop.url}</Text>
                  </View>
                  
                </View>
              );
            })}
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
  backText: { color: '#ff3366', fontSize: 16, marginLeft: 5, fontWeight: 'bold' },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#888888', textAlign: 'center' },
  inputContainer: { width: '100%', marginBottom: 20 },
  input: { backgroundColor: '#16161a', color: '#FFFFFF', borderWidth: 1, borderColor: '#333', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 8 },
  errorText: { color: '#ff3366', fontSize: 14, marginBottom: 12, marginLeft: 4 },
  button: { backgroundColor: '#ff3366', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  
  timelineContainer: { marginTop: 20, paddingBottom: 40 },
  timelineHeader: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#222', paddingBottom: 10 },
  hopRow: { flexDirection: 'row', minHeight: 80 },
  nodeColumn: { width: 30, alignItems: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7, zIndex: 2, marginTop: 15 },
  line: { width: 2, flex: 1, backgroundColor: '#333', marginTop: -5, marginBottom: -15 },
  hopCard: { flex: 1, backgroundColor: '#16161a', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#222', marginBottom: 15, marginLeft: 10 },
  hopHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  hopStep: { color: '#888', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  hopStatus: { fontSize: 12, fontWeight: 'bold' },
  hopUrl: { color: '#fff', fontSize: 14, lineHeight: 20 },
});