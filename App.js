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
  Modal
} from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState('CHAT'); // 'CHAT' | 'TOOLS' | 'IDE'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [torchActive, setTorchActive] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'အာကာလင်းသစ် Super AI စနစ် အဆင်သင့်ဖြစ်ပါပြီ။ ဘာကူညီပေးရမလဲခင်ဗျာ။' }
  ]);
  const [inputText, setInputText] = useState('');
  const [codeContent, setCodeContent] = useState('// ArkarLinnThit AI Code Studio\nfunction jarvisCore() {\n  console.log("Core System Operational");\n}\njarvisCore();');

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: inputText }]);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#030811" />

      {/* Top Glassmorphic HUD Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setIsDrawerOpen(true)}>
          <Text style={styles.menuBtnText}>⚙️</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>ARKAR LINN THIT AI</Text>
          <Text style={styles.subTitle}>SUPER APP HUD • v1.0</Text>
        </View>

        <View style={styles.statusDot} />
      </View>

      {/* Top Dynamic Mode Selector Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'CHAT' && styles.activeTabBtn]} 
          onPress={() => setActiveTab('CHAT')}>
          <Text style={[styles.tabBtnText, activeTab === 'CHAT' && styles.activeTabText]}>💬 AI HUD</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'TOOLS' && styles.activeTabBtn]} 
          onPress={() => setActiveTab('TOOLS')}>
          <Text style={[styles.tabBtnText, activeTab === 'TOOLS' && styles.activeTabText]}>⚡ TOOLS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'IDE' && styles.activeTabBtn]} 
          onPress={() => setActiveTab('IDE')}>
          <Text style={[styles.tabBtnText, activeTab === 'IDE' && styles.activeTabText]}>💻 CODING</Text>
        </TouchableOpacity>
      </View>

      {/* Main Dynamic View Canvas (Morphs based on activeTab) */}
      <View style={styles.canvasContainer}>
        
        {/* VIEW 1: AI CHAT & VISUALIZER */}
        {activeTab === 'CHAT' && (
          <View style={{ flex: 1 }}>
            {/* Holographic Arc Reactor */}
            <View style={styles.reactorContainer}>
              <View style={styles.outerReactor}>
                <View style={styles.innerReactor}>
                  <Text style={styles.reactorText}>QWEN</Text>
                </View>
              </View>
            </View>

            <ScrollView style={styles.chatStream} contentContainerStyle={{ paddingBottom: 10 }}>
              {messages.map((item) => (
                <View key={item.id} style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                  <Text style={styles.bubbleText}>{item.text}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* VIEW 2: ANDROID CONTROL CENTER (CARDS) */}
        {activeTab === 'TOOLS' && (
          <ScrollView style={styles.toolsGrid}>
            <Text style={styles.sectionHeader}>SYSTEM CONTROL CENTER</Text>

            <View style={styles.cardRow}>
              {/* Torch Card */}
              <TouchableOpacity 
                style={[styles.toolCard, torchActive && styles.toolCardActive]} 
                onPress={() => setTorchActive(!torchActive)}>
                <Text style={styles.cardIcon}>🔦</Text>
                <Text style={styles.cardTitle}>Flashlight</Text>
                <Text style={styles.cardStatus}>{torchActive ? 'ON' : 'OFF'}</Text>
              </TouchableOpacity>

              {/* Camera Quick Action Card */}
              <TouchableOpacity style={styles.toolCard}>
                <Text style={styles.cardIcon}>📷</Text>
                <Text style={styles.cardTitle}>Camera Launch</Text>
                <Text style={styles.cardSub}>Ready</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cardRow}>
              {/* System Monitor Card */}
              <View style={styles.toolCardLarge}>
                <Text style={styles.cardIcon}>📊</Text>
                <Text style={styles.cardTitle}>System Diagnostics</Text>
                <Text style={styles.cardSub}>• CPU Status: Operational</Text>
                <Text style={styles.cardSub}>• AI Model Latency: 42ms</Text>
                <Text style={styles.cardSub}>• Battery Efficiency: 98%</Text>
              </View>
            </View>
          </ScrollView>
        )}

        {/* VIEW 3: AI CODING STUDIO (IDE) */}
        {activeTab === 'IDE' && (
          <View style={styles.ideContainer}>
            <View style={styles.ideHeader}>
              <Text style={styles.ideTitle}>📄 main_script.js</Text>
              <TouchableOpacity style={styles.runBtn}>
                <Text style={styles.runBtnText}>▶ RUN</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.codeArea}
              multiline
              value={codeContent}
              onChangeText={setCodeContent}
              placeholderTextColor="#2e4259"
            />
            <View style={styles.terminalConsole}>
              <Text style={styles.terminalText}>[Console]: AI Engine connected to Code Workspace.</Text>
            </View>
          </View>
        )}
      </View>

      {/* Bottom Unified Input Control Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.voiceBtn}>
          <Text style={styles.voiceBtnText}>🎤</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.mainInput}
          placeholder="Command သို့မဟုတ် စာရိုက်ပါ..."
          placeholderTextColor="#3a546e"
          value={inputText}
          onChangeText={setInputText}
        />

        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>➤</Text>
        </TouchableOpacity>
      </View>

      {/* Side Settings Drawer Modal */}
      <Modal visible={isDrawerOpen} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsDrawerOpen(false)}>
          <View style={styles.drawerContainer}>
            <Text style={styles.drawerTitle}>⚙️ JARVIS SETTINGS</Text>
            
            <TouchableOpacity style={styles.drawerItem} onPress={() => { setActiveTab('CHAT'); setIsDrawerOpen(false); }}>
              <Text style={styles.drawerItemText}>💬 Main AI Companion</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.drawerItem} onPress={() => { setActiveTab('TOOLS'); setIsDrawerOpen(false); }}>
              <Text style={styles.drawerItemText}>⚡ Android Tools & Hardware</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.drawerItem} onPress={() => { setActiveTab('IDE'); setIsDrawerOpen(false); }}>
              <Text style={styles.drawerItemText}>💻 AI Live Coding Studio</Text>
            </TouchableOpacity>

            <View style={styles.drawerDivider} />

            <Text style={styles.drawerSectionText}>Qwen AI Config</Text>
            <Text style={styles.drawerSubText}>• Model: Qwen 2.5-7B Instruct</Text>
            <Text style={styles.drawerSubText}>• Mode: Dynamic UI Generation</Text>

            <TouchableOpacity style={styles.closeDrawerBtn} onPress={() => setIsDrawerOpen(false)}>
              <Text style={styles.closeDrawerText}>CLOSE PANEL</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030811' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 35, paddingBottom: 10, borderBottomWidth: 1, borderColor: '#0d223a' },
  menuBtn: { padding: 8, backgroundColor: '#09182a', borderRadius: 8, borderWidth: 1, borderColor: '#00f2fe' },
  menuBtnText: { fontSize: 16 },
  titleContainer: { alignItems: 'center' },
  appTitle: { color: '#00f2fe', fontSize: 16, fontWeight: 'bold', letterSpacing: 1.5 },
  subTitle: { color: '#00ff88', fontSize: 9, fontWeight: '600', letterSpacing: 1 },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#00ff88' },

  tabBar: { flexDirection: 'row', backgroundColor: '#071322', marginHorizontal: 16, marginTop: 10, borderRadius: 10, padding: 4, borderWidth: 1, borderColor: '#0d223a' },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  activeTabBtn: { backgroundColor: '#0f294a', borderWidth: 1, borderColor: '#00f2fe' },
  tabBtnText: { color: '#52789c', fontSize: 11, fontWeight: 'bold' },
  activeTabText: { color: '#00f2fe' },

  canvasContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 10 },

  /* Reactor & Chat Styles */
  reactorContainer: { alignItems: 'center', marginVertical: 8 },
  outerReactor: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#00f2fe', justifyContent: 'center', alignItems: 'center' },
  innerReactor: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0, 242, 254, 0.2)', justifyContent: 'center', alignItems: 'center' },
  reactorText: { color: '#00f2fe', fontSize: 10, fontWeight: 'bold' },
  chatStream: { flex: 1 },
  bubble: { padding: 12, borderRadius: 12, marginVertical: 4, maxWidth: '85%' },
  aiBubble: { backgroundColor: '#09192c', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#112d4e' },
  userBubble: { backgroundColor: '#004d73', alignSelf: 'flex-end' },
  bubbleText: { color: '#dcf4ff', fontSize: 13, lineHeight: 18 },

  /* Tools Cards Styles */
  toolsGrid: { flex: 1 },
  sectionHeader: { color: '#00f2fe', fontSize: 12, fontWeight: 'bold', marginBottom: 12, letterSpacing: 1 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  toolCard: { flex: 1, backgroundColor: '#09182a', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#112d4e', marginHorizontal: 4, alignItems: 'center' },
  toolCardActive: { borderColor: '#00ff88', backgroundColor: '#092823' },
  toolCardLarge: { flex: 1, backgroundColor: '#09182a', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#112d4e', marginHorizontal: 4 },
  cardIcon: { fontSize: 24, marginBottom: 6 },
  cardTitle: { color: '#00f2fe', fontWeight: 'bold', fontSize: 13 },
  cardStatus: { color: '#00ff88', fontWeight: 'bold', fontSize: 11, marginTop: 4 },
  cardSub: { color: '#7a9bbd', fontSize: 11, marginTop: 2 },

  /* IDE Styles */
  ideContainer: { flex: 1, backgroundColor: '#051120', borderRadius: 10, borderWidth: 1, borderColor: '#112d4e', padding: 10 },
  ideHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  ideTitle: { color: '#00f2fe', fontSize: 12, fontWeight: 'bold' },
  runBtn: { backgroundColor: '#00ff88', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 6 },
  runBtnText: { color: '#030811', fontWeight: 'bold', fontSize: 11 },
  codeArea: { flex: 1, color: '#00f2fe', fontFamily: 'monospace', fontSize: 12, textAlignVertical: 'top' },
  terminalConsole: { height: 40, backgroundColor: '#02060d', borderRadius: 6, padding: 8, marginTop: 6 },
  terminalText: { color: '#00ff88', fontSize: 10, fontFamily: 'monospace' },

  /* Bottom Input Bar */
  bottomBar: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#051120', borderTopWidth: 1, borderColor: '#0d223a' },
  voiceBtn: { backgroundColor: '#09182a', width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#00f2fe' },
  voiceBtnText: { fontSize: 18 },
  mainInput: { flex: 1, backgroundColor: '#09182a', color: '#dcf4ff', paddingHorizontal: 14, borderRadius: 10, borderWidth: 1, borderColor: '#112d4e', marginHorizontal: 8, fontSize: 13 },
  sendBtn: { backgroundColor: '#00f2fe', width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  sendBtnText: { color: '#030811', fontSize: 16, fontWeight: 'bold' },

  /* Modal Drawer Styles */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(3, 8, 17, 0.85)', justifyContent: 'flex-start' },
  drawerContainer: { width: '75%', height: '100%', backgroundColor: '#071527', padding: 20, borderRightWidth: 1, borderColor: '#00f2fe' },
  drawerTitle: { color: '#00f2fe', fontSize: 16, fontWeight: 'bold', marginBottom: 20, letterSpacing: 1 },
  drawerItem: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#0d223a' },
  drawerItemText: { color: '#dcf4ff', fontSize: 14, fontWeight: '600' },
  drawerDivider: { height: 1, backgroundColor: '#00f2fe', marginVertical: 20 },
  drawerSectionText: { color: '#00ff88', fontSize: 12, fontWeight: 'bold', marginBottom: 6 },
  drawerSubText: { color: '#688cae', fontSize: 11, marginVertical: 2 },
  closeDrawerBtn: { marginTop: 30, backgroundColor: '#09182a', padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#00f2fe' },
  closeDrawerText: { color: '#00f2fe', fontWeight: 'bold', fontSize: 12 }
});
