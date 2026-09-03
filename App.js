import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, StatusBar, Animated, Easing } from 'react-native';

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'System Initialized. JARVIS Online.' }
  ]);
  const [inputText, setInputText] = useState('');
  
  // Animation for AI Core
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotation Animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Pulsing Animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [1], // ဤနေရာတွင် အမှားကို ပြင်ဆင်ပြီး ဖြစ်သည်
    outputRange: ['0deg', '360deg'],
  });

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: inputText }]);
    setInputText('');
    
    // AI Response Simulation
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: 'Processing your command...' }]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#02060c" />
      
      {/* Header HUD */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>ARKAR LINN THIT</Text>
          <Text style={styles.subTitle}>SUPER AI INTERFACE</Text>
        </View>
        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>CORE STATUS</Text>
          <Text style={styles.statusValue}>STABLE</Text>
        </View>
      </View>

      {/* Animated Arc Reactor Core */}
      <View style={styles.coreWrapper}>
        <Animated.View style={[styles.outerRing, { transform: [{ rotate: spin }] }]}>
          <View style={styles.ringNotch} />
          <View style={[styles.ringNotch, { transform: [{ rotate: '90deg' }] }]} />
          <View style={[styles.ringNotch, { transform: [{ rotate: '180deg' }] }]} />
          <View style={[styles.ringNotch, { transform: [{ rotate: '270deg' }] }]} />
        </Animated.View>
        <Animated.View style={[styles.innerCore, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.coreGlow} />
        </Animated.View>
      </View>

      {/* Chat Display */}
      <ScrollView style={styles.chatArea} showsVerticalScrollIndicator={false}>
        {messages.map((item) => (
          <View key={item.id} style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Control HUD */}
      <View style={styles.footer}>
        <View style={styles.actionGrid}>
          {['VOICE', 'TORCH', 'CAMERA'].map((label) => (
            <TouchableOpacity key={label} style={styles.hudBtn}>
              <Text style={styles.hudBtnText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="ENTER COMMAND..."
            placeholderTextColor="#1c3d5a"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendIcon} onPress={handleSend}>
            <Text style={{ color: '#000', fontWeight: 'bold' }}>SEND</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#02060c', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#00f2fe', paddingBottom: 10, marginTop: 20 },
  appTitle: { color: '#00f2fe', fontSize: 18, fontWeight: 'bold', letterSpacing: 3 },
  subTitle: { color: '#00f2fe', fontSize: 10, opacity: 0.6 },
  statusBox: { alignItems: 'flex-end' },
  statusLabel: { color: '#00ff88', fontSize: 8 },
  statusValue: { color: '#00ff88', fontSize: 12, fontWeight: 'bold' },

  coreWrapper: { height: 150, justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  outerRing: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#00f2fe', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center' },
  ringNotch: { position: 'absolute', width: 10, height: 4, backgroundColor: '#00f2fe' },
  innerCore: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#00f2fe', shadowColor: '#00f2fe', shadowRadius: 20, shadowOpacity: 1, elevation: 15 },
  coreGlow: { width: '100%', height: '100%', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.5)' },

  chatArea: { flex: 1, marginBottom: 10 },
  bubble: { padding: 15, borderRadius: 2, marginVertical: 8, maxWidth: '85%', borderLeftWidth: 3 },
  aiBubble: { backgroundColor: 'rgba(0, 242, 254, 0.05)', alignSelf: 'flex-start', borderLeftColor: '#00f2fe' },
  userBubble: { backgroundColor: 'rgba(0, 255, 136, 0.05)', alignSelf: 'flex-end', borderLeftColor: '#00ff88' },
  msgText: { color: '#c0d6e4', fontSize: 13, letterSpacing: 1 },

  footer: { paddingBottom: 10 },
  actionGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  hudBtn: { flex: 1, borderWidth: 1, borderColor: '#00f2fe', padding: 10, marginHorizontal: 5, alignItems: 'center', backgroundColor: 'rgba(0, 242, 254, 0.1)' },
  hudBtnText: { color: '#00f2fe', fontSize: 10, fontWeight: 'bold' },
  
  inputContainer: { flexDirection: 'row', height: 50 },
  input: { flex: 1, borderWidth: 1, borderColor: '#1c3d5a', color: '#00f2fe', paddingHorizontal: 15, fontSize: 12 },
  sendIcon: { backgroundColor: '#00f2fe', paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }
});
