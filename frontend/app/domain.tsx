import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DomainScreen() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [domainData, setDomainData] = useState(null);

  const BACKEND_URL = 'https://linkreveal-core-engine.onrender.com';

  const handleLookup = async () => {
    setError('');
    setDomainData(null);

    if (!url.trim()) {
      setError('Please enter a website URL or domain.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(`${BACKEND_URL}/api/domain`, { targetUrl: url.trim() });
      setDomainData(res.data);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Network error. Ensure your backend is reachable.');
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
          <MaterialCommunityIcons name="arrow-left" size={20} color="#ffcc00" />
          <Text style={styles.backText}>Dashboard</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <MaterialCommunityIcons name="web" size={48} color="#ffcc00" style={{marginBottom: 10}} />
          <Text style={styles.title}>Domain Intelligence</Text>
          <Text style={styles.subtitle}>Extract server and geolocation data</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter domain (e.g., amazon.com)"
            placeholderTextColor="#666"
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleLookup} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#0a0a0a" /> : <Text style={styles.buttonText}>Lookup Domain</Text>}
          </TouchableOpacity>
        </View>

        {/* DOMAIN DATA RESULTS */}
        {domainData && (
          <View style={styles.resultsContainer}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>{domainData.domain}</Text>
            </View>

            <View style={styles.grid}>
              
              <View style={styles.dataCard}>
                <MaterialCommunityIcons name="server-network" size={24} color="#ffcc00" />
                <Text style={styles.dataLabel}>IP Address</Text>
                <Text style={styles.dataValue} selectable={true}>{domainData.ip}</Text>
              </View>

              <View style={styles.dataCard}>
                <MaterialCommunityIcons name="office-building" size={24} color="#ffcc00" />
                <Text style={styles.dataLabel}>ISP / Host</Text>
                <Text style={styles.dataValue}>{domainData.isp}</Text>
              </View>

              <View style={styles.dataCard}>
                <MaterialCommunityIcons name="domain" size={24} color="#ffcc00" />
                <Text style={styles.dataLabel}>Organization</Text>
                <Text style={styles.dataValue}>{domainData.organization}</Text>
              </View>

              <View style={styles.dataCard}>
                <MaterialCommunityIcons name="map-marker-radius" size={24} color="#ffcc00" />
                <Text style={styles.dataLabel}>Location</Text>
                <Text style={styles.dataValue}>{domainData.city}, {domainData.country}</Text>
              </View>

            </View>
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
  backText: { color: '#ffcc00', fontSize: 16, marginLeft: 5, fontWeight: 'bold' },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#888888', textAlign: 'center' },
  inputContainer: { width: '100%', marginBottom: 20 },
  input: { backgroundColor: '#16161a', color: '#FFFFFF', borderWidth: 1, borderColor: '#333', borderRadius: 12, padding: 16, fontSize: 16, marginBottom: 8 },
  errorText: { color: '#ff3366', fontSize: 14, marginBottom: 12, marginLeft: 4 },
  button: { backgroundColor: '#ffcc00', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#0a0a0a', fontSize: 16, fontWeight: 'bold' },
  
  resultsContainer: { marginTop: 10, paddingBottom: 40 },
  resultHeader: { backgroundColor: '#16161a', padding: 15, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderWidth: 1, borderColor: '#333', borderBottomWidth: 0, alignItems: 'center' },
  resultTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  dataCard: { width: '48%', backgroundColor: '#16161a', padding: 15, marginBottom: 15, borderRadius: 12, borderWidth: 1, borderColor: '#333', alignItems: 'center', minHeight: 110, justifyContent: 'center' },
  dataLabel: { color: '#888', fontSize: 12, textTransform: 'uppercase', marginTop: 8, marginBottom: 4, fontWeight: 'bold' },
  dataValue: { color: '#fff', fontSize: 13, textAlign: 'center' },
});