
export interface CardInfo {
  name: string;
  logo: React.ReactNode;
  gradient: string;
}

export interface CardData extends CardInfo {
  cardNumber: string;
  balance: number;
  status: 'success' | 'error';
  readAt: string;
}

export type HistoryEntry = Omit<CardData, 'status' | 'logo' | 'gradient'>;
