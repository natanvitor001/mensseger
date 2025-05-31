// screens/OTPScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';

const OTPScreen = ({ route }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const { confirmation } = route.params;

  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      await confirmation.confirm(code);
      alert('Login bem-sucedido!');
    } catch (error) {
      alert('Código inválido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Digite o código que você recebeu por SMS:</Text>
      <TextInput
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />
      <Button title={loading ? 'Verificando...' : 'Verificar'} onPress={handleVerifyCode} />
    </View>
  );
};

export default OTPScreen;
