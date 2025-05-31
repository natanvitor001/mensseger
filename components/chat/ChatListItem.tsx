import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Check, CheckCheck } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { IChatPreview } from '@/types/chat';
import { formatMessageTime } from '@/utils/dateUtils';

interface ChatListItemProps {
  chat: IChatPreview;
  onPress: () => void;
}

export default function ChatListItem({ chat, onPress }: ChatListItemProps) {
  const renderMessageStatus = () => {
    if (!chat.lastMessage?.isOwnMessage) return null;
    
    if (chat.lastMessage.status === 'read') {
      return <CheckCheck size={16} color={COLORS.primary} />;
    } else if (chat.lastMessage.status === 'delivered' || chat.lastMessage.status === 'sent') {
      return <Check size={16} color={COLORS.textSecondary} />;
    }
    
    return null;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{chat.name.charAt(0)}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {chat.name}
          </Text>
          <Text style={styles.time}>
            {chat.lastMessage && formatMessageTime(chat.lastMessage.createdAt)}
          </Text>
        </View>
        
        <View style={styles.messageContainer}>
          <View style={styles.messageContent}>
            {renderMessageStatus()}
            <Text style={styles.message} numberOfLines={1}>
              {chat.lastMessage?.text || 'No messages yet'}
            </Text>
          </View>
          
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: COLORS.primary,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.white,
  },
});