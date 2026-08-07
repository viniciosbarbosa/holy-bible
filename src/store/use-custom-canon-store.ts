import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Phase, Book, SavedVerse, ProfileType } from "../@types/bible";
import { CANON_DATA, CANON_DATA_ENGLISH } from "../features/bible-custom/constants/canon-data";
import i18n from "../i18n";

interface CustomCanonState {
  activeProfile: ProfileType | null;
  personalPhases: Phase[];
  suggestionPhases: Phase[];
  
  setProfile: (type: ProfileType) => void;
  resetProfile: () => void;

  addPhase: (phase: Omit<Phase, "id" | "books">) => void;
  addPhaseWithBook: (phase: Omit<Phase, "id" | "books">, book: Omit<Book, "id">) => void;
  addPhaseWithBooks: (phase: Omit<Phase, "id" | "books">, books: Omit<Book, "id">[]) => void;
  updatePhase: (id: string, updates: Partial<Phase>) => void;
  deletePhase: (id: string) => void;
  reorderPhases: (newOrder: Phase[]) => void;
  
  addBook: (phaseId: string, book: Omit<Book, "id">) => void;
  updateBook: (phaseId: string, bookId: string, updates: Partial<Book>) => void;
  deleteBook: (phaseId: string, bookId: string) => void;
  reorderBooks: (phaseId: string, newBooks: Book[]) => void;

  getAllSavedVerses: () => (SavedVerse & { bookTitle: string; phaseId: string; bookId: string })[];
  
  addVerse: (phaseId: string, bookId: string, verse: Omit<SavedVerse, "id" | "timestamp">) => void;
  updateVerse: (phaseId: string, bookId: string, verseId: string, updates: Partial<SavedVerse>) => void;
  deleteVerse: (phaseId: string, bookId: string, verseId: string) => void;
  
  syncLanguage: (lang: string) => void;
  clearStore: () => void;
}

