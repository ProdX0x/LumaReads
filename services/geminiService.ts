
import { GoogleGenAI, Type } from "@google/genai";
import { Book } from "../types";

// NOTE: In a real app, do not expose API keys on the client side.
// This is for demonstration within the constraints of the environment.
const apiKey = process.env.API_KEY || 'MOCK_KEY_FOR_DEMO'; 

let ai: GoogleGenAI | null = null;

try {
    ai = new GoogleGenAI({ apiKey });
} catch (error) {
    console.warn("Gemini API Key missing or invalid. AI features will be mocked.");
}

export const askAboutBook = async (bookTitle: string, author: string, question: string, lang: 'en' | 'fr' = 'en'): Promise<string> => {
  if (!ai || apiKey === 'MOCK_KEY_FOR_DEMO') {
      return new Promise(resolve => setTimeout(() => resolve(`(Mock AI Response) Here is some insight about ${bookTitle} by ${author}. The book explores themes of resilience and humanity.`), 1500));
  }

  try {
    const model = 'gemini-2.5-flash';
    const langInstruction = lang === 'fr' ? "Answer in French." : "Answer in English.";
    
    const prompt = `You are a helpful literary assistant. 
    The user is asking about the book "${bookTitle}" by "${author}".
    Question: ${question}
    ${langInstruction}
    Keep the answer concise (under 100 words) and engaging.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text || "I couldn't find an answer for that.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return lang === 'fr' 
      ? "Désolé, j'ai du mal à me connecter aux archives littéraires pour le moment." 
      : "Sorry, I'm having trouble connecting to the literary archives right now.";
  }
};

export const identifyBookFromImage = async (base64Image: string, lang: 'en' | 'fr' = 'en'): Promise<Partial<Book> | null> => {
    if (!ai || apiKey === 'MOCK_KEY_FOR_DEMO') {
        // Fallback for demo without key
        return new Promise(resolve => setTimeout(() => resolve({
            id: 'scanned-mock',
            title: 'Mock Detected Book',
            author: 'Unknown Author',
            summary: lang === 'fr' ? 'Ceci est une simulation car aucune clé API n\'a été fournie.' : 'This is a simulated scan result because no API Key was provided.',
            status: 'To Read',
            category: 'Simulation',
            mainIdeas: ['Please add a valid API Key', 'Restart the app', 'Try again'],
            recommendations: [
                { title: 'Similar Mock Book 1', author: 'Author A' },
                { title: 'Similar Mock Book 2', author: 'Author B' }
            ]
        }), 2000));
    }

    try {
        const langInstruction = lang === 'fr' 
            ? "Provide the summary, category, mainIdeas and recommendations IN FRENCH. Keep title and author in original language." 
            : "Provide the summary, category, mainIdeas and recommendations IN ENGLISH.";

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: base64Image
                        }
                    },
                    {
                        text: `Identify the book in this image. Return a JSON object with:
                        - title
                        - author
                        - a brief summary (max 30 words)
                        - a guess at the philosophy or genre (category)
                        - 3 short bullet points of main ideas
                        - 'recommendations': an array of 3 objects {title, author} of books similar to this one.
                        ${langInstruction} 
                        If no book is clearly visible, return null.`
                    }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        author: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        category: { type: Type.STRING },
                        mainIdeas: { 
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        recommendations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    author: { type: Type.STRING }
                                }
                            }
                        }
                    },
                    required: ["title", "author", "summary", "category", "recommendations"]
                }
            }
        });

        if (!response.text) return null;

        const data = JSON.parse(response.text);
        
        return {
            id: `scanned-${Date.now()}`,
            title: data.title,
            author: data.author,
            summary: data.summary,
            category: data.category,
            mainIdeas: data.mainIdeas,
            recommendations: data.recommendations,
            status: 'To Read',
            coverUrl: '' 
        };

    } catch (error) {
        console.error("Error identifying book:", error);
        throw new Error("Failed to identify book.");
    }
};

export const searchBookByQuery = async (query: string, lang: 'en' | 'fr' = 'en'): Promise<Partial<Book> | null> => {
    if (!ai || apiKey === 'MOCK_KEY_FOR_DEMO') {
         return new Promise(resolve => setTimeout(() => resolve({
            id: 'search-mock',
            title: query,
            author: 'Mock Author',
            summary: lang === 'fr' ? 'Résultat de simulation pour recherche textuelle.' : 'Mock result for text search.',
            status: 'To Read',
            category: 'Simulation',
            mainIdeas: ['Mock idea 1', 'Mock idea 2'],
            recommendations: []
        }), 1500));
    }

    try {
        const langInstruction = lang === 'fr' 
            ? "Provide the summary, category, mainIdeas and recommendations IN FRENCH. Keep title and author in original language." 
            : "Provide the summary, category, mainIdeas and recommendations IN ENGLISH.";

        const prompt = `Find the book best matching this query: "${query}".
        Return a JSON object with:
        - title (correct full title)
        - author
        - a brief summary (max 30 words)
        - a guess at the philosophy or genre (category)
        - 3 short bullet points of main ideas
        - 'recommendations': an array of 3 objects {title, author} of books similar to this one.
        ${langInstruction}
        If the query is nonsense, return null.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        author: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        category: { type: Type.STRING },
                        mainIdeas: { 
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        recommendations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    author: { type: Type.STRING }
                                }
                            }
                        }
                    },
                    required: ["title", "author", "summary", "category", "recommendations"]
                }
            }
        });

        if (!response.text) return null;
        const data = JSON.parse(response.text);

        return {
            id: `search-${Date.now()}`,
            title: data.title,
            author: data.author,
            summary: data.summary,
            category: data.category,
            mainIdeas: data.mainIdeas,
            recommendations: data.recommendations,
            status: 'To Read',
            coverUrl: '' // No cover for text search yet
        };

    } catch (error) {
        console.error("Error searching book:", error);
        throw new Error("Failed to search book.");
    }
};

