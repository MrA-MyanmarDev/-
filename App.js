import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  Alert 
} from 'react-native';
import * as Speech from 'expo-speech';

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'ai', text: 'အာကာလင်းသစ် AI (JARVIS System) အသင့်ရှိပါပြီ။ အမိန့်ပေးနိုင်ပါသည်။' }
  ]);
  const [inputText, setInputText] = useState('');
  const [torchStatus, setTorchStatus] = useState(false);

  const speakText = (text) => {
    try {
      Speech.speak(text, { language: 'my-MM' });
    } catch (e) {
      console.log('Speech error:', e);
    }
  };

  const addAIMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text }]);
  };

  const toggleTorch = () => {
    const nextState = !torchStatus;
    setTorchStatus(nextState);
    const msg = nextState ? 'ဖုန်းမီး ဖွင့်လိုက်ပါပြီ။' : 'ဖုန်းမီး ပိတ်လိုက်ပါပြီ။';
    addAIMessage(msg);
    speakText(msg);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userCmd = inputText.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userCmd }]);
    setInputText('');

    if (userCmd.includes('မီးဖွင့်') || userCmd.toLowerCase().includes('torch on')) {
      setTorchStatus(true);
      addAIMessage('ဖုန်းမီး ဖွင့်ပေးလိုက်ပါပြီ။');
      speakText('ဖုန်းမီး ဖွင့်ပေးလိုက်ပါပြီ');
    } else if (userCmd.includes('မီးပိတ်') || userCmd.toLowerCase().includes('torch off')) {
      setTorchStatus(false);
      addAIMessage('ဖုန်းမီး ပိတ်ပေးလိုက်ပါပြီ။');
      speakText('ဖုန်းမီး ပိတ်ပေးလိုက်ပါပြီ');
    } else {
      addAIMessage(`အမိန့် "${userCmd}" အတွက် Qwen AI Brain သို့ ချိတ်ဆက်လုပ်ဆောင်နေပါသည်။`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>✦ ARKAR LINN THIT AI ✦</Text>
        <View style={styles.statusBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.statusText}>SYSTEM ONLINE</Text>
        </View>
      </View>

      {/* AI Visualizer Core */}
      <View style={styles.coreWrapper}>
        <TouchableOpacity 
          style={styles.outerRing} 
          activeOpacity={0.8}
          onPress={() => speakText("အာကာလင်းသစ် AI စနစ် အလုပ်လုပ်နေပါသည်။")}
        >
          <View style={[styles.innerCore, torchStatus && styles.activeCore]}>
            <Text style={styles.coreText}>AI</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <ScrollView 
        style={styles.chatContainer} 
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((item) => (
          <View 
            key={item.id} 
            style={[styles.msgBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}
          >
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.bottomSection}>
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => speakText("အသံဖြင့် အမိန့်ပေးရန် နားထောင်နေပါသည်")}
          >
            <Text style={styles.actionBtnText}>🎤 Voice</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn, torchStatus && styles.activeActionBtn]} 
            onPress={toggleTorch}
          >
            <Text style={[styles.actionBtnText, torchStatus && { color: '#030712' }]}>
              {torchStatus ? '🔦 Torch ON' : '🔦 Torch'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => Alert.alert("Camera", "Camera Module Ready")}
          >
            <Text style={styles.actionBtnText}>📷 Camera</Text>
          </TouchableOpacity>
        </View>

        {/* Command Input Bar */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="အမိန့်ပေးရန် ရိုက်ထည့်ပါ..."
            placeholderTextColor="#4b5563"
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
  container: { flex: 1, backgroundColor: '#030712', paddingHorizontal: 16 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 10 },
  appTitle: { color: '#06b6d4', fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', marginRight: 6 },
  statusText: { color: '#10b981', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },

  coreWrapper: { alignItems: 'center', marginVertical: 15 },
  outerRing: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#06b6d4', justifyContent: 'center', alignItems: 'center' },
  innerCore: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(6, 182, 212, 0.2)', justifyContent: 'center', alignItems: 'center' },
  activeCore: { backgroundColor: 'rgba(16, 185, 129, 0.6)' },
  coreText: { color: '#06b6d4', fontWeight: 'bold', fontSize: 16 },

  chatContainer: { flex: 1, marginVertical: 5 },
  msgBubble: { padding: 12, borderRadius: 14, marginVertical: 4, maxWidth: '85%' },
  aiBubble: { backgroundColor: '#111827', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#1f2937' },
  userBubble: { backgroundColor: '#0284c7', alignSelf: 'flex-end' },
  msgText: { color: '#f3f4f6', fontSize: 14, lineHeight: 20 },

  bottomSection: { marginBottom: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  actionBtn: { flex: 1, backgroundColor: '#111827', paddingVertical: 12, borderRadius: 10, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: '#06b6d4' },
  activeActionBtn: { backgroundColor: '#06b6d4', borderColor: '#10b981' },
  actionBtnText: { color: '#06b6d4', fontSize: 13, fontWeight: 'bold' },

  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#111827', color: '#f3f4f6', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1f2937', fontSize: 14 },
  sendBtn: { backgroundColor: '#06b6d4', width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  sendBtnText: { color: '#030712', fontSize: 18, fontWeight: 'bold' }
});
