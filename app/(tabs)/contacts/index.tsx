import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UserPlus, Search } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import Header from '@/components/Header';
import ContactListItem from '@/components/contacts/ContactListItem';
import SearchBar from '@/components/SearchBar';
import AddContactModal from '@/components/contacts/AddContactModal';
import { getContacts } from '@/services/contactService';
import { IContact } from '@/types/contact';

export default function ContactsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [contacts, setContacts] = useState<IContact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<IContact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddContactModalVisible, setIsAddContactModalVisible] = useState(false);
  
  useEffect(() => {
    // Load contacts
    const loadContacts = async () => {
      const userContacts = await getContacts();
      setContacts(userContacts);
      setFilteredContacts(userContacts);
    };
    
    loadContacts();
  }, []);

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

  const handleContactPress = (contactId: string) => {
    // Navigate to contact detail or start a chat
    router.push(`/contact/${contactId}`);
  };

  const handleAddContact = () => {
    setIsAddContactModalVisible(true);
  };

  const renderAlphabeticalHeader = (letter: string) => (
    <Text style={styles.sectionHeader}>{letter}</Text>
  );

  const organizeContactsByAlphabet = () => {
    const sortedContacts = [...filteredContacts].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    
    return sortedContacts;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Contacts" />
      
      <SearchBar 
        placeholder="Search contacts..." 
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={<Search size={20} color={COLORS.textSecondary} />}
      />
      
      <FlatList
        data={organizeContactsByAlphabet()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ContactListItem
            contact={item}
            onPress={() => handleContactPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No contacts yet</Text>
            <TouchableOpacity 
              style={styles.addContactButton}
              onPress={handleAddContact}
            >
              <Text style={styles.addContactButtonText}>Add a new contact</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={handleAddContact}
      >
        <UserPlus size={24} color={COLORS.white} />
      </TouchableOpacity>

      <AddContactModal
        visible={isAddContactModalVisible}
        onClose={() => setIsAddContactModalVisible(false)}
        onAddContact={(newContact) => {
          setContacts([...contacts, newContact]);
          setIsAddContactModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    backgroundColor: COLORS.backgroundLight,
    color: COLORS.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  addContactButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  addContactButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.white,
  },
  fabButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(59, 130, 246, 0.3)',
      },
    }),
  },
});