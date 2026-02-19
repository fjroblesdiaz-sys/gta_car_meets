export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: number;
}

export interface Car {
  id: string;
  userId: string;
  name: string;
  model: string;
  mods: string[];
  imageUrl?: string;
  createdAt: number;
}

export interface Meet {
  id: string;
  userId: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  participants: string[];
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: number;
}

export interface AppData {
  users: User[];
  cars: Car[];
  meets: Meet[];
  messages: ChatMessage[];
}