// Exported so tests can import the type without circular deps
export type CustomCanonStore = CustomCanonState;

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useCustomCanonStore = create<CustomCanonState>()(
  persist(
    (set, get) => ({
      activeProfile: null,
      personalPhases: [],
      suggestionPhases: (typeof window !== 'undefined' && (window.navigator.language.startsWith('pt') || i18n.language?.startsWith('pt'))) 
        ? CANON_DATA 
        : CANON_DATA_ENGLISH,

      setProfile: (type) => set({ activeProfile: type }),
      resetProfile: () => set({ activeProfile: null }),
      
      addPhase: (phaseData) => set((state) => {
        const key = state.activeProfile === "suggestion" ? "suggestionPhases" : "personalPhases";
        return {
          [key]: [...state[key], { ...phaseData, id: generateId(), books: [] }]
        };
      }),
      
      addPhaseWithBook: (phaseData, bookData) => set((state) => {
        const key = state.activeProfile === "suggestion" ? "suggestionPhases" : "personalPhases";
        return {
          [key]: [...state[key], { 
            ...phaseData, 
            id: generateId(), 
            books: [{ ...bookData, id: generateId() }] 
          }]
        };
      }),

      addPhaseWithBooks: (phaseData, booksData) => set((state) => {
        const key = state.activeProfile === "suggestion" ? "suggestionPhases" : "personalPhases";
        return {
          [key]: [...state[key], { 
            ...phaseData, 
            id: generateId(), 
            books: booksData.map(b => ({ ...b, id: generateId() }))
          }]
        };
      }),
      
      updatePhase: (id, updates) => set((state) => {
        const key = state.activeProfile === "suggestion" ? "suggestionPhases" : "personalPhases";
        return {
          [key]: state[key].map(p => p.id === id ? { ...p, ...updates } : p)
        };
      }),
      
      deletePhase: (id) => set((state) => {
        const key = state.activeProfile === "suggestion" ? "suggestionPhases" : "personalPhases";
        return {
          [key]: state[key].filter(p => p.id !== id)
        };
      }),
      
      reorderPhases: (newOrder) => set((state) => {
        const key = state.activeProfile === "suggestion" ? "suggestionPhases" : "personalPhases";
        return { [key]: newOrder };
      }),
      
      addBook: (phaseId, bookData) => set((state) => {
        const key = state.activeProfile === "suggestion" ? "suggestionPhases" : "personalPhases";
        return {
          [key]: state[key].map(p => {
            if (p.id === phaseId) {
              return {
                ...p,
                books: [...p.books, { ...bookData, id: generateId() }]
              };
            }
            return p;
          })
        };
      }),
      
      updateBook: (phaseId, bookId, updates) => set((state) => {
        const key = state.activeProfile === "suggestion" ? "suggestionPhases" : "personalPhases";
        return {
          [key]: state[key].map(p => {
            if (p.id === phaseId) {
              return {
                ...p,
                books: p.books.map(b => b.id === bookId ? { ...b, ...updates } : b)
              };
            }
            return p;
          })
        };
      }),
      
      deleteBook: (phaseId, bookId) => set((state) => {
        const key = state.activeProfile === "suggestion" ? "suggestionPhases" : "personalPhases";
        return {
          [key]: state[key].map(p => {
            if (p.id === phaseId) {
              return {
                ...p,
                books: p.books.filter(b => b.id !== bookId)
              };
            }
            return p;
          })
        };
      }),
      
      reorderBooks: (phaseId, newBooks) => set((state) => {
        const key = state.activeProfile === "suggestion" ? "suggestionPhases" : "personalPhases";
        return {
          [key]: state[key].map(p => {
            if (p.id === phaseId) {
              return { ...p, books: newBooks };
            }
            return p;
          })
        };
      }),

      getAllSavedVerses: () => {
        const state = get();
        const phases = state.activeProfile === "suggestion" ? state.suggestionPhases : state.personalPhases;
        const all: (SavedVerse & { 
          bookTitle: string; 
          phaseId: string; 
          bookId: string;
          phaseIndex: number;
          bookIndex: number;
        })[] = [];
        
        phases.forEach((p, phaseIdx) => {
          p.books.forEach((b, bookIdx) => {
            if (b.savedVerses) {
              b.savedVerses.forEach(v => {
                all.push({ 
                  ...v, 
                  bookTitle: b.name, 
                  phaseId: p.id, 
                  bookId: b.id,
                  phaseIndex: phaseIdx,
                  bookIndex: bookIdx
                });
              });
            }
          });
        });
        
        return all.sort((a, b) => {
          // 1. Sort by Phase Order (Canonical)
          if (a.phaseIndex !== b.phaseIndex) return a.phaseIndex - b.phaseIndex;

          // 2. Sort by Book Order within Phase (Canonical)
          if (a.bookIndex !== b.bookIndex) return a.bookIndex - b.bookIndex;

          // 3. Then by chapter (numeric sort)
          const chapterCompare = a.chapter.localeCompare(b.chapter, undefined, { numeric: true });
          if (chapterCompare !== 0) return chapterCompare;

          // 4. Then by verse (numeric sort)
          return a.verse.localeCompare(b.verse, undefined, { numeric: true });
        });
      },
      
      addVerse: (phaseId, bookId, verseData) => set((state) => {
        const key = state.activeProfile === "suggestion" ? "suggestionPhases" : "personalPhases";
        return {
          [key]: state[key].map(p => {
            if (p.id === phaseId) {
              return {
                ...p,
                books: p.books.map(b => {
                  if (b.id === bookId) {
                    const savedVerses = b.savedVerses || [];
                    const newVerse: SavedVerse = {
                      ...verseData,
                      id: generateId(),
                      timestamp: Date.now(),
                    };
                    return {
                      ...b,
                      savedVerses: [...savedVerses, newVerse]
                    };
                  }
                  return b;
                })
              };
            }
            return p;
          })
        };
      }),

      updateVerse: (phaseId, bookId, verseId, updates) => set((state) => {
        const key = state.activeProfile === "suggestion" ? "suggestionPhases" : "personalPhases";
        return {
          [key]: state[key].map(p => {
            if (p.id === phaseId) {
              return {
                ...p,
                books: p.books.map(b => {
                  if (b.id === bookId) {
                    return {
                      ...b,
                      savedVerses: b.savedVerses?.map(v => v.id === verseId ? { ...v, ...updates } : v)
                    };
                  }
                  return b;
                })
              };
            }
            return p;
          })
        };
      }),

      deleteVerse: (phaseId, bookId, verseId) => set((state) => {
        const key = state.activeProfile === "suggestion" ? "suggestionPhases" : "personalPhases";
        return {
          [key]: state[key].map(p => {
            if (p.id === phaseId) {
              return {
                ...p,
                books: p.books.map(b => {
                  if (b.id === bookId) {
                    return {
                      ...b,
                      savedVerses: b.savedVerses?.filter(v => v.id !== verseId)
                    };
                  }
                  return b;
                })
              };
            }
            return p;
          })
        };
      }),

      syncLanguage: (lang) => set((state) => {
        let suggestionPhases = state.suggestionPhases || [];

        // Auto-fix if state was persisted as a 2D array [[...]] or empty
        if (Array.isArray(suggestionPhases[0])) {
          suggestionPhases = (suggestionPhases[0] as unknown as Phase[]) || [];
        }

        if (!Array.isArray(suggestionPhases) || suggestionPhases.length === 0) {
          const newCanon = lang.startsWith('pt') ? CANON_DATA : CANON_DATA_ENGLISH;
          return { suggestionPhases: newCanon };
        }

        const hasLegacyPage = suggestionPhases.some(p => p?.books?.some(b => 'page' in (b as any)));

        // Migration/Fix for Minor Prophets theme for existing users
        const updatedSuggestion = suggestionPhases.map(p => {
          if (p?.title && (p.title.includes("PROFETAS MENORES") || p.title.includes("MINOR PROPHETS")) && p.theme === "prophets") {
            return { ...p, theme: "minor_prophets" };
          }
          return p;
        });

        const suggestionChanged = JSON.stringify(updatedSuggestion) !== JSON.stringify(suggestionPhases);

        // Only auto-sync if the user hasn't made any edits to the suggestion phases
        // To keep it simple and performant, we check if it's identical to one of the defaults
        const isDefaultPT = JSON.stringify(suggestionPhases) === JSON.stringify(CANON_DATA);
        const isDefaultEN = JSON.stringify(suggestionPhases) === JSON.stringify(CANON_DATA_ENGLISH);
        
        if (isDefaultPT || isDefaultEN || suggestionChanged || hasLegacyPage) {
          const newCanon = lang.startsWith('pt') ? CANON_DATA : CANON_DATA_ENGLISH;
          
          // If we had a theme fix, we should apply it even if it's not a full language sync
          if (suggestionChanged && !(isDefaultPT || isDefaultEN || hasLegacyPage)) {
            return { suggestionPhases: updatedSuggestion };
          }

          // Only update if it's actually different from current
          if (hasLegacyPage || JSON.stringify(suggestionPhases) !== JSON.stringify(newCanon)) {
            return { suggestionPhases: newCanon };
          }
        }

        if (suggestionPhases !== state.suggestionPhases) {
          return { suggestionPhases };
        }

        return state;
      }),

      clearStore: () => set({
        activeProfile: null,
        personalPhases: [],
        suggestionPhases: (typeof window !== 'undefined' && (window.navigator.language.startsWith('pt') || i18n.language?.startsWith('pt'))) 
          ? CANON_DATA 
          : CANON_DATA_ENGLISH,
      }),
    }),
    {
      name: "holy-bible-custom-canon-v2",
    }
  )
);
