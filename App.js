import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar, Animated, Easing, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [viewMode, setViewMode] = useState('chat'); // 'chat', 'terminal', 'system'
  const [messages, setMessages] = useState([{ id: 1, sender: 'ai', text: 'ARKAR LINN THIT OS Online. Welcome, Boss.' }]);
  const [inputText, setInputText] = useState('');
  
  // Animation Values
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Rotating Rings
    Animated.loop(Animated.timing(rotateAnim, { toValue: 1, duration: 8000, easing: Easing.linear, useNativeDriver: true })).start();
    // Core Pulsing
    Animated.loop(Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 1.1, duration: 2000, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
    ])).start();
    // HUD Scanline
    Animated.loop(Animated.timing(scanLineAnim, { toValue: height, duration: 4000, easing: Easing.linear, useNativeDriver: true })).start();
  }, []);

  const spin = rotateAnim.interpolate({ inputRange: [1], outputRange: ['0deg', '360deg'] });
  const reverseSpin = rotateAnim.interpolate({ inputRange: [1], outputRange: ['360deg', '0deg'] });

  const handleCommand = () => {
    const cmd = inputText.toLowerCase();
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: inputText }]);
    
    if (cmd.includes('terminal') || cmd.includes('ကုဒ်')) {
      setViewMode('terminal');
    } else if (cmd.includes('system') || cmd.includes('စနစ်')) {
      setViewMode('system');
    } else {
      setViewMode('chat');
    }
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      
      {/* Background Scanline HUD Effect */}
      <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLineAnim }] }]} />

      {/* Header HUD Information */}
      <View style={styles.hudHeader}>
        <View>
          <Text style={styles.hudTitle}>ARKAR LINN THIT V5.0</Text>
          <Text style={styles.hudSubTitle}>GENERATIVE AI OS LAYER</Text>
        </View>
        <View style={styles.hudStats}>
          <Text style={styles.statText}>CPU: 24%  |  RAM: 1.2GB</Text>
          <Text style={styles.statText}>LOC: YANGON, MM</Text>
        </View>
      </View>

      {/* Main Workspace (Generative UI) */}
      <View style={styles.workspace}>
        {viewMode === 'chat' && (
          <ScrollView style={styles.chatArea}>
            {messages.map(m => (
              <View key={m.id} style={[styles.bubble, m.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
                <Text style={styles.msgText}>{m.text}</Text>
              </View>
            ))}
          </ScrollView>
        )}

        {viewMode === 'terminal' && (
          <View style={styles.fullScreenWidget}>
            <Text style={styles.terminalText}>[root@arkarlinnthit ~]# Initializing Shell...</Text>
            <Text style={styles.terminalText}>[info] Qwen-Core successfully linked.</Text>
            <Text style={styles.terminalText}>[info] Ready for code injection.</Text>
            <TouchableOpacity onPress={() => setViewMode('chat')} style={styles.closeBtn}><Text style={styles.closeBtnText}>CLOSE</Text></TouchableOpacity>
          </View>
        )}

        {viewMode === 'system' && (
          <View style={styles.fullScreenWidget}>
            <Text style={styles.hudTitle}>SYSTEM DIAGNOSTICS</Text>
            <View style={styles.diagBar}><View style={[styles.diagFill, {width: '70%'}]} /></View>
            <Text style={styles.statText}>POWER LEVEL: OPTIMAL</Text>
            <TouchableOpacity onPress={() => setViewMode('chat')} style={styles.closeBtn}><Text style={styles.closeBtnText}>BACK</Text></TouchableOpacity>
          </View>
        )}
      </View>

      {/* Central Animated Arc Reactor Core */}
      <View style={styles.coreWrapper}>
        <Animated.View style={[styles.ringLarge, { transform: [{ rotate: spin }] }]} />
        <Animated.View style={[styles.ringSmall, { transform: [{ rotate: reverseSpin }] }]} />
        <Animated.View style={[styles.innerCore, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.coreTag}>AL</Text>
        </Animated.View>
      </View>

      {/* Bottom Control HUD */}
      <View style={styles.footerHUD}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="INPUT COMMAND..."
            placeholderTextColor="rgba(0, 242, 254, 0.3)"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity onPress={handleCommand} style={styles.sendIcon}>
            <Text style={{ color: '#000', fontWeight: 'bold' }}>EXEC</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#02060c' },
  scanLine: { position: 'absolute', width: '100%', height: 2, backgroundColor: 'rgba(0, 242, 254, 0.1)', zIndex: 1 },
  
  hudHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 242, 254, 0.2)' },
  hudTitle: { color: '#00f2fe', fontSize: 16, fontWeight: 'bold', letterSpacing: 2 },
  hudSubTitle: { color: '#00f2fe', fontSize: 8, opacity: 0.5 },
  hudStats: { alignItems: 'flex-end' },
  statText: { color: '#00ff88', fontSize: 10, fontFamily: 'monospace' },

  workspace: { flex: 1, padding: 15 },
  fullScreenWidget: { flex: 1, backgroundColor: 'rgba(0, 20, 40, 0.8)', padding: 20, borderTopWidth: 2, borderColor: '#00f2fe' },
  terminalText: { color: '#00ff88', fontFamily: 'monospace', fontSize: 12, marginBottom: 5 },
  closeBtn: { marginTop: 20, padding: 10, borderWidth: 1, borderColor: '#ff4444', alignSelf: 'flex-start' },
  closeBtnText: { color: '#ff4444', fontSize: 10 },
  diagBar: { height: 10, width: '100%', backgroundColor: '#111', marginVertical: 10 },
  diagFill: { height: '100%', backgroundColor: '#00f2fe' },

  chatArea: { flex: 1 },
  bubble: { padding: 12, marginVertical: 5, maxWidth: '85%', borderLeftWidth: 2 },
  aiBubble: { borderLeftColor: '#00f2fe', backgroundColor: 'rgba(0, 242, 254, 0.05)' },
  userBubble: { borderLeftColor: '#00ff88', alignSelf: 'flex-end', backgroundColor: 'rgba(0, 255, 136, 0.05)' },
  msgText: { color: '#c0d6e4', fontSize: 13 },

  coreWrapper: { height: 120, justifyContent: 'center', alignItems: 'center' },
  ringLarge: { position: 'absolute', width: 100, height: 100, borderRadius: 50, borderWidth: 1, borderColor: '#00f2fe', borderStyle: 'dashed' },
  ringSmall: { position: 'absolute', width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#00ff88', borderStyle: 'dotted' },
  innerCore: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#00f2fe', justifyContent: 'center', alignItems: 'center', elevation: 20, shadowColor: '#00f2fe', shadowRadius: 10 },
  coreTag: { fontSize: 10, fontWeight: 'bold', color: '#02060c' },

  footerHUD: { padding: 20 },
  inputContainer: { flexDirection: 'row', height: 50, borderWidth: 1, borderColor: '#00f2fe', backgroundColor: 'rgba(0, 242, 254, 0.05)' },
  input: { flex: 1, paddingHorizontal: 15, color: '#00f2fe', fontSize: 12, fontFamily: 'monospace' },
  sendIcon: { width: 60, backgroundColor: '#00f2fe', justifyContent: 'center', alignItems: 'center' }
});
