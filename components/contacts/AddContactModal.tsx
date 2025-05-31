import { useState } from 'react';
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { COLORS } from '@/constants/Colors';
import Button from '@/components/Button';
import { addContact } from '@/services/contactService';
import { IContact } from '@/types/contact';
import { X } from 'lucide-react-native';

interface AddContactModalProps {
  visible: boolean;
  onClose: () => void;
  onAddContact: (contact: IContact) => void;
}

export default function AddContactModal({
  visible,
  onClose,
  onAddContact,
}: AddContactModalProps) {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleAddContact = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    
    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }
    
    setIsLoading(true);
    try {
      const newContact = await addContact(name, phoneNumber);
      onAddContact(newContact);
      resetForm();
    } catch (err) {
      setError('Failed to add contact. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setPhoneNumber('');
    setError('');
  };
  
  const onModalClose = () => {
    resetForm();
    onClose();
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onModalClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Contact</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onModalClose}>
              <X size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.formContainer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter contact name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError('');
                }}
                autoCapitalize="words"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  setError('');
                }}
                keyboardType="phone-pad"
              />
            </View>
            
            <Button
              title="Add Contact"
              onPress={handleAddContact}
              isLoading={isLoading}
              disabled={isLoading || !name.trim() || !phoneNumber.trim()}
              style={styles.addButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.danger,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  addButton: {
    marginTop: 8,
  },
});