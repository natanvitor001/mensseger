import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Home, MessageSquare, Phone, HelpCircle } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';

export default function Footer() {
  const links = [
    {
      icon: Home,
      label: 'Início',
      href: '/'
    },
    {
      icon: MessageSquare,
      label: 'Chat',
      href: '/chat'
    },
    {
      icon: Phone,
      label: 'Contato',
      href: '/contact'
    },
    {
      icon: HelpCircle,
      label: 'Ajuda',
      href: '/help'
    }
  ];

  return (
    <View style={styles.footer}>
      {links.map((link, index) => (
        <Link href={link.href} key={index} asChild>
          <TouchableOpacity style={styles.linkItem}>
            <link.icon size={24} color={COLORS.textSecondary} />
            <Text style={styles.linkText}>{link.label}</Text>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px -2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  linkItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  linkText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: 'Inter-Medium',
  }
});