import { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList, TextInput, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Search, Users, UserPlus } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { getContacts } from '@/services/contactService';
import { createChat, createGroupChat } from '@/services/chatService';
import { IContact } from '@/types/contact';
import Button from '@/components/Button';

interface NewChatModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NewChatModal({ visible, onClose }: NewChatModalProps) {
  const router = useRouter();
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<IContact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<IContact[]>([]);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [groupName, setGroupName] = useState('');
  
  useEffect(() => {
    if (visible) {
      loadContacts();
      setSelectedContacts([]);
      setIsGroupMode(false);
      setGroupName('');
      setSearchQuery('');
    }
  }, [visible]);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phoneNumber.includes(searchQuery)
      );
      setFilteredContacts(filtered);
    }
  }, [searchQuery, contacts]);
  
  const loadContacts = async () => {
    const userContacts = await getContacts();
    setContacts(userContacts);
    setFilteredContacts(userContacts);
  };
  
  const toggleContactSelection = (contact: IContact) => {
    if (isGroupMode) {
      const isSelected = selectedContacts.some(c => c.id === contact.id);
      if (isSelected) {
        setSelectedContacts(selectedContacts.filter(c => c.id !== contact.id));
      } else {
        setSelectedContacts([...selectedContacts, contact]);
      }
    } else {
      handleStartChat(contact);
    }
  };
  
  const handleStartChat = async (contact: IContact) => {
    try {
      const chatId = await createChat(contact.id);
      onClose();
      router.push(`/chat/${chatId}`);
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };
  
  const handleCreateGroup = async () => {
    if (selectedContacts.length < 2 || !groupName.trim()) return;
    
    try {
      const memberIds = selectedContacts.map(contact => contact.id);
      const groupId = await createGroupChat(groupName, memberIds);
      onClose();
      router.push(`/group/${groupId}`);
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };
  
  const toggleGroupMode = () => {
    setIsGroupMode(!isGroupMode);
    setSelectedContacts([]);
  };
  
  const isContactSelected = (contactId: string) => {
    return selectedContacts.some(contact => contact.id === contactId);
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.header}>
                <Text style={styles.title}>
                  {isGroupMode ? 'New Group' : 'New Chat'}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <X size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
              
              {isGroupMode && (
                <View style={styles.groupNameContainer}>
                  <Text style={styles.groupNameLabel}>Group Name</Text>
                  <TextInput
                    style={styles.groupNameInput}
                    placeholder="Enter group name"
                    value={groupName}
                    onChangeText={setGroupName}
                  />
                  
                  {selectedContacts.length > 0 && (
                    <View style={styles.selectedContactsContainer}>
                      <Text style={styles.selectedContactsLabel}>
                        Selected ({selectedContacts.length}):
                      </Text>
                      <View style={styles.selectedContactsChips}>
                        {selectedContacts.map(contact => (
                          <View key={contact.id} style={styles.contactChip}>
                            <Text style={styles.contactChipText} numberOfLines={1}>
                              {contact.name}
                            </Text>
                            <TouchableOpacity
                              style={styles.removeChipButton}
                              onPress={() => toggleContactSelection(contact)}
                            >
                              <X size={16} color={COLORS.white} />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              )}
              
              <View style={styles.searchContainer}>
                <Search size={20} color={COLORS.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              
              <TouchableOpacity
                style={styles.toggleModeButton}
                onPress={toggleGroupMode}
              >
                {isGroupMode ? (
                  <>
                    <UserPlus size={20} color={COLORS.primary} />
                    <Text style={styles.toggleModeText}>Start one-on-one chat</Text>
                  </>
                ) : (
                  <>
                    <Users size={20} color={COLORS.primary} />
                    <Text style={styles.toggleModeText}>Create a group</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <FlatList
                data={filteredContacts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.contactItem,
                      isGroupMode && isContactSelected(item.id) && styles.selectedContactItem
                    ]}
                    onPress={() => toggleContactSelection(item)}
                  >
                    <View style={styles.contactAvatar}>
                      <Text style={styles.contactAvatarText}>{item.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{item.name}</Text>
                      <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.contactsList}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>No contacts found</Text>
                }
              />
              
              {isGroupMode && selectedContacts.length >= 2 && (
                <View style={styles.createGroupButtonContainer}>
                  <Button
                    title="Create Group"
                    onPress={handleCreateGroup}
                    disabled={!groupName.trim() || selectedContacts.length < 2}
                  />
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: 20,
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
  groupNameContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  groupNameLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  groupNameInput: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  selectedContactsContainer: {
    marginTop: 16,
  },
  selectedContactsLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  selectedContactsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contactChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    marginBottom: 8,
    maxWidth: 150,
  },
  contactChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.white,
    flex: 1,
  },
  removeChipButton: {
    marginLeft: 4,
    padding: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  toggleModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  toggleModeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.primary,
    marginLeft: 8,
  },
  contactsList: {
    paddingHorizontal: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedContactItem: {
    backgroundColor: COLORS.backgroundLight,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactAvatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.primary,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  contactPhone: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  emptyListText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
  createGroupButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});