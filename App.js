import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, SafeAreaView, StatusBar, Modal
} from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState('HUD'); // 'HUD' | 'TOOLS' | 'IDE'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [torchActive, setTorchActive] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: 'INITIATING ARKAR LINN THIT AI CORE...' },
    { id: 2, sender: 'ai', text: 'မင်္ဂလာပါ။ အာကာလင်းသစ် Super AI စနစ် အဆင်သင့်ဖြစ်ပါပြီ။ ကျွန်တော် ဘာများ ကူညီပေးရမလဲ။' }
  ]);
  const [inputText, setInputText] = useState('');
  const [codeContent, setCodeContent] = useState('// ArkarLinnThit AI: Live Code Editor\n\nfunction initializeSystem() {\n  const status = "Online";\n  const power = "100%";\n  return `Core ${status}, Power at ${power}`;\n}\n\nconsole.log(initializeSystem());');

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: inputText }]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020408" />

      {/* --- TOP HEADER (HUD BAR) --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIconBox} onPress={() => setIsDrawerOpen(true)}>
          <Text style={styles.menuIcon}>ᯤ</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>ARKAR LINN THIT AI</Text>
          <Text style={styles.subTitle}>S P A T I A L   O S  •  v 2.0</Text>
        </View>

        <View style={styles.statusBox}>
          <View style={styles.pulseDot} />
          <Text style={styles.statusText}>ONLINE</Text>
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
        
        {/* 1. AI HUD (Main Chat & Visualizer) */}
        {activeTab === 'HUD' && (
          <View style={styles.fullFlex}>
            {/* ArkarLinnThit Advanced Core Visualizer */}
            <View style={styles.coreWrapper}>
              <View style={styles.coreOuterRing}>
                <View style={styles.coreMiddleDashed}>
                  <View style={styles.coreInnerSolid}>
                    <Text style={styles.coreText}>ALT</Text>
                    <Text style={styles.coreSubText}>AI CORE</Text>
                  </View>
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
                    <Text style={styles.senderLabel}>{isUser ? 'USER IDENTIFIED' : 'ARKAR LINN THIT AI'}</Text>
                    <Text style={styles.bubbleText}>{msg.text}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* 2. HARDWARE & TOOLS */}
        {activeTab === 'TOOLS' && (
          <ScrollView style={styles.fullFlex} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>// SYSTEM OVERRIDE CONTROLS</Text>
            
            <View style={styles.gridRow}>
              <TouchableOpacity style={[styles.gridCard, torchActive && styles.gridCardActive]} onPress={() => setTorchActive(!torchActive)}>
                <Text style={styles.cardIcon}>🔦</Text>
                <Text style={styles.cardTitle}>ILLUMINATION</Text>
                <Text style={[styles.cardStatus, torchActive && {color: '#00F0FF'}]}>{torchActive ? 'ENGAGED' : 'STANDBY'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridCard}>
                <Text style={styles.cardIcon}>📷</Text>
                <Text style={styles.cardTitle}>OPTICS SYSTEM</Text>
                <Text style={styles.cardStatus}>READY TO LAUNCH</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>// DIAGNOSTICS</Text>
            <View style={styles.diagPanel}>
              <View style={styles.diagRow}><Text style={styles.diagLabel}>CPU LOAD:</Text><Text style={styles.diagValue}>14.2%</Text></View>
              <View style={styles.diagRow}><Text style={styles.diagLabel}>CORE TEMP:</Text><Text style={styles.diagValue}>34°C</Text></View>
              <View style={styles.diagRow}><Text style={styles.diagLabel}>NEURAL NET:</Text><Text style={styles.diagValue}>STABLE (24ms)</Text></View>
              <View style={styles.progressBar}><View style={styles.progressFill} /></View>
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
              <Text style={styles.consoleText}>> ARKAR LINN THIT ENGINE V2.0 CONNECTED.</Text>
              <Text style={styles.consoleText}>> WAITING FOR CODE EXECUTION...</Text>
            </View>
          </View>
        )}
      </View>

      {/* --- UNIFIED INPUT CONSOLE --- */}
      <View style={styles.inputConsole}>
        <TouchableOpacity style={styles.micBtn}>
          <Text style={styles.micIcon}>🎙️</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Command ရိုက်ထည့်ပါ..."
          placeholderTextColor="#3B5A7D"
          value={inputText}
          onChangeText={setInputText}
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
              <Text style={styles.drawerLabel}>AI IDENTITY</Text>
              <Text style={styles.drawerValue}>ArkarLinnThit Super AI</Text>
              
              <Text style={styles.drawerLabel}>LLM ENGINE</Text>
              <Text style={styles.drawerValue}>Qwen 2.5 (Pending Link)</Text>

              <Text style={styles.drawerLabel}>INTERFACE</Text>
              <Text style={styles.drawerValue}>Spatial HUD v2.0</Text>
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

  /* --- HEADER --- */
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 40, paddingBottom: 15, backgroundColor: '#050A14', borderBottomWidth: 1, borderBottomColor: '#00F0FF' },
  menuIconBox: { padding: 8, backgroundColor: 'rgba(0, 240, 255, 0.1)', borderRadius: 8, borderWidth: 1, borderColor: '#00F0FF' },
  menuIcon: { color: '#00F0FF', fontSize: 18, fontWeight: 'bold' },
  titleContainer: { alignItems: 'center' },
  appTitle: { color: '#FFF', fontSize: 18, fontWeight: '900', letterSpacing: 2, textShadowColor: '#00F0FF', textShadowOffset: {width: 0, height: 0}, textShadowRadius: 8 },
  subTitle: { color: '#00F0FF', fontSize: 9, fontWeight: '700', letterSpacing: 3, marginTop: 4 },
  statusBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 230, 118, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#00E676' },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00E676', marginRight: 4 },
  statusText: { color: '#00E676', fontSize: 10, fontWeight: 'bold' },

  /* --- NAVIGATION --- */
  navBar: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 15, gap: 10 },
  navBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#08101E', borderRadius: 8, borderWidth: 1, borderColor: '#122543' },
  navBtnActive: { backgroundColor: 'rgba(0, 240, 255, 0.15)', borderColor: '#00F0FF' },
  navText: { color: '#3B5A7D', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  navTextActive: { color: '#00F0FF', textShadowColor: '#00F0FF', textShadowOffset: {width:0, height:0}, textShadowRadius: 5 },

  /* --- CANVAS --- */
  canvas: { flex: 1, paddingHorizontal: 16, paddingTop: 15 },

  /* Core Visualizer */
  coreWrapper: { alignItems: 'center', marginVertical: 20 },
  coreOuterRing: { width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(0, 240, 255, 0.3)', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 240, 255, 0.05)' },
  coreMiddleDashed: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#00F0FF', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  coreInnerSolid: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#00F0FF', justifyContent: 'center', alignItems: 'center', shadowColor: '#00F0FF', shadowOpacity: 0.8, shadowRadius: 15, elevation: 10 },
  coreText: { color: '#020408', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
  coreSubText: { color: '#020408', fontSize: 7, fontWeight: 'bold', marginTop: 2 },

  /* Chat System */
  sysText: { color: '#00E676', fontFamily: 'monospace', fontSize: 10, alignSelf: 'center', marginVertical: 10 },
  chatStream: { flex: 1 },
  chatBubble: { padding: 14, borderRadius: 12, marginVertical: 6, maxWidth: '88%', borderWidth: 1 },
  aiBubble: { backgroundColor: 'rgba(93, 0, 255, 0.1)', borderColor: '#5D00FF', alignSelf: 'flex-start', borderTopLeftRadius: 2 },
  userBubble: { backgroundColor: 'rgba(0, 240, 255, 0.1)', borderColor: '#00F0FF', alignSelf: 'flex-end', borderTopRightRadius: 2 },
  senderLabel: { color: '#FFF', fontSize: 9, fontWeight: '800', marginBottom: 6, opacity: 0.6, letterSpacing: 1 },
  bubbleText: { color: '#E0F7FA', fontSize: 14, lineHeight: 22 },

  /* Hardware / Tools */
  sectionTitle: { color: '#3B5A7D', fontSize: 12, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12, marginTop: 10 },
  gridRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  gridCard: { flex: 1, backgroundColor: '#08101E', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#122543', alignItems: 'center' },
  gridCardActive: { backgroundColor: 'rgba(0, 240, 255, 0.1)', borderColor: '#00F0FF', shadowColor: '#00F0FF', shadowRadius: 10, elevation: 5 },
  cardIcon: { fontSize: 28, marginBottom: 10 },
  cardTitle: { color: '#FFF', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  cardStatus: { color: '#3B5A7D', fontSize: 10, fontWeight: 'bold', marginTop: 6 },
  
  diagPanel: { backgroundColor: '#08101E', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#122543' },
  diagRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  diagLabel: { color: '#88A4C3', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  diagValue: { color: '#00F0FF', fontSize: 12, fontWeight: '900', fontFamily: 'monospace' },
  progressBar: { height: 4, backgroundColor: '#020408', borderRadius: 2, marginTop: 10 },
  progressFill: { width: '85%', height: '100%', backgroundColor: '#00F0FF', borderRadius: 2 },

  /* IDE View */
  ideContainer: { flex: 1, backgroundColor: '#050A14', borderRadius: 12, borderWidth: 1, borderColor: '#5D00FF', overflow: 'hidden' },
  ideTopBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#08101E', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#5D00FF' },
  ideTabTitle: { color: '#00F0FF', fontSize: 12, fontFamily: 'monospace', fontWeight: 'bold' },
  compileBtn: { backgroundColor: '#5D00FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  compileBtnText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  editorArea: { flex: 1, padding: 12 },
  codeText: { flex: 1, color: '#00F0FF', fontFamily: 'monospace', fontSize: 13, textAlignVertical: 'top' },
  consoleOutput: { backgroundColor: '#020408', padding: 12, borderTopWidth: 1, borderColor: '#122543', minHeight: 80 },
  consoleText: { color: '#00E676', fontFamily: 'monospace', fontSize: 10, marginBottom: 4 },

  /* --- INPUT CONSOLE --- */
  inputConsole: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 15, backgroundColor: '#050A14', borderTopWidth: 1, borderColor: '#00F0FF', alignItems: 'center' },
  micBtn: { width: 48, height: 48, backgroundColor: 'rgba(0, 240, 255, 0.1)', borderRadius: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#00F0FF' },
  micIcon: { fontSize: 20 },
  textInput: { flex: 1, height: 48, backgroundColor: '#08101E', borderRadius: 12, borderWidth: 1, borderColor: '#122543', color: '#FFF', paddingHorizontal: 16, marginHorizontal: 10, fontSize: 14 },
  sendBtn: { width: 48, height: 48, backgroundColor: '#00F0FF', borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#00F0FF', shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 },
  sendIcon: { color: '#020408', fontSize: 20, fontWeight: '900' },

  /* --- MODAL DRAWER --- */
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(2, 4, 8, 0.9)', justifyContent: 'center', alignItems: 'center' },
  drawerPanel: { width: '85%', backgroundColor: '#050A14', padding: 25, borderRadius: 16, borderWidth: 1, borderColor: '#5D00FF', shadowColor: '#5D00FF', shadowRadius: 20, elevation: 10 },
  drawerHeader: { color: '#FFF', fontSize: 16, fontWeight: '900', letterSpacing: 1, marginBottom: 20, textAlign: 'center' },
  drawerContent: { backgroundColor: '#08101E', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#122543' },
  drawerLabel: { color: '#3B5A7D', fontSize: 10, fontWeight: 'bold', letterSpacing: 1, marginBottom: 4, marginTop: 12 },
  drawerValue: { color: '#00F0FF', fontSize: 14, fontWeight: 'bold' },
  closeDrawerBtn: { marginTop: 25, backgroundColor: 'rgba(93, 0, 255, 0.2)', paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#5D00FF', alignItems: 'center' },
  closeDrawerText: { color: '#FFF', fontSize: 12, fontWeight: '900', letterSpacing: 2 }
});
