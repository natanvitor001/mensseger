import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, CheckCheck, CircleAlert as AlertCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { IMessage } from '@/types/chat';
import { formatMessageTime } from '@/utils/dateUtils';

interface MessageBubbleProps {
  message: IMessage;
  isOwnMessage: boolean;
  showSender?: boolean;
}

export default function MessageBubble({ 
  message, 
  isOwnMessage,
  showSender = false,
}: MessageBubbleProps) {
  const renderMessageStatus = () => {
    if (message.status === 'failed') {
      return <AlertCircle size={14} color={COLORS.danger} />;
    } else if (message.status === 'sent' || message.status === 'delivered') {
      return <Check size={14} color={COLORS.white} />;
    } else if (message.status === 'read') {
      return <CheckCheck size={14} color={COLORS.white} />;
    }
    
    return null;
  };

  return (
    <View style={[
      styles.container,
      isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
    ]}>
      {showSender && !isOwnMessage && message.senderName && (
        <Text style={styles.senderName}>{message.senderName}</Text>
      )}
      
      <View style={[
        styles.bubble,
        isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
        message.status === 'failed' && styles.failedMessage
      ]}>
        <Text style={[
          styles.messageText,
          isOwnMessage ? styles.ownMessageText : styles.otherMessageText
        ]}>
          {message.text}
        </Text>
        
        <View style={styles.messageFooter}>
          <Text style={[
            styles.timeText,
            isOwnMessage ? styles.ownTimeText : styles.otherTimeText
          ]}>
            {formatMessageTime(message.createdAt)}
          </Text>
          
          {isOwnMessage && renderMessageStatus()}
        </View>
      </View>
      
      {message.status === 'failed' && (
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
    marginLeft: 12,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: 6,
  },
  ownMessageBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: COLORS.backgroundLight,
    borderBottomLeftRadius: 4,
  },
  failedMessage: {
    backgroundColor: COLORS.backgroundLight,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 4,
  },
  ownMessageText: {
    color: COLORS.white,
  },
  otherMessageText: {
    color: COLORS.textPrimary,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginRight: 4,
  },
  ownTimeText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  otherTimeText: {
    color: COLORS.textSecondary,
  },
  retryButton: {
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  retryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: COLORS.primary,
  },
});