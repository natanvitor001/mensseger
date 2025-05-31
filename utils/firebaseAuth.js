// utils/firebaseAuth.js
import { auth } from '../firebase';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { Platform } from 'react-native';

// Cria o Recaptcha invisível no início
export const setupRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'recaptcha-container',
      {
        size: 'invisible',
        callback: (response) => {
          console.log('Recaptcha resolvido');
        },
      },
      auth
    );
  }
};

export const sendOTP = async (phoneNumber) => {
  setupRecaptcha();
  const appVerifier = window.recaptchaVerifier;
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    throw error;
  }
};
