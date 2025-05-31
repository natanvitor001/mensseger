import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Search } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import Header from '@/components/Header';
import ChatListItem from '@/components/chat/ChatListItem';
import SearchBar from '@/components/SearchBar';
import NewChatModal from '@/components/chat/NewChatModal';
import { getRecentChats } from '@/services/chatService';
import { IChatPreview } from '@/types/chat';

export default function ChatsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [chats, setChats] = useState<IChatPreview[]>([]);
  const [filteredChats, setFilteredChats] = useState<IChatPreview[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewChatModalVisible, setIsNewChatModalVisible] = useState(false);

  useEffect(() => {
    // Load chats
    const loadChats = async () => {
      const recentChats = await getRecentChats();
      setChats(recentChats);
      setFilteredChats(recentChats);
    };
    
    loadChats();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchQuery, chats]);

  const handleChatPress = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const handleNewChat = () => {
    setIsNewChatModalVisible(true);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title="Messages" />
      
      <SearchBar 
        placeholder="Search messages..." 
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={<Search size={20} color={COLORS.textSecondary} />}
      />
      
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatListItem
            chat={item}
            onPress={() => handleChatPress(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No chats yet</Text>
            <TouchableOpacity 
              style={styles.newChatButton}
              onPress={handleNewChat}
            >
              <Text style={styles.newChatButtonText}>Start a new chat</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={handleNewChat}
      >
        <Plus size={24} color={COLORS.white} />
      </TouchableOpacity>

      <NewChatModal
        visible={isNewChatModalVisible}
        onClose={() => setIsNewChatModalVisible(false)}
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
  newChatButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  newChatButtonText: {
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