export interface ProductInput {
  id: string;
  coupangLink: string;
  jsonLd: string;
  isJsonLdVisible: boolean;
  productName?: string;
  imageUrl?: string;
  price?: string;
  brand?: string;
  aggregateRating?: {
    ratingValue?: number;
    ratingCount?: number;
  };
}

export interface AggregateRating {
  ratingValue: number;
  ratingCount: number;
}

export interface ProductReview {
  rank: number;
  productName: string;
  description: string;
  pros: string[];
  cons: string[];
  price: string;
  aggregateRating: AggregateRating;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  blogTitle: string;
  introduction: string;
  products: ProductReview[];
  conclusion: string;
  metaDescription: string;
  keywords: string[];
  faq: FAQ[];
  schemaMarkup: string;
}

// Combined type for rendering, merging AI data with user input
export interface RenderableBlogPost extends BlogPost {
  products: (ProductReview & {
    imageUrl?: string;
    coupangLink: string;
  })[];
}