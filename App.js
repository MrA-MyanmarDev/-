import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, StatusBar, Modal, Alert
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Speech from 'expo-speech';

export default function App() {
  const [activeTab, setActiveTab] = useState('HUD');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [torchActive, setTorchActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: 'SYSTEM READY • HARDWARE MODULES INITIALIZED' },
    { id: 2, sender: 'ai', text: 'မင်္ဂလာပါ။ အာကာလင်းသစ် AI စနစ်မှ ကြိုဆိုပါတယ်။ ဖုန်းမီးဖွင့်ရန် သို့မဟုတ် ခိုင်းစေလိုသည်များကို ပြောကြားနိုင်ပါပြီ။' }
  ]);
  const [inputText, setInputText] = useState('');

  // Request Permissions on App Launch
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert("Permission Required", "ကင်မရာနှင့် ဖုန်းမီး သုံးစွဲရန် Permission ခွင့်ပြုပေးဖို့ လိုအပ်ပါသည်။");
      }
    })();
  }, []);

  // Text to Speech
  const speakResponse = (text) => {
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'my-MM',
      pitch: 1.0,
      rate: 0.95,
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  // Toggle Torch/Flashlight
  const toggleFlashlight = async () => {
    if (!hasPermission) {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') return;
    }

    const newState = !torchActive;
    setTorchActive(newState);
    
    const msg = newState ? 'ဖုန်းမီး ဖွင့်လိုက်ပါပြီ။' : 'ဖုန်းမီး ပိတ်လိုက်ပါပြီ။';
    addMessage('ai', msg);
    speakResponse(msg);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userText = inputText.trim();
    addMessage('user', userText);
    setInputText('');

    const lowerText = userText.toLowerCase();
    
    if (lowerText.includes('မီးဖွင့်') || lowerText.includes('torch on') || lowerText.includes('flashlight on')) {
      if (!torchActive) toggleFlashlight();
    } else if (lowerText.includes('မီးပိတ်') || lowerText.includes('torch off') || lowerText.includes('flashlight off')) {
      if (torchActive) toggleFlashlight();
    } else {
      const reply = `အမိန့် "${userText}" ကို လက်ခံရရှိပါသည်။ အာကာလင်းသစ် AI စနစ် အသင့်ရှိပါသည်။`;
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

      {/* Hardware Camera Surface for Torch Control */}
      {hasPermission && (
        <View style={styles.cameraHolder}>
          <Camera 
            style={styles.cameraPreview} 
            type={Camera.Constants.Type.back}
            flashMode={torchActive ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
          />
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
      </View>

      {/* --- MAIN CANVAS --- */}
      <View style={styles.canvas}>
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

        {activeTab === 'TOOLS' && (
          <ScrollView style={styles.fullFlex} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>// HARDWARE OVERRIDE</Text>
            
            <View style={styles.gridRow}>
              <TouchableOpacity 
                style={[styles.gridCard, torchActive && styles.gridCardActive]} 
                onPress={toggleFlashlight}>
                <Text style={styles.cardIcon}>🔦</Text>
                <Text style={styles.cardTitle}>FLASHLIGHT</Text>
                <Text style={[styles.cardStatus, torchActive && { color: '#00F0FF' }]}>
                  {torchActive ? 'ENGAGED (ON)' : 'STANDBY (OFF)'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </View>

      {/* --- INPUT CONSOLE --- */}
      <View style={styles.inputConsole}>
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

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020408' },
  fullFlex: { flex: 1 },
  cameraHolder: { position: 'absolute', top: 0, left: 0, width: 1, height: 1, opacity: 0.01 },
  cameraPreview: { width: 1, height: 1 },

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

  inputConsole: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 15, backgroundColor: '#050A14', borderTopWidth: 1, borderColor: '#00F0FF', alignItems: 'center' },
  textInput: { flex: 1, height: 48, backgroundColor: '#08101E', borderRadius: 12, borderWidth: 1, borderColor: '#122543', color: '#FFF', paddingHorizontal: 16, marginRight: 10, fontSize: 13 },
  sendBtn: { width: 48, height: 48, backgroundColor: '#00F0FF', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  sendIcon: { color: '#020408', fontSize: 20, fontWeight: '900' }
});
