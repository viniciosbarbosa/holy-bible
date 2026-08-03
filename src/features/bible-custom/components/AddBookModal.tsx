import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useModalStore } from "../../../store/use-modal-store";
import { useCustomCanonStore } from "../../../store/use-custom-canon-store";
import { X, Book as BookIcon, Tags } from "lucide-react";
import { BUILT_IN_TAGS } from "../constants/tags";

export const AddBookModal = () => {
  const { t } = useTranslation();
  const { isAddBookOpen, activePhaseId, closeAllModals } = useModalStore();
  const { addBook, personalPhases, suggestionPhases, activeProfile } = useCustomCanonStore();
  const phases = activeProfile === "suggestion" ? suggestionPhases : personalPhases;
  
  const [name, setName] = useState("");
  const [sub, setSub] = useState("");
  const [page, setPage] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const allExistingTags = useMemo(() => {
    const tagsSet = new Set<string>();
    Object.values(BUILT_IN_TAGS).forEach(t => tagsSet.add(t.lbl));
    phases.forEach(p => p.books.forEach(b => b.tags.forEach(t => tagsSet.add(t))));
    return Array.from(tagsSet).sort();
  }, [phases]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !activePhaseId) return;
    
    addBook(activePhaseId, {
      num: String(Math.floor(Math.random() * 1000)), // Temp ID logic
      name,
      sub,
      tags,
      page: page ? Number(page) : undefined,
    });
    
    reset();
  };

  const reset = () => {
    setName("");
    setSub("");
    setPage("");
    setTags([]);
    closeAllModals();
  };

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };


  return (
    <AnimatePresence>
      {isAddBookOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAllModals}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-bible-card border border-bible-border rounded-[3rem] p-10 shadow-2xl"
          >
            <button
              onClick={closeAllModals}
              className="absolute top-8 right-8 text-bible-muted hover:text-bible-gold transition-colors"
            >
              <X size={24} />
            </button>

            <header className="mb-10">
              <div className="w-14 h-14 bg-bible-gold/10 rounded-[1.25rem] flex items-center justify-center text-bible-gold mb-5 border border-bible-gold/20 shadow-lg shadow-bible-gold/5">
                <BookIcon size={28} />
              </div>
              <h2 className="font-cinzel text-3xl text-bible-gold tracking-[0.2em] uppercase">
                {t("common.add_book")}
              </h2>
              <p className="text-bible-muted font-serif italic text-sm opacity-60">
                {t("modal.add_books")}
              </p>
            </header>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] text-bible-gold uppercase tracking-[0.2em] font-cinzel ml-2">
                      {t("modal.book_name")}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-bible-dark/50 border border-bible-border/30 rounded-2xl px-6 py-4 text-bible-text outline-none focus:border-bible-gold transition-all font-serif"
                      placeholder="Ex: Evangelho de Tomé"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] text-bible-gold uppercase tracking-[0.2em] font-cinzel ml-2">
                      {t("modal.book_sub")} <span className="opacity-40 italic">({t("modal.optional")})</span>
                    </label>
                    <textarea
                      value={sub}
                      onChange={(e) => setSub(e.target.value)}
                      className="w-full bg-bible-dark/50 border border-bible-border/30 rounded-2xl px-6 py-4 text-bible-text outline-none focus:border-bible-gold transition-all font-serif italic resize-none"
                      placeholder="Ex: Ensinamentos secretos..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] text-bible-gold uppercase tracking-[0.2em] font-cinzel ml-2">
                      Página <span className="opacity-40 italic">({t("modal.optional")})</span>
                    </label>
                    <input
                      type="number"
                      value={page}
                      onChange={(e) => setPage(e.target.value)}
                      className="w-full bg-bible-dark/50 border border-bible-border/30 rounded-2xl px-6 py-4 text-bible-text outline-none focus:border-bible-gold transition-all font-serif"
                      placeholder="Ex: 112"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] text-bible-gold uppercase tracking-[0.2em] font-cinzel ml-2 flex items-center gap-2">
                      <Tags size={14} /> {t("common.tags")}
                    </label>
                    <div className="bg-bible-dark/30 rounded-2xl p-6 border border-bible-border/30">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map((t) => (
                          <span key={t} className="flex items-center gap-2 bg-bible-gold/10 text-bible-gold border border-bible-gold/20 px-3 py-1.5 rounded-xl text-[10px] font-cinzel">
                            {t}
                            <button type="button" onClick={() => toggleTag(t)} className="hover:text-red-500 transition-colors">
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                        <input 
                          type="text"
                          placeholder={t("modal.new_tag")}
                          className="bg-transparent border-none outline-none text-[10px] font-cinzel text-bible-text w-24 ml-2"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const val = (e.target as HTMLInputElement).value.trim();
                              if (val) {
                                toggleTag(val);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-[9px] text-bible-muted font-cinzel uppercase tracking-widest opacity-40">
                          {t("modal.suggested_tags")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {allExistingTags.filter(t => !tags.includes(t)).slice(0, 8).map(t => (
                            <button 
                              key={t}
                              type="button"
                              onClick={() => toggleTag(t)}
                              className="bg-white/5 hover:bg-bible-gold/10 text-bible-muted hover:text-bible-gold border border-white/5 hover:border-bible-gold/20 px-2 py-1 rounded-lg text-[9px] font-cinzel transition-all"
                            >
                              + {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col md:flex-row gap-4">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="flex-1 px-8 py-4 rounded-2xl border border-bible-border text-bible-muted font-cinzel text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={!name}
                  className="flex-[2] bg-bible-gold text-white px-8 py-4 rounded-2xl font-cinzel text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-bible-gold/20 disabled:opacity-40"
                >
                  {t("common.add_book")}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
