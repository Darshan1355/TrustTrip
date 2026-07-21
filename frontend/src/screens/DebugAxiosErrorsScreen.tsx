import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import AxiosErrorLogger from '../utils/axiosErrorLogger';

export default function DebugAxiosErrorsScreen() {
  const [errors, setErrors] = useState(AxiosErrorLogger.getErrors());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsub = AxiosErrorLogger.subscribe((logs) => setErrors(logs.slice().reverse()));
    setErrors(AxiosErrorLogger.getErrors());
    return unsub;
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setErrors(AxiosErrorLogger.getErrors());
    setRefreshing(false);
  };

  const clear = () => {
    AxiosErrorLogger.clearErrors();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.ts}>{item.ts}</Text>
      <Text style={styles.type}>{item.type || 'unknown'}</Text>
      {item.status ? <Text style={styles.status}>Status: {item.status}</Text> : null}
      {item.message ? <Text>Message: {String(item.message)}</Text> : null}
      {item.data ? <Text numberOfLines={6}>Data: {JSON.stringify(item.data)}</Text> : null}
      {item.config ? <Text numberOfLines={3}>URL: {item.config.method?.toUpperCase()} {item.config.url}</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Axios Error Log</Text>
        <TouchableOpacity onPress={clear} style={styles.clearBtn}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={errors}
        keyExtractor={(item, idx) => item.ts + idx}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No errors logged.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontSize: 18, fontWeight: '700' },
  clearBtn: { padding: 8 },
  clearText: { color: '#e11d48', fontWeight: '700' },
  card: { borderWidth: 1, borderColor: '#e5e7eb', padding: 10, borderRadius: 6, marginBottom: 8 },
  ts: { fontSize: 12, color: '#6b7280' },
  type: { fontWeight: '700', marginTop: 4 },
  status: { color: '#374151', marginTop: 4 },
  empty: { marginTop: 40, textAlign: 'center', color: '#6b7280' },
});
