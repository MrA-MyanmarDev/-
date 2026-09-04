import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as Speech from 'expo-speech';

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'အာကာလင်းသစ် AI စနစ် အဆင်သင့်ဖြစ်ပါပြီ။ အမိန့်ပေးနိုင်ပါသည်။' }
  ]);
  const [inputText, setInputText] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  const toggleTorch = () => {
    const nextState = !torchOn;
    setTorchOn(nextState);
    const statusMsg = nextState ? 'ဖုန်းမီး ဖွင့်လိုက်ပါပြီ။' : 'ဖုန်းမီး ပိတ်လိုက်ပါပြီ။';
    speakText(statusMsg);
    addAIMessage(statusMsg);
  };

  const speakText = (text) => {
    Speech.speak(text, { language: 'my-MM' });
  };

  const addAIMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text }]);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userCmd = inputText.trim();
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userCmd }]);
    setInputText('');

    // Native Command Parser
    if (userCmd.includes('မီးဖွင့်') || userCmd.toLowerCase().includes('torch on')) {
      setTorchOn(true);
      addAIMessage('ဖုန်းမီး ဖွင့်ပေးလိုက်ပါပြီ။');
      speakText('ဖုန်းမီး ဖွင့်ပေးလိုက်ပါပြီ');
    } else if (userCmd.includes('မီးပိတ်') || userCmd.toLowerCase().includes('torch off')) {
      setTorchOn(false);
      addAIMessage('ဖုန်းမီး ပိတ်ပေးလိုက်ပါပြီ။');
      speakText('ဖုန်းမီး ပိတ်ပေးလိုက်ပါပြီ');
    } else {
      addAIMessage(`အမိန့် "${userCmd}" ကို လက်ခံရရှိပါပြီ။ Qwen AI Model သို့ ချိတ်ဆက် လုပ်ဆောင်ပါမည်။`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050b14" />
      
      {/* Hidden Camera Component to handle Torch */}
      {hasCameraPermission && (
        <Camera 
          style={{ width: 1, height: 1, opacity: 0 }} 
          flashMode={torchOn ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off} 
        />
      )}

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>ARKAR LINN THIT AI</Text>
        <View style={styles.statusBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.statusText}>JARVIS CORE ONLINE</Text>
        </View>
      </View>

      {/* Glowing AI Core Visualizer */}
      <View style={styles.coreContainer}>
        <TouchableOpacity onPress={() => speakText("အာကာလင်းသစ် AI စနစ် အလုပ်လုပ်နေပါသည်။")} style={styles.outerRing}>
          <View style={[styles.innerCore, torchOn && styles.activeCore]}>
            <Text style={styles.coreText}>AI</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Chat Log */}
      <ScrollView style={styles.chatContainer} contentContainerStyle={{ paddingVertical: 10 }}>
        {messages.map((item) => (
          <View key={item.id} style={[styles.msgBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Controls */}
      <View style={styles.bottomSection}>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => speakText("အသံဖြင့် အမိန့်ပေးရန် ပြင်ဆင်နေပါသည်")}>
            <Text style={styles.actionBtnText}>🎤 Voice</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, torchOn && styles.activeActionBtn]} onPress={toggleTorch}>
            <Text style={[styles.actionBtnText, torchOn && { color: '#050b14' }]}>{torchOn ? '🔦 Torch ON' : '🔦 Torch'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert("Camera", "Camera Preview Mode Active")}>
            <Text style={styles.actionBtnText}>📷 Camera</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Command ရိုက်ထည့်ပါ (ဥပမာ - မီးဖွင့်)..."
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
  activeCore: { backgroundColor: 'rgba(0,255,136,0.6)' },
  coreText: { color: '#00f2fe', fontWeight: 'bold', fontSize: 14 },

  chatContainer: { flex: 1, marginVertical: 5 },
  msgBubble: { padding: 12, borderRadius: 12, marginVertical: 4, maxWidth: '85%' },
  aiBubble: { backgroundColor: '#0e1e38', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#1c3d5a' },
  userBubble: { backgroundColor: '#005c8a', alignSelf: 'flex-end' },
  msgText: { color: '#e0f7fa', fontSize: 14, lineHeight: 20 },

  bottomSection: { marginBottom: 15 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  actionBtn: { flex: 1, backgroundColor: '#0c1a2b', paddingVertical: 10, borderRadius: 8, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: '#00f2fe' },
  activeActionBtn: { backgroundColor: '#00f2fe', borderColor: '#00ff88' },
  actionBtnText: { color: '#00f2fe', fontSize: 13, fontWeight: '600' },

  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#0c1a2b', color: '#e0f7fa', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: '#1c3d5a', fontSize: 14 },
  sendBtn: { backgroundColor: '#00f2fe', width: 48, height: 48, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  sendBtnText: { color: '#050b14', fontSize: 18, fontWeight: 'bold' }
});
