export interface IContact {
  id: string;
  name: string;
  phoneNumber: string;
  avatarUrl?: string;
  isOnline?: boolean;
  lastSeen?: string;
}