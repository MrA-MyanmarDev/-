import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ARKAR LINN THIT AI</Text>
      
      {/* Dynamic Content Area (For Qwen Model Responses later) */}
      <View style={styles.dynamicArea}>
        <Text style={styles.statusText}>System Online. Ready for command...</Text>
      </View>

      {/* Inputs and Controls */}
      <TextInput 
        style={styles.input} 
        placeholder="Command ရိုက်ထည့်ရန်..." 
        placeholderTextColor="#666" 
      />
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>🎤 Voice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>🔦 Torch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>📷 Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20, justifyContent: 'space-between' },
  title: { color: '#00ffcc', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginTop: 40 },
  dynamicArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  statusText: { color: '#00ffcc', fontSize: 16, fontStyle: 'italic' },
  input: { backgroundColor: '#111', color: '#00ffcc', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#00ffcc', marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { backgroundColor: '#003322', padding: 15, borderRadius: 10, flex: 1, marginHorizontal: 5, alignItems: 'center', borderWidth: 1, borderColor: '#00ffcc' },
  btnText: { color: '#00ffcc', fontWeight: 'bold' }
});
