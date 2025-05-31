import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { auth } from './firebase';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

export default function PhoneAuthScreen() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = React.useRef(null);

  const sendVerification = async () => {
    try {
      const provider = new PhoneAuthProvider(auth);
      const id = await provider.verifyPhoneNumber(phone, recaptchaVerifier.current);
      setVerificationId(id);
      alert('Código SMS enviado!');
    } catch (error) {
      alert(error.message);
    }
  };

  const confirmCode = async () => {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      alert('Login efetuado!');
    } catch (error) {
      alert('Erro ao verificar código: ' + error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
      />
      {!verificationId ? (
        <>
          <Text>Digite seu número com DDD:</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="+55 11 91234-5678"
            keyboardType="phone-pad"
            style={{ borderBottomWidth: 1, marginBottom: 20 }}
          />
          <Button title="Enviar código" onPress={sendVerification} />
        </>
      ) : (
        <>
          <Text>Digite o código recebido:</Text>
          <TextInput
            value={code}
            onChangeText={setCode}
            keyboardType="number-pad"
            style={{ borderBottomWidth: 1, marginBottom: 20 }}
          />
          <Button title="Verificar" onPress={confirmCode} />
        </>
      )}
    </View>
  );
}
