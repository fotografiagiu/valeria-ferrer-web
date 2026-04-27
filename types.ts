
export interface Model {
  id: string;
  name: string;
  age: number;
  height: number | string;
  weight?: number | string;
  nationality?: string;
  location: string;
  city?: string;
  image: string;
  hoverImage: string;
  description: string;
  bio?: string;
  essence?: string;
  services?: string[];
  availability?: string;
  languages?: string[];
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
