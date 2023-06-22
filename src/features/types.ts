type TelegramUpdates = {
    date?: number;
    message?: {
      chat: {
        id: number;
        username: string;
        first_name: string;
      }
    }
  }
  type UserDetails = {
    username?: string;
    chatId?: number;
    isUserSubscribed?: boolean;
    name?: string;
  }


export type { TelegramUpdates, UserDetails };