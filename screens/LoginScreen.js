// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { sendOTP } from '../utils/firebaseAuth';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    setLoading(true);
    try {
      const confirmation = await sendOTP(phone);
      navigation.navigate('OTPScreen', { confirmation });
    } catch (error) {
      alert('Erro ao enviar SMS: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Digite seu número com DDD + 55:</Text>
      <TextInput
        keyboardType="phone-pad"
        placeholder="+55 11 91234-5678"
        value={phone}
        onChangeText={setPhone}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title={loading ? 'Enviando...' : 'Enviar Código'} onPress={handleSendCode} />
      <div id="recaptcha-container"></div>
    </View>
  );
};

export default LoginScreen;
