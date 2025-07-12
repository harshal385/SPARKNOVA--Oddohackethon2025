export type User = {
  name: string;
  avatarUrl: string;
};

export type Tag = string;

export type Question = {
  id: string;
  title: string;
  description?: string;
  author: User;
  tags: Tag[];
  votes: number;
  answersCount: number;
  views: number;
  createdAt: Date;
  isAccepted: boolean;
};

export type Answer = {
  id: string;
  content: string;
  author: User;
  votes: number;
  createdAt: Date;
  isAccepted: boolean;
};
