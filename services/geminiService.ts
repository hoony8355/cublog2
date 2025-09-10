import { GoogleGenAI, Type } from "@google/genai";
import { BlogPost, ProductInput } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = "gemini-2.5-flash";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    blogTitle: { type: Type.STRING, description: "A catchy, SEO-friendly title for the blog post in Korean." },
    introduction: { type: Type.STRING, description: "An engaging introductory paragraph in Korean." },
    products: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          rank: { type: Type.INTEGER },
          productName: { type: Type.STRING },
          description: { type: Type.STRING },
          pros: { type: Type.ARRAY, items: { type: Type.STRING } },
          cons: { type: Type.ARRAY, items: { type: Type.STRING } },
          price: { type: Type.STRING },
          aggregateRating: {
            type: Type.OBJECT,
            properties: {
              ratingValue: { type: Type.NUMBER },
              ratingCount: { type: Type.INTEGER }
            },
            required: ["ratingValue", "ratingCount"],
          }
        },
        required: ["rank", "productName", "description", "pros", "cons", "price", "aggregateRating"],
      }
    },
    conclusion: { type: Type.STRING, description: "A concluding paragraph in Korean." },
    metaDescription: { type: Type.STRING, description: "A 150-160 character meta description in Korean for SEO." },
    keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of relevant SEO keywords in Korean." },
    faq: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING }
        },
        required: ["question", "answer"],
      }
    },
    schemaMarkup: { type: Type.STRING, description: "A minified string containing a valid and comprehensive JSON-LD schema including BlogPosting, Review, Product, and FAQPage." }
  },
  required: ["blogTitle", "introduction", "products", "conclusion", "metaDescription", "keywords", "faq", "schemaMarkup"],
};


export async function generateBlogPost(topic: string, products: ProductInput[]): Promise<BlogPost> {
  const today = new Date().toISOString().split('T')[0];

  const productDetails = products.map((p, index) => 
    `Product ${index + 1}: Name='${p.productName}', Price='${p.price}', Brand='${p.brand}', Rating='${p.aggregateRating?.ratingValue}', Reviews='${p.aggregateRating?.ratingCount}'`
  ).join('\n');

  const prompt = `
    You are a world-class Korean SEO content strategist and copywriter with deep expertise in creating high-ranking affiliate marketing content that secures rich snippets on Google. Your goal is to generate a comprehensive, engaging, and perfectly optimized blog post.

    The blog post topic is: "${topic}".
    It should be a "Top ${products.length}" review format.
    The entire output MUST be in Korean and strictly adhere to the provided JSON schema.

    Base your content on the following products:
    ${productDetails}

    **CRITICAL SEO & CONTENT REQUIREMENTS:**

    1.  **Content Quality & User Intent:** Write compelling, user-centric content. The tone should be helpful and trustworthy, guiding the reader to a confident purchase decision. Address the user's likely questions and concerns throughout the text.
    2.  **Keyword Integration:** Naturally weave the main keywords from the topic "${topic}" and semantically related keywords (e.g., synonyms, related concepts) into the 'blogTitle', 'introduction', product descriptions, 'conclusion', and 'faq' section.
    3.  **Leverage Credibility Metrics:** Explicitly mention the brand and impressive 'aggregateRating' (rating value and count) in the review text to build trust and social proof. For example, mention things like "1,000개가 넘는 리뷰에서 4.5점의 높은 평점을 받은 제품입니다."
    4.  **FAQ Section:** Create a 'faq' section with 3-5 relevant questions a user might have before buying these products. This is crucial for capturing "People Also Ask" snippets and long-tail keywords.
    5.  **World-Class Schema Markup:** This is the most important part. Generate a single, minified JSON string for 'schemaMarkup'. This JSON string MUST:
        - Use an "@graph" array to contain multiple, interconnected schema objects.
        - Include a 'BlogPosting' schema: Populate fields like 'headline', 'description', 'image' (use the first product image), 'author' (Type: 'Person', Name: '콘텐츠 전문가'), 'publisher' (Type: 'Organization', Name: '블로그 이름', Logo: (Type: 'ImageObject', URL: 'https://example.com/logo.png')), 'datePublished': '${today}', and 'dateModified': '${today}'.
        - Nest 'review' properties within the 'BlogPosting' for EACH of the ${products.length} products. Each review must be a 'Review' schema with 'author' (same as post author), 'reviewRating' ('ratingValue' from the provided 'aggregateRating', 'bestRating': '5'), and a 'reviewBody' summarizing the review.
        - The 'itemReviewed' in each 'Review' must be a full 'Product' schema, including 'name', 'image' (from input), 'description', 'brand' (Type: 'Brand', Name: from input), 'offers' ('price', 'priceCurrency': 'KRW', 'availability': 'https://schema.org/InStock'), and most importantly, an 'aggregateRating' object with '@type': 'AggregateRating', 'ratingValue', and 'ratingCount' from the provided product data.
        - Include an 'FAQPage' schema containing ALL questions and answers from the 'faq' section.
        - Remember to properly escape all double quotes within the final JSON string (e.g., \\").

    Produce ONLY the JSON object that conforms to the schema. No other text or explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text;
    const parsedContent = JSON.parse(jsonString) as BlogPost;
    
    // Sort products by rank just in case the AI didn't
    parsedContent.products.sort((a, b) => a.rank - b.rank);

    return parsedContent;

  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw new Error("Failed to generate SEO content from Gemini API.");
  }
}