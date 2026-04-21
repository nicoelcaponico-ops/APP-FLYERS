import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ProductSpec {
  label: string;
  value: string;
}

export interface FlyerItem {
  id: string;
  name: string;
  specs: ProductSpec[];
  iconType: 'product' | 'box' | 'delivery' | 'discount' | 'spec';
  imageUrl?: string;
  isFeatured?: boolean;
}

export interface FlyerState {
  versionName: string;
  title: string;
  subtitle: string;
  accentTitle: string;
  description: string;
  productCategory: string;
  marketingBadge?: string; // e.g. "OFFER", "NEW", "B2B EXCLUSIVE"
  items: FlyerItem[];
  heroImageUrl?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    isDarkTheme: boolean;
    layoutStyle: 'slanted' | 'minimal' | 'grid' | 'bold' | 'asymmetric';
    fontPairing: 'tech' | 'classic' | 'brutalist';
  };
  logoConfig?: {
    size: 'sm' | 'md' | 'lg';
    position: 'top-left' | 'top-right' | 'centered';
    showLogo: boolean;
  };
  stats: {
    label: string;
    value: string;
  }[];
}

const FLYER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    variants: {
      type: Type.ARRAY,
      minItems: 4,
      maxItems: 4,
      items: {
        type: Type.OBJECT,
        properties: {
          versionName: { type: Type.STRING },
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          accentTitle: { type: Type.STRING },
          description: { type: Type.STRING },
          productCategory: { type: Type.STRING },
          marketingBadge: { type: Type.STRING, description: "Small promotional text like 'NUEVO', 'OFERTA', 'B2B'" },
          heroImageUrl: { type: Type.STRING, description: "URL for a high-quality main product image" },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                specs: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      label: { type: Type.STRING },
                      value: { type: Type.STRING }
                    },
                    required: ["label", "value"]
                  }
                },
                iconType: { type: Type.STRING, enum: ['product', 'box', 'delivery', 'discount', 'spec'] },
                imageUrl: { type: Type.STRING },
                isFeatured: { type: Type.BOOLEAN }
              },
              required: ["id", "name", "specs", "iconType"]
            }
          },
          theme: {
            type: Type.OBJECT,
            properties: {
              primaryColor: { type: Type.STRING },
              secondaryColor: { type: Type.STRING },
              accentColor: { type: Type.STRING },
              isDarkTheme: { type: Type.BOOLEAN },
              layoutStyle: { type: Type.STRING, enum: ['slanted', 'minimal', 'grid', 'bold', 'asymmetric'] },
              fontPairing: { type: Type.STRING, enum: ['tech', 'classic', 'brutalist'] }
            },
            required: ["primaryColor", "secondaryColor", "accentColor", "isDarkTheme", "layoutStyle", "fontPairing"]
          },
          logoConfig: {
            type: Type.OBJECT,
            properties: {
              size: { type: Type.STRING, enum: ['sm', 'md', 'lg'] },
              position: { type: Type.STRING, enum: ['top-left', 'top-right', 'centered'] },
              showLogo: { type: Type.BOOLEAN }
            },
            required: ["size", "position", "showLogo"]
          },
          stats: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING }
              },
              required: ["label", "value"]
            }
          }
        },
        required: ["versionName", "title", "subtitle", "accentTitle", "description", "items", "theme", "stats", "productCategory", "logoConfig"]
      }
    }
  },
  required: ["variants"]
};

export async function generateFlyerVariants(prompt: string): Promise<FlyerState[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are a Senior Art Director for "Accion Parts", a premium B2B brand. 
    TASK: Provide 4 flawlessly structured JSON variants for a production Instagram Flyer (4:5).
    
    CRITICAL DESIGN PRINCIPLES:
    1. HIERARCHY: Short titles (max 10 chars per line), short descriptions.
    2. MARKETING IMPACT: Use "marketingBadge" for punchy labels (e.g., "EDICIÓN LIMITADA", "SOLO B2B", "ALTA RESISTENCIA").
    3. BALANCE: 
       - If "heroImageUrl" is present, use only 1 or 2 items.
       - If no hero, use up to 4 items in an organized grid.
    4. BRAND COLORS: Primary should often be #1473f7 (Corporate Blue). Backgrounds often #0a0a0a or #ffffff.
    5. IMAGE SEEDS (High DPI Picsum):
       - Mechanical: https://picsum.photos/seed/acc-mech/800/800
       - Cables/Wire: https://picsum.photos/seed/acc-elec/800/800
       - Warehouse: https://picsum.photos/seed/acc-ware/800/800
       - Tech/Modern: https://picsum.photos/seed/acc-tech/800/800
    
    PROMPT: "${prompt}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: FLYER_SCHEMA,
    },
  });

  const parsed = JSON.parse(response.text);
  return parsed.variants;
}
