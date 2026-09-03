import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'အာကာလင်းသစ် AI စနစ် အဆင်သင့်ဖြစ်ပါပြီ။ အမိန့်ပေးနိုင်ပါသည်။' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: inputText }]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050b14" />
      
      {/* Header with AI Status */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>ARKAR LINN THIT AI</Text>
        <View style={styles.statusBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.statusText}>JARVIS CORE ONLINE</Text>
        </View>
      </View>

      {/* Glowing AI Core Visualizer */}
      <View style={styles.coreContainer}>
        <View style={styles.outerRing}>
          <View style={styles.innerCore}>
            <Text style={styles.coreText}>AI</Text>
          </View>
        </View>
      </View>

      {/* Dynamic Chat & Response View */}
      <ScrollView style={styles.chatContainer} contentContainerStyle={{ paddingVertical: 10 }}>
        {messages.map((item) => (
          <View key={item.id} style={[styles.msgBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Controls Section */}
      <View style={styles.bottomSection}>
        {/* Quick Phone Controls */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>🎤 Voice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>🔦 Torch</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>📷 Camera</Text>
          </TouchableOpacity>
        </View>

        {/* Input Bar with Send Button */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Command ရိုက်ထည့်ပါ..."
            placeholderTextColor="#4a6572"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendBtnText}>➤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050b14', paddingHorizontal: 16 },
  header: { alignItems: 'center', marginTop: 35, marginBottom: 5 },
  appTitle: { color: '#00f2fe', fontSize: 20, fontWeight: 'bold', letterSpacing: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00ff88', marginRight: 6 },
  statusText: { color: '#00ff88', fontSize: 11, fontWeight: '600', letterSpacing: 1 },
  
  coreContainer: { alignItems: 'center', marginVertical: 10 },
  outerRing: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#00f2fe', justifyContent: 'center', alignItems: 'center' },
  innerCore: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,242,254,0.15)', justifyContent: 'center', alignItems: 'center' },
  coreText: { color: '#00f2fe', fontWeight: 'bold', fontSize: 14 },

  chatContainer: { flex: 1, marginVertical: 5 },
  msgBubble: { padding: 12, borderRadius: 12, marginVertical: 4, maxWidth: '85%' },
  aiBubble: { backgroundColor: '#0e1e38', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#1c3d5a' },
  userBubble: { backgroundColor: '#005c8a', alignSelf: 'flex-end' },
  msgText: { color: '#e0f7fa', fontSize: 14, lineHeight: 20 },

  bottomSection: { marginBottom: 15 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  actionBtn: { flex: 1, backgroundColor: '#0c1a2b', paddingVertical: 10, borderRadius: 8, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: '#00f2fe' },
  actionBtnText: { color: '#00f2fe', fontSize: 13, fontWeight: '600' },

  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#0c1a2b', color: '#e0f7fa', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#1c3d5a', fontSize: 14 },
  sendBtn: { backgroundColor: '#00f2fe', width: 48, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  sendBtnText: { color: '#050b14', fontSize: 18, fontWeight: 'bold' }
});
