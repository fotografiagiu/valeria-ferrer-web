
export interface Model {
  id: string;
  name: string;
  age: number;
  height: number;
  weight?: number;
  nationality?: string;
  location: string;
  image: string;
  hoverImage: string;
  description: string;
  bio?: string;
  services?: string[];
  availability?: { [key: string]: string };
  gallery?: string[];
  featured?: boolean;
  vip?: boolean;
  vipRates?: {
    [key: string]: string;
  };
}

export interface Review {
  id: string;
  modelName: string;
  title: string;
  content: string;
  author: string;
  image?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}
