import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Send, Image as ImageIcon, Users, MoveVertical as MoreVertical,  ChevronDown } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { IMessage } from '@/types/chat';
import { getGroupById, sendGroupMessage, getGroupMessages } from '@/services/groupService';
import { useAuth } from '@/context/AuthContext';
import MessageBubble from '@/components/chat/MessageBubble';
import GroupInfoModal from '@/components/groups/GroupInfoModal';

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [group, setGroup] = useState<any>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  useEffect(() => {
    const loadGroup = async () => {
      if (typeof id !== 'string') return;
      
      try {
        const groupData = await getGroupById(id);
        setGroup(groupData);
        
        const messagesData = await getGroupMessages(id);
        setMessages(messagesData);
      } catch (error) {
        console.error('Error loading group:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGroup();
  }, [id]);
  
  const handleSendMessage = async () => {
    if (!messageText.trim() || !user || typeof id !== 'string') return;
    
    const newMessage: IMessage = {
      id: Date.now().toString(),
      text: messageText,
      senderId: user.id,
      senderName: user.name,
      createdAt: new Date().toISOString(),
      status: 'sending',
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessageText('');
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    try {
      await sendGroupMessage(id, messageText);
      
      // Update message status to sent
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update message status to failed
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'failed' } : msg
        )
      );
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.headerInfo}
          onPress={() => setShowGroupInfo(true)}
        >
          <Text style={styles.headerTitle}>{group?.name || 'Group'}</Text>
          <Text style={styles.headerSubtitle}>
            {group?.members?.length || 0} members
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => setShowGroupInfo(true)}
        >
          <MoreVertical size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
      
      {/* Messages */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble 
              message={item} 
              isOwnMessage={item.senderId === user?.id}
              showSender={true}
            />
          )}
          contentContainerStyle={styles.messagesList}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />
      )}
      
      {/* Scroll to bottom button */}
      {messages.length > 5 && (
        <TouchableOpacity 
          style={styles.scrollButton}
          onPress={() => flatListRef.current?.scrollToEnd({ animated: true })}
        >
          <ChevronDown size={20} color={COLORS.white} />
        </TouchableOpacity>
      )}
      
      {/* Message Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachButton}>
            <ImageIcon size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={messageText}
            onChangeText={setMessageText}
            multiline
          />
          
          {messageText.trim() ? (
            <TouchableOpacity 
              style={[styles.sendButton, styles.sendButtonActive]}
              onPress={handleSendMessage}
            >
              <Send size={20} color={COLORS.white} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.sendButton}>
              <Send size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Group Info Modal */}
      {group && (
        <GroupInfoModal
          visible={showGroupInfo}
          group={group}
          onClose={() => setShowGroupInfo(false)}
          onGroupUpdated={(updatedGroup) => setGroup(updatedGroup)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 16 + insets.bottom : 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    backgroundColor: COLORS.backgroundLight,
  },
  sendButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
  },
  sendButtonActive: {
    backgroundColor: COLORS.primary,
  },
  scrollButton: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
      },
    }),
  },
});