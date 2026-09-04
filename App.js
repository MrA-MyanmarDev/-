import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, 
  SafeAreaView, StatusBar, Alert, ActivityIndicator 
} from 'react-native';
import * as Speech from 'expo-speech';
import { Camera } from 'expo-camera';

// Qwen API Key ထည့်ရန် (OpenRouter/DashScope)
// မထည့်ထားပါက Local AI Engine က အလိုအလျောက် အလုပ်လုပ်ပေးပါမည်။
const QWEN_API_KEY = ""; 

export default function App() {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'ai', text: '✦ အာကာလင်းသစ် AI OS ✦ စတင်လည်ပတ်နေပါပြီ။' }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Hardware States
  const [torchStatus, setTorchStatus] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);

  // OS Workspace States
  const [currentView, setCurrentView] = useState('MAIN'); // MAIN, CALL, TERMINAL, MUSIC, TASKS, SYSTEM
  const [actionTarget, setActionTarget] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  // AI TTS (အသံဖြင့်ပြောခြင်း)
  const speakText = (text) => {
    try { Speech.speak(text, { language: 'my-MM', rate: 0.9 }); } 
    catch (e) { console.log('Speech error:', e); }
  };

  const addAIMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text }]);
  };

  // 🔦 Hardware Control Function
  const toggleTorch = (explicitState = null) => {
    const nextState = explicitState !== null ? explicitState : !torchStatus;
    setTorchStatus(nextState);
    const msg = nextState ? 'ဖုန်းမီး ဖွင့်လိုက်ပါပြီ' : 'ဖုန်းမီး ပိတ်လိုက်ပါပြီ';
    if(currentView === 'MAIN') addAIMessage(msg);
    speakText(msg);
  };

  // 🧠 AI Core Engine (API + Local Fallback)
  const processCommand = async (userPrompt) => {
    setLoading(true);
    
    // --- 1. LOCAL FALLBACK ENGINE (API မရှိချိန် သို့မဟုတ် အမြန်ခိုင်းစေချိန်) ---
    if (!QWEN_API_KEY) {
      setTimeout(() => {
        setLoading(false);
        const text = userPrompt.toLowerCase();
        
        if (text.includes('မီးဖွင့်') || text.includes('torch on')) {
          toggleTorch(true);
        } else if (text.includes('မီးပိတ်') || text.includes('torch off')) {
          toggleTorch(false);
        } else if (text.includes('ခေါ်') || text.includes('call')) {
          const target = userPrompt.replace(/ခေါ်ပေး|ခေါ်ပါ|ဖုန်းခေါ်/g, '').trim() || 'Boss';
          setActionTarget(target);
          setCurrentView('CALL');
          speakText(`${target} ထံ ဖုန်းခေါ်နေပါသည်`);
        } else if (text.includes('terminal') || text.includes('ကုဒ်') || text.includes('code')) {
          setCurrentView('TERMINAL');
          speakText('Terminal ဖွင့်လိုက်ပါပြီ');
        } else if (text.includes('သီချင်း') || text.includes('music')) {
          setCurrentView('MUSIC');
          speakText('Media Player ကို ဖွင့်ပေးလိုက်ပါပြီ');
        } else if (text.includes('စာရင်း') || text.includes('task')) {
          setCurrentView('TASKS');
          speakText('လုပ်ဆောင်ရန် စာရင်းများကို ပြသနေပါသည်');
        } else if (text.includes('စနစ်') || text.includes('system')) {
          setCurrentView('SYSTEM');
          speakText('စနစ် အခြေအနေကို စစ်ဆေးနေပါသည်');
        } else {
          const reply = "နားလည်ပါပြီ။ အခြား ဘာများ ကူညီပေးရမလဲ။";
          addAIMessage(reply);
          speakText(reply);
        }
      }, 500);
      return;
    }

    // --- 2. QWEN API ENGINE (API ရှိချိန်) ---
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
              content: `You are ArkarLinnThit OS AI. Map the user request to a JSON action:
              {
                "action": "TORCH_ON" | "TORCH_OFF" | "CALL" | "TERMINAL" | "MUSIC" | "TASKS" | "SYSTEM" | "CHAT",
                "target": "name (if CALL) else empty",
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
      else if (['CALL', 'TERMINAL', 'MUSIC', 'TASKS', 'SYSTEM'].includes(parsed.action)) {
        if(parsed.action === 'CALL') setActionTarget(parsed.target || 'Contact');
        setCurrentView(parsed.action);
      } else {
        addAIMessage(parsed.reply);
      }
      speakText(parsed.reply);

    } catch (err) {
      addAIMessage("AI Brain ချိတ်ဆက်မှု ပြတ်တောက်နေပါသည်။ Local Mode ဖြင့်သာ လုပ်ဆောင်နိုင်ပါသည်။");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userCmd = inputText.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userCmd }]);
    setInputText('');
    processCommand(userCmd);
  };

  // Simulated Voice Input
  const triggerVoice = () => {
    setIsListening(true);
    speakText("နားထောင်နေပါတယ်");
    setTimeout(() => {
      setIsListening(false);
      const fakeVoiceCmd = "စနစ်ပိုင်း စစ်ဆေးပေးပါ"; // အစမ်းလုပ်ဆောင်ချက်
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: `🎤 ${fakeVoiceCmd}` }]);
      processCommand(fakeVoiceCmd);
    }, 2000);
  };

  // ---------------- UI WORKSPACES RENDERER ----------------
  const renderWorkspace = () => {
    // 1. CALL SCREEN
    if (currentView === 'CALL') return (
      <View style={styles.workspace}>
        <Text style={styles.wsBadge}>NEURAL COMM LINK</Text>
        <Text style={styles.wsTitle}>{actionTarget}</Text>
        <Text style={styles.wsStatus}>Calling... 00:05</Text>
        <View style={styles.avatarWrap}><Text style={{fontSize:50}}>📞</Text></View>
        <TouchableOpacity style={styles.closeBtnRed} onPress={() => setCurrentView('MAIN')}>
          <Text style={styles.closeBtnText}>📞 End Call</Text>
        </TouchableOpacity>
      </View>
    );

    // 2. TERMINAL SCREEN
    if (currentView === 'TERMINAL') return (
      <View style={[styles.workspace, {backgroundColor: '#000', alignItems: 'flex-start'}]}>
        <Text style={styles.termText}>root@arkarlinnthit_os:~$ system_init</Text>
        <Text style={styles.termText}>[OK] AI Core loaded...</Text>
        <Text style={styles.termText}>[OK] Bypassing security protocols...</Text>
        <Text style={styles.termText}>[WAIT] Compiling React Native modules...</Text>
        <TouchableOpacity style={styles.closeBtnGhost} onPress={() => setCurrentView('MAIN')}>
          <Text style={styles.termText}>> exit_terminal</Text>
        </TouchableOpacity>
      </View>
    );

    // 3. MUSIC PLAYER
    if (currentView === 'MUSIC') return (
      <View style={styles.workspace}>
        <Text style={styles.wsBadge}>MEDIA SYNTHESIZER</Text>
        <View style={styles.albumArt}><Text style={{fontSize:60}}>🎵</Text></View>
        <Text style={styles.wsTitle}>Synthwave Mix</Text>
        <Text style={styles.wsStatus}>▶ Playing Neural Audio</Text>
        <TouchableOpacity style={styles.closeBtnAction} onPress={() => setCurrentView('MAIN')}>
          <Text style={styles.closeBtnText}>Close Player</Text>
        </TouchableOpacity>
      </View>
    );

    // 4. TASKS / ACCOUNTING
    if (currentView === 'TASKS') return (
      <View style={[styles.workspace, {justifyContent: 'flex-start', paddingTop: 60}]}>
        <Text style={styles.wsBadge}>DATA MATRIX</Text>
        <View style={styles.taskCard}><Text style={styles.taskText}>☑ Server Maintenance</Text></View>
        <View style={styles.taskCard}><Text style={styles.taskText}>☐ Optimize Qwen API</Text></View>
        <View style={styles.taskCard}><Text style={styles.taskText}>☐ UI/UX Polish</Text></View>
        <View style={{flex:1}} />
        <TouchableOpacity style={styles.closeBtnAction} onPress={() => setCurrentView('MAIN')}>
          <Text style={styles.closeBtnText}>Back to OS</Text>
        </TouchableOpacity>
      </View>
    );

    // 5. SYSTEM DIAGNOSTICS
    if (currentView === 'SYSTEM') return (
      <View style={styles.workspace}>
        <Text style={styles.wsBadge}>SYSTEM MONITOR</Text>
        <View style={styles.sysRow}><Text style={styles.sysText}>CPU Usage</Text><Text style={styles.sysVal}>24%</Text></View>
        <View style={styles.sysRow}><Text style={styles.sysText}>RAM Allocation</Text><Text style={styles.sysVal}>1.2GB / 8GB</Text></View>
        <View style={styles.sysRow}><Text style={styles.sysText}>Core Temp</Text><Text style={styles.sysVal}>38°C</Text></View>
        <TouchableOpacity style={styles.closeBtnAction} onPress={() => setCurrentView('MAIN')}>
          <Text style={styles.closeBtnText}>Close Monitor</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ---------------- MAIN OS RENDER ----------------
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      
      {/* Background Camera for Torch Control */}
      {hasCameraPermission && <Camera style={{ width:1, height:1, opacity:0 }} flashMode={torchStatus ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off} />}

      {currentView !== 'MAIN' ? (
        renderWorkspace()
      ) : (
        <>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.appTitle}>✦ ARKAR LINN THIT OS ✦</Text>
            <View style={styles.statusBadge}>
              <View style={[styles.onlineDot, isListening && {backgroundColor: '#ef4444'}]} />
              <Text style={[styles.statusText, isListening && {color: '#ef4444'}]}>
                {isListening ? 'LISTENING...' : 'SYSTEM ONLINE'}
              </Text>
            </View>
          </View>

          {/* AI VISUALIZER CORE */}
          <View style={styles.coreWrapper}>
            <TouchableOpacity style={styles.outerRing} activeOpacity={0.8} onPress={() => speakText("AI System အသင့်ရှိပါသည်")}>
              <View style={[styles.innerCore, torchStatus && styles.activeCore, isListening && styles.listeningCore]}>
                {loading ? <ActivityIndicator color="#06b6d4" /> : <Text style={styles.coreText}>AI</Text>}
              </View>
            </TouchableOpacity>
          </View>

          {/* CHAT LOG */}
          <ScrollView style={styles.chatContainer} showsVerticalScrollIndicator={false}>
            {messages.map((item) => (
              <View key={item.id} style={[styles.msgBubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={styles.msgText}>{item.text}</Text>
              </View>
            ))}
          </ScrollView>

          {/* CONTROLS */}
          <View style={styles.bottomSection}>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={triggerVoice}>
                <Text style={styles.actionBtnText}>🎤 Voice</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, torchStatus && styles.activeActionBtn]} onPress={() => toggleTorch()}>
                <Text style={[styles.actionBtnText, torchStatus && { color: '#020617' }]}>🔦 Torch</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setCurrentView('SYSTEM')}>
                <Text style={styles.actionBtnText}>⚙️ System</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="အမိန့်ပေးပါ..."
                placeholderTextColor="#475569"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
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
  container: { flex: 1, backgroundColor: '#020617', paddingHorizontal: 16 },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 10 },
  appTitle: { color: '#06b6d4', fontSize: 16, fontWeight: 'bold', letterSpacing: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981', marginRight: 6 },
  statusText: { color: '#10b981', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  
  coreWrapper: { alignItems: 'center', marginVertical: 10 },
  outerRing: { width: 70, height: 70, borderRadius: 35, borderWidth: 1, borderColor: '#06b6d4', justifyContent: 'center', alignItems: 'center' },
  innerCore: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(6,182,212,0.1)', justifyContent: 'center', alignItems: 'center' },
  activeCore: { backgroundColor: 'rgba(16,185,129,0.5)' },
  listeningCore: { backgroundColor: 'rgba(239,68,68,0.5)' },
  coreText: { color: '#06b6d4', fontWeight: 'bold', fontSize: 14 },

  chatContainer: { flex: 1, marginVertical: 5 },
  msgBubble: { padding: 12, borderRadius: 12, marginVertical: 4, maxWidth: '85%' },
  aiBubble: { backgroundColor: '#0f172a', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#1e293b' },
  userBubble: { backgroundColor: '#0284c7', alignSelf: 'flex-end' },
  msgText: { color: '#f8fafc', fontSize: 13, lineHeight: 20 },

  bottomSection: { marginBottom: 20 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  actionBtn: { flex: 1, backgroundColor: '#0f172a', paddingVertical: 12, borderRadius: 10, marginHorizontal: 4, alignItems: 'center', borderWidth: 1, borderColor: '#1e293b' },
  activeActionBtn: { backgroundColor: '#06b6d4', borderColor: '#06b6d4' },
  actionBtnText: { color: '#38bdf8', fontSize: 12, fontWeight: 'bold' },

  inputRow: { flexDirection: 'row' },
  input: { flex: 1, backgroundColor: '#0f172a', color: '#f8fafc', paddingHorizontal: 15, borderRadius: 12, borderWidth: 1, borderColor: '#1e293b', fontSize: 13 },
  sendBtn: { backgroundColor: '#06b6d4', width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  sendBtnText: { color: '#020617', fontSize: 18, fontWeight: 'bold' },

  // Generative Workspace Styles
  workspace: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617', padding: 20 },
  wsBadge: { color: '#06b6d4', fontSize: 10, letterSpacing: 2, borderWidth: 1, borderColor: '#06b6d4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, marginBottom: 30 },
  wsTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  wsStatus: { color: '#10b981', fontSize: 12 },
  avatarWrap: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', marginVertical: 30, borderWidth: 1, borderColor: '#38bdf8' },
  closeBtnRed: { backgroundColor: '#ef4444', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 30, marginTop: 40 },
  closeBtnAction: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#06b6d4', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 30, marginTop: 40 },
  closeBtnText: { color: '#fff', fontWeight: 'bold' },
  
  // Terminal Styles
  termText: { color: '#22c55e', fontFamily: 'monospace', fontSize: 12, marginBottom: 8 },
  closeBtnGhost: { marginTop: 40, borderBottomWidth: 1, borderBottomColor: '#22c55e' },
  
  // Tasks Styles
  taskCard: { width: '100%', backgroundColor: '#0f172a', padding: 15, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#1e293b' },
  taskText: { color: '#e2e8f0' },

  // System Styles
  sysRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#0f172a', padding: 15, borderRadius: 10, marginBottom: 10 },
  sysText: { color: '#94a3b8' },
  sysVal: { color: '#38bdf8', fontWeight: 'bold' }
});
