import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, StatusBar, Modal, Alert
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Speech from 'expo-speech';

export default function App() {
  const [activeTab, setActiveTab] = useState('HUD'); // 'HUD' | 'TOOLS' | 'IDE'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [torchActive, setTorchActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: 'SYSTEM READY • HARDWARE MODULES INITIALIZED' },
    { id: 2, sender: 'ai', text: 'မင်္ဂလာပါ။ အာကာလင်းသစ် AI စနစ်မှ ကြိုဆိုပါတယ်။ ဖုန်းမီးဖွင့်ရန်၊ စကားပြောရန် သို့မဟုတ် Command များ ပေးပို့နိုင်ပါပြီ။' }
  ]);
  const [inputText, setInputText] = useState('');
  const [codeContent, setCodeContent] = useState('// ArkarLinnThit Live Hardware Interface\n\nasync function triggerTorch(state) {\n  console.log("Torch StateChanged:", state);\n}\n\ntriggerTorch(true);');

  // Request Permissions on App Start
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  // Text to Speech Function (AI အသံထွက် စကားပြောစနစ်)
  const speakResponse = (text) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'my-MM', // Myanmar/Default Speech fallback
      pitch: 1.0,
      rate: 0.95,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  // Toggle Flashlight (တကယ့် ဖုန်းမီး ဖွင့်/ပိတ်)
  const toggleFlashlight = () => {
    const newState = !torchActive;
    setTorchActive(newState);
    setFlashMode(newState ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off);
    
    const msg = newState ? 'ဖုန်းမီး ဖွင့်လိုက်ပါပြီ။' : 'ဖုန်းမီး ပိတ်လိုက်ပါပြီ။';
    addMessage('ai', msg);
    speakResponse(msg);
  };

  // Process Natural Language Commands (AI Logic for Phone Control)
  const handleSend = () => {
    if (!inputText.trim()) return;
    const userText = inputText.trim();
    addMessage('user', userText);
    setInputText('');

    // Local Smart Command Processor
    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('မီးဖွင့်') || lowerText.includes('torch on') || lowerText.includes('flashlight on')) {
      if (!torchActive) toggleFlashlight();
      else {
        addMessage('ai', 'ဖုန်းမီး ဖွင့်ထားပြီးသား ဖြစ်ပါတယ်။');
        speakResponse('ဖုန်းမီး ဖွင့်ထားပြီးသား ဖြစ်ပါတယ်။');
      }
    } else if (lowerText.includes('မီးပိတ်') || lowerText.includes('torch off') || lowerText.includes('flashlight off')) {
      if (torchActive) toggleFlashlight();
      else {
        addMessage('ai', 'ဖုန်းမီး ပိတ်ထားပြီးသား ဖြစ်ပါတယ်။');
        speakResponse('ဖုန်းမီး ပိတ်ထားပြီးသား ဖြစ်ပါတယ်။');
      }
    } else {
      // Simulate AI Companion Response
      const reply = `အမိန့် "${userText}" ကို လက်ခံရရှိပါသည်။ အာကာလင်းသစ် AI Brain ကို ပိုမိုမြင့်မားသော API နှင့် ဆက်လက်ချိတ်ဆက်ပေးပါမည်။`;
      addMessage('ai', reply);
      speakResponse(reply);
    }
  };

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { id: Date.now(), sender, text }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020408" />

      {/* Hidden Camera Component to Control Hardware Torch/Flashlight */}
      {hasPermission && (
        <View style={styles.hiddenCamera}>
          <Camera style={{ width: 1, height: 1 }} flashMode={flashMode} />
        </View>
      )}

      {/* --- TOP HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIconBox} onPress={() => setIsDrawerOpen(true)}>
          <Text style={styles.menuIcon}>ᯤ</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>ARKAR LINN THIT AI</Text>
          <Text style={styles.subTitle}>S P A T I A L   O S  •  v 2.5</Text>
        </View>

        <View style={styles.statusBox}>
          <View style={[styles.pulseDot, isSpeaking && { backgroundColor: '#00F0FF' }]} />
          <Text style={styles.statusText}>{isSpeaking ? 'SPEAKING' : 'ONLINE'}</Text>
        </View>
      </View>

      {/* --- NAVIGATION TABS --- */}
      <View style={styles.navBar}>
        <TouchableOpacity style={[styles.navBtn, activeTab === 'HUD' && styles.navBtnActive]} onPress={() => setActiveTab('HUD')}>
          <Text style={[styles.navText, activeTab === 'HUD' && styles.navTextActive]}>◉ AI HUD</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navBtn, activeTab === 'TOOLS' && styles.navBtnActive]} onPress={() => setActiveTab('TOOLS')}>
          <Text style={[styles.navText, activeTab === 'TOOLS' && styles.navTextActive]}>⚡ HARDWARE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navBtn, activeTab === 'IDE' && styles.navBtnActive]} onPress={() => setActiveTab('IDE')}>
          <Text style={[styles.navText, activeTab === 'IDE' && styles.navTextActive]}>💻 TERMINAL</Text>
        </TouchableOpacity>
      </View>

      {/* --- MAIN DYNAMIC CANVAS --- */}
      <View style={styles.canvas}>
        
        {/* 1. AI HUD (Main Chat & Core) */}
        {activeTab === 'HUD' && (
          <View style={styles.fullFlex}>
            <View style={styles.coreWrapper}>
              <View style={styles.coreOuterRing}>
                <View style={[styles.coreMiddleDashed, isSpeaking && { borderColor: '#00E676' }]}>
                  <TouchableOpacity style={styles.coreInnerSolid} onPress={() => speakResponse('အာကာလင်းသစ် AI စနစ် အလုပ်လုပ်နေပါသည်။')}>
                    <Text style={styles.coreText}>ALT</Text>
                    <Text style={styles.coreSubText}>{isSpeaking ? 'TALKING' : 'TOUCH ME'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <ScrollView style={styles.chatStream} showsVerticalScrollIndicator={false}>
              {messages.map((msg) => {
                if (msg.sender === 'system') {
                  return <Text key={msg.id} style={styles.sysText}>[SYS]: {msg.text}</Text>;
                }
                const isUser = msg.sender === 'user';
                return (
                  <View key={msg.id} style={[styles.chatBubble, isUser ? styles.userBubble : styles.aiBubble]}>
                    <Text style={styles.senderLabel}>{isUser ? 'COMMAND SENT' : 'ARKAR LINN THIT AI'}</Text>
                    <Text style={styles.bubbleText}>{msg.text}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* 2. HARDWARE & TOOLS CONTROLLER */}
        {activeTab === 'TOOLS' && (
          <ScrollView style={styles.fullFlex} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>// HARDWARE OVERRIDE</Text>
            
            <View style={styles.gridRow}>
              {/* Torch Trigger Button */}
              <TouchableOpacity 
                style={[styles.gridCard, torchActive && styles.gridCardActive]} 
                onPress={toggleFlashlight}>
                <Text style={styles.cardIcon}>🔦</Text>
                <Text style={styles.cardTitle}>FLASHLIGHT</Text>
                <Text style={[styles.cardStatus, torchActive && { color: '#00F0FF' }]}>
                  {torchActive ? 'ENGAGED (ON)' : 'STANDBY (OFF)'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridCard} onPress={() => Alert.alert('Optics', 'Camera hardware ready.')}>
                <Text style={styles.cardIcon}>📷</Text>
                <Text style={styles.cardTitle}>OPTICS SYSTEM</Text>
                <Text style={styles.cardStatus}>READY</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>// SPEECH ENGINE (TTS)</Text>
            <View style={styles.diagPanel}>
              <TouchableOpacity 
                style={styles.testSpeechBtn} 
                onPress={() => speakResponse('အာကာလင်းသစ် AI ရဲ့ အသံ စမ်းသပ်ချက် အဆင်ပြေပါသည်။')}>
                <Text style={styles.testSpeechText}>🔊 TEST VOICE OUTPUT</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* 3. TERMINAL / IDE */}
        {activeTab === 'IDE' && (
          <View style={styles.ideContainer}>
            <View style={styles.ideTopBar}>
              <Text style={styles.ideTabTitle}>alt_core_v1.js</Text>
              <TouchableOpacity style={styles.compileBtn}>
                <Text style={styles.compileBtnText}>COMPILE 🚀</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.editorArea}>
              <TextInput
                style={styles.codeText}
                multiline
                value={codeContent}
                onChangeText={setCodeContent}
                placeholderTextColor="#2e4259"
              />
            </View>
            <View style={styles.consoleOutput}>
              <Text style={styles.consoleText}>> HARDWARE MODULES LISTENING...</Text>
              <Text style={styles.consoleText}>> CAMERA PERMISSION: {hasPermission ? 'GRANTED' : 'DENIED'}</Text>
            </View>
          </View>
        )}
      </View>

      {/* --- UNIFIED INPUT CONSOLE --- */}
      <View style={styles.inputConsole}>
        <TouchableOpacity 
          style={styles.micBtn} 
          onPress={() => {
            addMessage('user', 'မီးဖွင့်');
            toggleFlashlight();
          }}>
          <Text style={styles.micIcon}>🎙️</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder='စာရိုက်ပါ သို့မဟုတ် "မီးဖွင့်" ဟု ရိုက်ပါ...'
          placeholderTextColor="#3B5A7D"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSend}
        />

        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>

      {/* --- SYSTEM CONFIG DRAWER --- */}
      <Modal visible={isDrawerOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.drawerPanel}>
            <Text style={styles.drawerHeader}>⚙️ SYSTEM CONFIG</Text>

            <View style={styles.drawerContent}>
              <Text style={styles.drawerLabel}>HARDWARE CONTROL</Text>
              <Text style={styles.drawerValue}>Camera Flashlight Enabled</Text>

              <Text style={styles.drawerLabel}>SPEECH SYNTHESIS</Text>
              <Text style={styles.drawerValue}>Expo Speech Engine Active</Text>

              <Text style={styles.drawerLabel}>AI MODEL INTEGRATION</Text>
              <Text style={styles.drawerValue}>Qwen API Link Ready</Text>
            </View>

            <TouchableOpacity style={styles.closeDrawerBtn} onPress={() => setIsDrawerOpen(false)}>
              <Text style={styles.closeDrawerText}>CLOSE SETTINGS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020408' },
  fullFlex: { flex: 1 },
  hiddenCamera: { position: 'absolute', opacity: 0, width: 1, height: 1 },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 15, backgroundColor: '#050A14', borderBottomWidth: 1, borderBottomColor: '#00F0FF' },
  menuIconBox: { padding: 8, backgroundColor: 'rgba(0, 240, 255, 0.1)', borderRadius: 8, borderWidth: 1, borderColor: '#00F0FF' },
  menuIcon: { color: '#00F0FF', fontSize: 18, fontWeight: 'bold' },
  titleContainer: { alignItems: 'center' },
  appTitle: { color: '#FFF', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  subTitle: { color: '#00F0FF', fontSize: 9, fontWeight: '700', letterSpacing: 3, marginTop: 4 },
  statusBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 230, 118, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#00E676' },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00E676', marginRight: 4 },
  statusText: { color: '#00E676', fontSize: 10, fontWeight: 'bold' },

  navBar: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 15, gap: 10 },
  navBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#08101E', borderRadius: 8, borderWidth: 1, borderColor: '#122543' },
  navBtnActive: { backgroundColor: 'rgba(0, 240, 255, 0.15)', borderColor: '#00F0FF' },
  navText: { color: '#3B5A7D', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  navTextActive: { color: '#00F0FF' },

  canvas: { flex: 1, paddingHorizontal: 16, paddingTop: 15 },

  coreWrapper: { alignItems: 'center', marginVertical: 15 },
  coreOuterRing: { width: 90, height: 90, borderRadius: 45, borderWidth: 1, borderColor: 'rgba(0, 240, 255, 0.3)', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 240, 255, 0.05)' },
  coreMiddleDashed: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: '#00F0FF', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  coreInnerSolid: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#00F0FF', justifyContent: 'center', alignItems: 'center' },
  coreText: { color: '#020408', fontSize: 14, fontWeight: '900' },
  coreSubText: { color: '#020408', fontSize: 6, fontWeight: 'bold', marginTop: 1 },

  sysText: { color: '#00E676', fontFamily: 'monospace', fontSize: 10, alignSelf: 'center', marginVertical: 8 },
  chatStream: { flex: 1 },
  chatBubble: { padding: 14, borderRadius: 12, marginVertical: 6, maxWidth: '88%', borderWidth: 1 },
  aiBubble: { backgroundColor: 'rgba(93, 0, 255, 0.1)', borderColor: '#5D00FF', alignSelf: 'flex-start' },
  userBubble: { backgroundColor: 'rgba(0, 240, 255, 0.1)', borderColor: '#00F0FF', alignSelf: 'flex-end' },
  senderLabel: { color: '#FFF', fontSize: 9, fontWeight: '800', marginBottom: 4, opacity: 0.6 },
  bubbleText: { color: '#E0F7FA', fontSize: 14, lineHeight: 20 },

  sectionTitle: { color: '#3B5A7D', fontSize: 12, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12, marginTop: 10 },
  gridRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  gridCard: { flex: 1, backgroundColor: '#08101E', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#122543', alignItems: 'center' },
  gridCardActive: { backgroundColor: 'rgba(0, 240, 255, 0.1)', borderColor: '#00F0FF' },
  cardIcon: { fontSize: 28, marginBottom: 10 },
  cardTitle: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  cardStatus: { color: '#3B5A7D', fontSize: 10, fontWeight: 'bold', marginTop: 6 },
  
  diagPanel: { backgroundColor: '#08101E', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#122543', alignItems: 'center' },
  testSpeechBtn: { backgroundColor: 'rgba(0, 240, 255, 0.15)', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, borderWidth: 1, borderColor: '#00F0FF' },
  testSpeechText: { color: '#00F0FF', fontWeight: 'bold', fontSize: 12 },

  ideContainer: { flex: 1, backgroundColor: '#050A14', borderRadius: 12, borderWidth: 1, borderColor: '#5D00FF', overflow: 'hidden' },
  ideTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#08101E', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#5D00FF' },
  ideTabTitle: { color: '#00F0FF', fontSize: 12, fontFamily: 'monospace', fontWeight: 'bold' },
  compileBtn: { backgroundColor: '#5D00FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  compileBtnText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  editorArea: { flex: 1, padding: 12 },
  codeText: { flex: 1, color: '#00F0FF', fontFamily: 'monospace', fontSize: 13, textAlignVertical: 'top' },
  consoleOutput: { backgroundColor: '#020408', padding: 12, borderTopWidth: 1, borderColor: '#122543', minHeight: 70 },
  consoleText: { color: '#00E676', fontFamily: 'monospace', fontSize: 10, marginBottom: 4 },

  inputConsole: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 15, backgroundColor: '#050A14', borderTopWidth: 1, borderColor: '#00F0FF', alignItems: 'center' },
  micBtn: { width: 48, height: 48, backgroundColor: 'rgba(0, 240, 255, 0.1)', borderRadius: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#00F0FF' },
  micIcon: { fontSize: 20 },
  textInput: { flex: 1, height: 48, backgroundColor: '#08101E', borderRadius: 12, borderWidth: 1, borderColor: '#122543', color: '#FFF', paddingHorizontal: 16, marginHorizontal: 10, fontSize: 13 },
  sendBtn: { width: 48, height: 48, backgroundColor: '#00F0FF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  sendIcon: { color: '#020408', fontSize: 20, fontWeight: '900' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(2, 4, 8, 0.9)', justifyContent: 'center', alignItems: 'center' },
  drawerPanel: { width: '85%', backgroundColor: '#050A14', padding: 25, borderRadius: 16, borderWidth: 1, borderColor: '#5D00FF' },
  drawerHeader: { color: '#FFF', fontSize: 16, fontWeight: '900', marginBottom: 20, textAlign: 'center' },
  drawerContent: { backgroundColor: '#08101E', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#122543' },
  drawerLabel: { color: '#3B5A7D', fontSize: 10, fontWeight: 'bold', marginBottom: 4, marginTop: 10 },
  drawerValue: { color: '#00F0FF', fontSize: 13, fontWeight: 'bold' },
  closeDrawerBtn: { marginTop: 20, backgroundColor: 'rgba(93, 0, 255, 0.2)', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#5D00FF', alignItems: 'center' },
  closeDrawerText: { color: '#FFF', fontSize: 12, fontWeight: '900' }
});
