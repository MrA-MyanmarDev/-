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
  Alert,
  ActivityIndicator
} from 'react-native';
import * as Speech from 'expo-speech';

// OpenRouter သို့မဟုတ် Qwen API Key ထည့်ရန် (မထည့်ရသေးပါက Local Parser ဖြင့် အလိုအလျောက် အလုပ်လုပ်ပါမည်)
const QWEN_API_KEY = ""; 

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'ai', text: 'အာကာလင်းသစ် AI (Qwen Brain Online) အသင့်ရှိပါပြီ။ အမိန့်ပေးနိုင်ပါသည်။' }
  ]);
  const [inputText, setInputText] = useState('');
  const [torchStatus, setTorchStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // UI State Switcher (Generative Fullscreen UI)
  const [currentView, setCurrentView] = useState('MAIN'); // 'MAIN' | 'CALL_SCREEN'
  const [callTarget, setCallTarget] = useState('');

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

  const toggleTorch = (explicitState = null) => {
    const nextState = explicitState !== null ? explicitState : !torchStatus;
    setTorchStatus(nextState);
    const msg = nextState ? 'ဖုန်းမီး ဖွင့်လိုက်ပါပြီ။' : 'ဖုန်းမီး ပိတ်လိုက်ပါပြီ။';
    addAIMessage(msg);
    speakText(msg);
  };

  // Qwen AI Brain Function Calling Handler
  const callQwenAPI = async (userPrompt) => {
    setLoading(true);
    
    // API Key မရှိသေးပါက Local Fallback Rules ဖြင့် တိုက်ရိုက် ခွဲခြားခြင်း
    if (!QWEN_API_KEY) {
      setTimeout(() => {
        setLoading(false);
        if (userPrompt.includes('မီးဖွင့်') || userPrompt.toLowerCase().includes('torch on')) {
          toggleTorch(true);
        } else if (userPrompt.includes('မီးပိတ်') || userPrompt.toLowerCase().includes('torch off')) {
          toggleTorch(false);
        } else if (userPrompt.includes('ခေါ်') || userPrompt.toLowerCase().includes('call')) {
          const target = userPrompt.replace(/ခေါ်ပေး|ခေါ်ပါ|ဖုန်းခေါ်/g, '').trim() || 'မေသဉ္ဇာမင်း';
          setCallTarget(target);
          setCurrentView('CALL_SCREEN');
          const reply = `${target} ထံ သို့ ဖုန်းခေါ်ဆိုနေပါသည်...`;
          addAIMessage(reply);
          speakText(reply);
        } else {
          const reply = `အမိန့် "${userPrompt}" ကို လက်ခံရရှိပါပြီ။ (Qwen API Key ထည့်သွင်းပါက ပိုမိုစမတ်ကျကျ တုံ့ပြန်ပေးမည်ဖြစ်သည်)`;
          addAIMessage(reply);
          speakText(reply);
        }
      }, 800);
      return;
    }

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${QWEN_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "qwen/qwen-2.5-72b-instruct",
          messages: [
            {
              role: "system",
              content: `You are ArkarLinnThit Super AI core. Process user intent and respond strictly in JSON format:
              {
                "action": "TORCH_ON" | "TORCH_OFF" | "MAKE_CALL" | "CHAT",
                "target_name": "extracted name if MAKE_CALL else empty",
                "reply": "Myanmar language polite voice response"
              }`
            },
            { role: "user", content: userPrompt }
          ],
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      const parsed = JSON.parse(data.choices[0].message.content);

      if (parsed.action === 'TORCH_ON') toggleTorch(true);
      else if (parsed.action === 'TORCH_OFF') toggleTorch(false);
      else if (parsed.action === 'MAKE_CALL') {
        setCallTarget(parsed.target_name || 'Phone Contact');
        setCurrentView('CALL_SCREEN');
      }

      addAIMessage(parsed.reply);
      speakText(parsed.reply);

    } catch (err) {
      addAIMessage("Qwen API ချိတ်ဆက်ရာတွင် အမှားအယွင်းရှိနေပါသည်။");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userCmd = inputText.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userCmd }]);
    setInputText('');
    callQwenAPI(userCmd);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030712" />
      
      {/* Dynamic View Generation: Active Call Screen */}
      {currentView === 'CALL_SCREEN' ? (
        <View style={styles.fullScreenCall}>
          <Text style={styles.callBadge}>AI NEURAL CALL CONNECTED</Text>
          <Text style={styles.callTitle}>{callTarget}</Text>
          <Text style={styles.callStatus}>ခေါ်ဆိုနေသည် (Calling...) 00:05</Text>
          
          <View style={styles.callAvatarWrapper}>
            <Text style={{ fontSize: 40 }}>📞</Text>
          </View>

          <TouchableOpacity 
            style={styles.endCallBtn} 
            onPress={() => {
              setCurrentView('MAIN');
              speakText('ဖုန်းခေါ်ဆိုမှု ပြီးဆုံးပါပြီ');
            }}
          >
            <Text style={styles.endCallText}>📞 ဖုန်းပိတ်မည်</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Standard AI OS Desktop Interface */
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.appTitle}>✦ ARKAR LINN THIT AI ✦</Text>
            <View style={styles.statusBadge}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>Qwen Brain Active</Text>
            </View>
          </View>

          {/* Core Visualizer */}
          <View style={styles.coreWrapper}>
            <TouchableOpacity 
              style={styles.outerRing} 
              activeOpacity={0.8}
              onPress={() => speakText("အာကာလင်းသစ် AI စနစ် အလုပ်လုပ်နေပါသည်။")}
            >
              <View style={[styles.innerCore, torchStatus && styles.activeCore]}>
                {loading ? (
                  <ActivityIndicator color="#06b6d4" />
                ) : (
                  <Text style={styles.coreText}>AI</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Chat / Generative Log */}
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

          {/* Bottom Action Bar */}
          <View style={styles.bottomSection}>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => speakText("အသံဖြင့် အမိန့်ပေးရန် နားထောင်နေပါသည်")}>
                <Text style={styles.actionBtnText}>🎤 Voice</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionBtn, torchStatus && styles.activeActionBtn]} onPress={() => toggleTorch()}>
                <Text style={[styles.actionBtnText, torchStatus && { color: '#030712' }]}>
                  {torchStatus ? '🔦 Torch ON' : '🔦 Torch'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert("Camera", "Camera Preview Active")}>
                <Text style={styles.actionBtnText}>📷 Camera</Text>
              </TouchableOpacity>
            </View>

            {/* Input Line */}
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="အမိန့်ပေးပါ (ဥပမာ - မေသဉ္ဇာမင်းကို ခေါ်ပေး / မီးဖွင့်)..."
                placeholderTextColor="#4b5563"
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                <Text style={styles.sendBtnText}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030712', paddingHorizontal: 16 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 5 },
  appTitle: { color: '#06b6d4', fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981', marginRight: 6 },
  statusText: { color: '#10b981', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },

  coreWrapper: { alignItems: 'center', marginVertical: 10 },
  outerRing: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#06b6d4', justifyContent: 'center', alignItems: 'center' },
  innerCore: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(6, 182, 212, 0.2)', justifyContent: 'center', alignItems: 'center' },
  activeCore: { backgroundColor: 'rgba(16, 185, 129, 0.6)' },
  coreText: { color: '#06b6d4', fontWeight: 'bold', fontSize: 15 },

  chatContainer: { flex: 1, marginVertical: 5 },
  msgBubble: { padding: 12, borderRadius: 14, marginVertical: 4, maxWidth: '85%' },
  aiBubble: { backgroundColor: '#111827', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#1f2937' },
  userBubble: { backgroundColor: '#0284c7', alignSelf: 'flex-end' },
  msgText: { color: '#f3f4f6', fontSize: 14, lineHeight: 20 },

  bottomSection: { marginBottom: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  actionBtn: { flex: 1, backgroundColor: '#111827', paddingVertical: 10, borderRadius: 10, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: '#06b6d4' },
  activeActionBtn: { backgroundColor: '#06b6d4', borderColor: '#10b981' },
  actionBtnText: { color: '#06b6d4', fontSize: 13, fontWeight: 'bold' },

  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#111827', color: '#f3f4f6', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1f2937', fontSize: 13 },
  sendBtn: { backgroundColor: '#06b6d4', width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  sendBtnText: { color: '#030712', fontSize: 18, fontWeight: 'bold' },

  // Fullscreen Active Call Generative View Styles
  fullScreenCall: { flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 60, backgroundColor: '#050b14' },
  callBadge: { color: '#06b6d4', backgroundColor: 'rgba(6, 182, 212, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, fontSize: 10, borderWidth: 1, borderColor: '#06b6d4' },
  callTitle: { color: '#ffffff', fontSize: 26, fontWeight: 'bold', marginTop: 20 },
  callStatus: { color: '#10b981', fontSize: 13, marginTop: 5 },
  callAvatarWrapper: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#06b6d4' },
  endCallBtn: { backgroundColor: '#ef4444', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 30 },
  endCallText: { color: '#ffffff', fontWeight: 'bold', fontSize: 16 }
});
