import { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, FlatList, TextInput, TouchableWithoutFeedback } from 'react-native';
import { X, UserPlus, Trash } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import Button from '@/components/Button';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useRouter } from 'expo-router';
import { updateGroupName, addGroupMembers, removeGroupMember, deleteGroup } from '@/services/groupService';

interface GroupInfoModalProps {
  visible: boolean;
  group: any;
  onClose: () => void;
  onGroupUpdated: (updatedGroup: any) => void;
}

export default function GroupInfoModal({
  visible,
  group,
  onClose,
  onGroupUpdated,
}: GroupInfoModalProps) {
  const router = useRouter();
  const [groupName, setGroupName] = useState(group.name);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleUpdateName = async () => {
    if (!groupName.trim() || groupName === group.name) {
      setGroupName(group.name);
      setIsEditing(false);
      return;
    }
    
    try {
      const updatedGroup = await updateGroupName(group.id, groupName);
      onGroupUpdated(updatedGroup);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update group name:', error);
      setGroupName(group.name);
      setIsEditing(false);
    }
  };
  
  const handleRemoveMember = async (memberId: string) => {
    try {
      const updatedGroup = await removeGroupMember(group.id, memberId);
      onGroupUpdated(updatedGroup);
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };
  
  const handleDeleteGroup = async () => {
    try {
      await deleteGroup(group.id);
      onClose();
      router.replace('/(tabs)/chats');
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };
  
  const renderMemberItem = ({ item }: { item: any }) => (
    <View style={styles.memberItem}>
      <View style={styles.memberAvatar}>
        <Text style={styles.memberAvatarText}>{item.name.charAt(0)}</Text>
      </View>
      
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberPhone}>{item.phoneNumber}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveMember(item.id)}
      >
        <X size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );
  
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
                <Text style={styles.title}>Group Info</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <X size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.groupInfoSection}>
                <View style={styles.groupAvatarContainer}>
                  <Text style={styles.groupAvatarText}>
                    {group.name.charAt(0)}
                  </Text>
                </View>
                
                {isEditing ? (
                  <View style={styles.editNameContainer}>
                    <TextInput
                      style={styles.nameInput}
                      value={groupName}
                      onChangeText={setGroupName}
                      autoFocus
                    />
                    <Button
                      title="Save"
                      onPress={handleUpdateName}
                      size="small"
                      style={styles.saveButton}
                    />
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.groupNameContainer}
                    onPress={() => setIsEditing(true)}
                  >
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.editText}>Edit</Text>
                  </TouchableOpacity>
                )}
                
                <Text style={styles.memberCount}>
                  {group.members?.length || 0} members
                </Text>
              </View>
              
              <View style={styles.membersSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Members</Text>
                  <TouchableOpacity style={styles.addButton}>
                    <UserPlus size={20} color={COLORS.primary} />
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={group.members || []}
                  keyExtractor={(item) => item.id}
                  renderItem={renderMemberItem}
                  contentContainerStyle={styles.membersList}
                />
              </View>
              
              <View style={styles.footer}>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => setShowDeleteConfirm(true)}
                >
                  <Trash size={20} color={COLORS.danger} />
                  <Text style={styles.deleteText}>Delete Group</Text>
                </TouchableOpacity>
              </View>
              
              <ConfirmDialog
                visible={showDeleteConfirm}
                title="Delete Group"
                message="Are you sure you want to delete this group? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDeleteGroup}
                onCancel={() => setShowDeleteConfirm(false)}
                isDestructive={true}
              />
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
  groupInfoSection: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  groupAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  groupAvatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: COLORS.primary,
  },
  groupNameContainer: {
    alignItems: 'center',
  },
  groupName: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  editText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.primary,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameInput: {
    height: 40,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    minWidth: 200,
  },
  saveButton: {
    height: 40,
  },
  memberCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  membersSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 4,
  },
  membersList: {
    paddingBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  memberPhone: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.danger,
    borderRadius: 8,
  },
  deleteText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.danger,
    marginLeft: 8,
  },
});