export const generateDetailedBookAnalysis = async (book: Partial<Book>, lang: 'en' | 'fr' = 'en'): Promise<Partial<Book>> => {
    if (!ai || apiKey === 'MOCK_KEY_FOR_DEMO') {
        return new Promise(resolve => setTimeout(() => resolve({
            ...book,
            summary: book.summary || 'Mock summary generated.',
            category: book.category || 'Mock Category',
            mainIdeas: book.mainIdeas || ['Mock Idea 1', 'Mock Idea 2'],
            influences: ['Influence A', 'Influence B'],
            historicalContext: 'Mock historical context.',
            detailedBio: 'Mock detailed bio.'
        }), 2000));
    }

    try {
        const langInstruction = lang === 'fr' ? "Answer IN FRENCH." : "Answer IN ENGLISH.";
        
        // Dynamic prompt based on what's missing
        let tasks = [];
        let schemaProperties: any = {
             influences: { type: Type.ARRAY, items: { type: Type.STRING } },
             historicalContext: { type: Type.STRING },
             detailedBio: { type: Type.STRING }
        };
        let requiredFields = ["influences", "historicalContext", "detailedBio"];

        if (!book.summary) {
            tasks.push("- 'summary': a concise summary (max 50 words).");
            tasks.push("- 'category': genre or philosophy.");
            tasks.push("- 'mainIdeas': 3 bullet points.");
            schemaProperties.summary = { type: Type.STRING };
            schemaProperties.category = { type: Type.STRING };
            schemaProperties.mainIdeas = { type: Type.ARRAY, items: { type: Type.STRING } };
            requiredFields.push("summary", "category", "mainIdeas");
        }

        const prompt = `Perform a deep literary analysis of the book "${book.title}" by "${book.author}".
        Return a JSON object with:
        ${tasks.join('\n')}
        - 'influences': an array of 3-4 specific influences (people, events, or books).
        - 'historicalContext': a paragraph (approx 50 words) describing the era it was written in.
        - 'detailedBio': a short biography of the author (approx 50 words) focusing on their style.
        ${langInstruction}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: schemaProperties,
                    required: requiredFields
                }
            }
        });

        if (!response.text) return book;
        const data = JSON.parse(response.text);

        return {
            ...book,
            ...data
        };

    } catch (error) {
        console.error("Error generating detailed analysis:", error);
        return book;
    }
}
