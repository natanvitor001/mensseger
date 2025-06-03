import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Animated, Modal, Platform } from 'react-native';
import { Menu, X, Camera, CreditCard as Edit2, MessageSquare, Users, Settings, LogOut } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function DrawerMenu() {
  const router = useRouter();
  const { currentUser, updateCustomer, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    profileImage: currentUser?.profileImage || ''
  });

  const slideAnim = useRef(new Animated.Value(-300)).current;

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    Animated.timing(slideAnim, {
      toValue: isOpen ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setFormData(prev => ({ ...prev, profileImage: result.assets[0].uri }));
    }
  };

  const handleSave = () => {
    if (currentUser) {
      updateCustomer({
        ...currentUser,
        name: formData.name,
        bio: formData.bio,
        profileImage: formData.profileImage
      });
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.replace('/auth');
    toggleDrawer();
  };

  const navigationItems = [
    {
      icon: MessageSquare,
      label: 'Chats',
      onPress: () => {
        router.push('/(tabs)/chats');
        toggleDrawer();
      }
    },
    {
      icon: Users,
      label: 'Contatos',
      onPress: () => {
        router.push('/(tabs)/contacts');
        toggleDrawer();
      }
    },
    {
      icon: Settings,
      label: 'Configurações',
      onPress: () => {
        router.push('/(tabs)/settings');
        toggleDrawer();
      }
    }
  ];

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <TouchableOpacity 
        style={styles.menuButton} 
        onPress={toggleDrawer}
      >
        <Menu size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={toggleDrawer}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.drawer,
              { transform: [{ translateX: slideAnim }] }
            ]}
          >
            <View style={styles.drawerHeader}>
              <TouchableOpacity onPress={toggleDrawer} style={styles.closeButton}>
                <X size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {isEditing ? (
              <View style={styles.editForm}>
                <TouchableOpacity 
                  style={styles.imageContainer}
                  onPress={handleImagePick}
                >
                  {formData.profileImage ? (
                    <Image 
                      source={{ uri: formData.profileImage }} 
                      style={styles.profileImage} 
                    />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Camera size={32} color={COLORS.textSecondary} />
                    </View>
                  )}
                  <View style={styles.editImageOverlay}>
                    <Camera size={20} color={COLORS.white} />
                  </View>
                </TouchableOpacity>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nome</Text>
                  <TextInput
                    value={formData.name}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                    style={styles.input}
                    placeholder="Seu nome"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Biografia</Text>
                  <TextInput
                    value={formData.bio}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text.slice(0, 150) }))}
                    style={[styles.input, styles.bioInput]}
                    placeholder="Conte um pouco sobre você"
                    multiline
                    maxLength={150}
                  />
                  <Text style={styles.charCount}>
                    {formData.bio.length}/150 caracteres
                  </Text>
                </View>

                <View style={styles.buttonGroup}>
                  <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => setIsEditing(false)}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSave}
                  >
                    <Text style={[styles.buttonText, styles.saveButtonText]}>Salvar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.profileView}>
                <View style={styles.profileHeader}>
                  {currentUser?.profileImage ? (
                    <Image 
                      source={{ uri: currentUser.profileImage }} 
                      style={styles.profileImage} 
                    />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <Text style={styles.placeholderText}>
                        {currentUser?.name?.charAt(0) || '?'}
                      </Text>
                    </View>
                  )}
                  <Text style={styles.userName}>{currentUser?.name}</Text>
                  {currentUser?.bio && (
                    <Text style={styles.userBio}>{currentUser.bio}</Text>
                  )}
                </View>

                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => setIsEditing(true)}
                >
                  <Edit2 size={20} color={COLORS.primary} />
                  <Text style={styles.editButtonText}>Editar Perfil</Text>
                </TouchableOpacity>

                <View style={styles.navigationSection}>
                  {navigationItems.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.navigationItem}
                      onPress={item.onPress}
                    >
                      <item.icon size={24} color={COLORS.textPrimary} />
                      <Text style={styles.navigationText}>{item.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity 
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <LogOut size={24} color={COLORS.danger} />
                  <Text style={styles.logoutText}>Sair</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 100,
    padding: 8,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 300,
    height: '100%',
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  profileView: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 40,
    fontFamily: 'Inter-Bold',
    color: COLORS.textSecondary,
  },
  editImageOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  userBio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 8,
    marginBottom: 30,
  },
  editButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: COLORS.primary,
  },
  navigationSection: {
    flex: 1,
    marginTop: 20,
  },
  navigationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  navigationText: {
    marginLeft: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: COLORS.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 'auto',
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: COLORS.danger,
  },
  editForm: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: COLORS.textPrimary,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: COLORS.backgroundLight,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: COLORS.textPrimary,
  },
  saveButtonText: {
    color: COLORS.white,
  },
});