import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModalStore } from "../../../store/use-modal-store";
import { useBibleStore } from "../../../store/use-bible-store";
import { useCustomCanonStore } from "../../../store/use-custom-canon-store";
import {
  X,
  Bookmark,
  Download,
  AlertCircle,
  Trash2,
  Quote,
  Edit2,
  Check,
  Hash,
  Tags,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Book, Phase, SavedVerse } from "../../../@types/bible";
import { BUILT_IN_TAGS } from "../constants/tags";

export const EditBookModal = () => {
  const { isEditBookOpen, activeBookId, activePhaseId, closeAllModals } =
    useModalStore();
  const { setAcquisition, acquisitionStatus } = useBibleStore();
  const {
    activeProfile,
    personalPhases,
    suggestionPhases,
    deleteBook,
    updateBook,
    addVerse,
    updateVerse,
    deleteVerse,
  } = useCustomCanonStore();
  const phases =
    activeProfile === "suggestion" ? suggestionPhases : personalPhases;

  const { t } = useTranslation();

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [newVerseText, setNewVerseText] = useState("");
  const [newVerseRef, setNewVerseRef] = useState("");
  const [editingVerseId, setEditingVerseId] = useState<string | null>(null);
  const [editVerseText, setEditVerseText] = useState("");
  const [editVerseRef, setEditVerseRef] = useState("");

  // Select the actual book from the store to ensure reactivity
  const activeBook = useMemo(() => {
    if (!activeBookId || !activePhaseId || !Array.isArray(phases)) return null;
    const phase = phases.find((p: Phase) => p && p.id === activePhaseId);
    return phase && Array.isArray(phase.books)
      ? phase.books.find((b: Book) => b && b.id === activeBookId)
      : null;
  }, [activeBookId, activePhaseId, phases]);

  // Extract all unique tags from all books to provide as suggestions
  const allExistingTags = useMemo(() => {
    const tagsSet = new Set<string>();
    // Add built-in tags labels
    Object.values(BUILT_IN_TAGS).forEach((t) => t?.lbl && tagsSet.add(t.lbl));
    // Add tags from all phases
    if (Array.isArray(phases)) {
      phases.forEach((p) => {
        if (p && Array.isArray(p.books)) {
          p.books.forEach((b) => {
            if (b && Array.isArray(b.tags)) {
              b.tags.forEach((t) => t && tagsSet.add(t));
            }
          });
        }
      });
    }
    return Array.from(tagsSet).sort();
  }, [phases]);

  if (!activeBook || !activePhaseId) return null;

  const currentStatus = acquisitionStatus[activeBook.id] || "none";

  const handleAddVerse = () => {
    if (!newVerseText || !newVerseRef) return;
    const parts = newVerseRef.trim().split(/[:\s]+/);
    const chapter = parts[0] || "1";
    const verse = parts.slice(1).join(":") || "1";

    addVerse(activePhaseId, activeBook.id, {
      chapter: chapter,
      verse: verse,
      text: newVerseText,
    });
    setNewVerseText("");
    setNewVerseRef("");
  };

  const handleStartEditVerse = (v: SavedVerse) => {
    setEditingVerseId(v.id);
    setEditVerseText(Array.isArray(v.text) ? v.text.join(" ") : v.text);
    setEditVerseRef(`${v.chapter}:${v.verse}`);
  };

  const handleSaveEditVerse = (verseId: string) => {
    const parts = editVerseRef.trim().split(/[:\s]+/);
    const chapter = parts[0] || "1";
    const verse = parts.slice(1).join(":") || "1";

    updateVerse(activePhaseId, activeBook.id, verseId, {
      text: editVerseText,
      chapter: chapter,
      verse: verse,
    });
    setEditingVerseId(null);
  };

  const toggleTag = (tag: string) => {
    const currentTags = activeBook.tags || [];
    if (currentTags.includes(tag)) {
      updateBook(activePhaseId, activeBook.id, {
        tags: currentTags.filter((t) => t !== tag),
      });
    } else {
      updateBook(activePhaseId, activeBook.id, { tags: [...currentTags, tag] });
    }
  };

  const statusOptions = [
    {
      id: "none",
      label: "Tenho",
      icon: Check,
      color: "text-[#c9a84c]",
      bg: "bg-[#c9a84c]/10",
      border: "border-[#c9a84c]/20",
    },
    {
      id: "missing",
      label: "Faltando",
      icon: AlertCircle,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/20",
    },
    {
      id: "acquired",
      label: "Comprado",
      icon: Bookmark,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
    },
    {
      id: "downloaded",
      label: "Baixado",
      icon: Download,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
      border: "border-sky-400/20",
    },
  ] as const;

  const confirmDelete = () => {
    deleteBook(activePhaseId, activeBook.id);
    setShowConfirmDelete(false);
    closeAllModals();
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isEditBookOpen && !showConfirmDelete && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAllModals}
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-bible-card border border-bible-border rounded-[2rem] md:rounded-[3rem] p-5 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={closeAllModals}
                className="absolute top-6 right-6 text-bible-muted hover:text-bible-gold transition-colors z-30"
              >
                <X size={24} />
              </button>

              <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12">
                {/* Column 1: Config & Status */}
                <div className="space-y-8">
                  <header className="relative">
                    <span className="text-bible-gold font-cinzel text-[10px] uppercase tracking-[0.3em] opacity-60 flex items-center gap-2">
                      <Hash size={10} /> {t("common.manuscript")} ID:{" "}
                      {activeBook.num}
                    </span>
                    <input
                      type="text"
                      value={activeBook.name}
                      onChange={(e) =>
                        updateBook(activePhaseId, activeBook.id, {
                          name: e.target.value,
                        })
                      }
                      className="w-full bg-transparent text-4xl text-bible-text font-serif mt-2 border-b border-bible-border/30 focus:border-bible-gold outline-none pb-2 transition-all"
                      placeholder={t("modal.book_name")}
                    />
                    <textarea
                      value={activeBook.sub || ""}
                      onChange={(e) =>
                        updateBook(activePhaseId, activeBook.id, {
                          sub: e.target.value,
                        })
                      }
                      className="w-full bg-transparent text-sm font-serif italic text-bible-muted mt-4 outline-none resize-none border-l-2 border-bible-gold/20 pl-4 py-1"
                      placeholder={t("modal.book_sub")}
                      rows={2}
                    />

                    {activeBook.tags && activeBook.tags.length > 0 ? (
                      <div className="mt-4 space-y-2 border-l-2 border-bible-gold/20 pl-4 py-1">
                        <label className="text-[10px] text-bible-gold uppercase tracking-[0.2em] font-cinzel ml-2">
                          Páginas por Tag:
                        </label>
                        <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2">
                          {activeBook.tags.map((t) => {
                            const lbl = BUILT_IN_TAGS[t]?.lbl || t.toUpperCase();
                            return (
                              <div key={t} className="flex items-center gap-2">
                                <span className="text-[10px] font-cinzel text-bible-muted w-16 truncate">{lbl}:</span>
                                <input
                                  type="number"
                                  value={activeBook.pages?.[t] !== undefined ? activeBook.pages[t] : ""}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const currentPages = activeBook.pages || {};
                                    const newPages = { ...currentPages };
                                    if (val) {
                                      newPages[t] = Number(val);
                                    } else {
                                      delete newPages[t];
                                    }
                                    updateBook(activePhaseId, activeBook.id, {
                                      pages: Object.keys(newPages).length > 0 ? newPages : undefined,
                                    });
                                  }}
                                  className="bg-transparent text-sm font-serif text-bible-text border-b border-bible-border/30 focus:border-bible-gold outline-none pb-1 transition-all w-24"
                                  placeholder="Nenhuma"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 flex gap-4 items-center">
                        <label className="text-[10px] text-bible-gold uppercase tracking-[0.2em] font-cinzel ml-2">
                          Página:
                        </label>
                        <input
                          type="number"
                          value={activeBook.page !== undefined ? activeBook.page : ""}
                          onChange={(e) =>
                            updateBook(activePhaseId, activeBook.id, {
                              page: e.target.value ? Number(e.target.value) : undefined,
                            })
                          }
                          className="bg-transparent text-sm font-serif text-bible-text border-b border-bible-border/30 focus:border-bible-gold outline-none pb-1 transition-all w-24"
                          placeholder="Nenhuma"
                        />
                      </div>
                    )}
                  </header>

                  <div className="space-y-4">
                    <h3 className="text-[10px] text-bible-gold uppercase tracking-[0.2em] font-cinzel ml-2">
                      {t("modal.status_acquisition")}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {statusOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() =>
                            setAcquisition(activeBook.id, opt.id as any)
                          }
                          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all group
                            ${
                              currentStatus === opt.id
                                ? `${opt.border} ${opt.bg} ${opt.color} shadow-lg shadow-black/20`
                                : "border-bible-border bg-bible-dark/30 text-bible-muted hover:border-bible-gold/30 hover:bg-bible-dark/50"
                            }`}
                        >
                          <div
                            className={`p-2 rounded-lg transition-colors ${currentStatus === opt.id ? opt.bg : "bg-white/5 group-hover:bg-white/10"}`}
                          >
                            <opt.icon size={18} />
                          </div>
                          <span className="text-[11px] font-cinzel uppercase tracking-widest">
                            {t(`common.${opt.id}`)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] text-bible-gold uppercase tracking-[0.2em] font-cinzel ml-2 flex items-center gap-2">
                      <Tags size={12} /> {t("common.tags")}
                    </h3>
                    <div className="bg-bible-dark/30 rounded-2xl p-4 border border-bible-border/30">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {activeBook.tags.map((t) => (
                          <span
                            key={t}
                            className="flex items-center gap-1.5 bg-bible-gold/10 text-bible-gold border border-bible-gold/20 px-2 py-1 rounded-lg text-[9px] font-cinzel"
                          >
                            {t}
                            <button
                              onClick={() => toggleTag(t)}
                              className="hover:text-red-500 transition-colors"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {allExistingTags
                          .filter((t) => !activeBook.tags.includes(t))
                          .slice(0, 5)
                          .map((t) => (
                            <button
                              key={t}
                              onClick={() => toggleTag(t)}
                              className="bg-white/5 hover:bg-bible-gold/10 text-bible-muted hover:text-bible-gold border border-white/5 hover:border-bible-gold/20 px-2 py-1 rounded-lg text-[9px] font-cinzel transition-all"
                            >
                              + {t}
                            </button>
                          ))}
                        <input
                          type="text"
                          placeholder={t("modal.new_tag")}
                          className="bg-transparent border-none outline-none text-[9px] font-cinzel text-bible-text w-20 ml-2"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              const val = (
                                e.target as HTMLInputElement
                              ).value.trim();
                              if (val) {
                                toggleTag(val);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowConfirmDelete(true)}
                    className="w-full flex items-center justify-center gap-2 p-4 text-red-500/40 font-cinzel text-[10px] hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all uppercase tracking-widest border border-transparent hover:border-red-500/30"
                  >
                    <Trash2 size={12} /> {t("common.delete")}{" "}
                    {t("common.books")}
                  </button>
                </div>

                {/* Column 2: Verses Management */}
                <div className="bg-bible-dark/50 rounded-[2.5rem] p-6 md:p-8 border border-bible-border flex flex-col h-full shadow-inner">
                  <h3 className="text-[10px] text-bible-gold uppercase tracking-widest font-cinzel mb-8 flex items-center gap-2">
                    <Quote size={14} /> {t("common.sacred_verses")}
                  </h3>

                  <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-8 max-h-[350px] md:max-h-[450px] scrollbar-thin scrollbar-thumb-bible-gold/20">
                    {activeBook.savedVerses
                      ?.slice()
                      .sort((a, b) => {
                        const chapterCompare = a.chapter.localeCompare(
                          b.chapter,
                          undefined,
                          { numeric: true },
                        );
                        if (chapterCompare !== 0) return chapterCompare;
                        return a.verse.localeCompare(b.verse, undefined, {
                          numeric: true,
                        });
                      })
                      .map((v: SavedVerse) => (
                        <motion.div
                          layout
                          key={v.id}
                          className="group relative bg-bible-card border border-bible-border/50 p-5 rounded-2xl hover:border-bible-gold/40 transition-all shadow-sm"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] text-bible-gold font-cinzel uppercase tracking-widest bg-bible-gold/5 px-2 py-0.5 rounded-md">
                              {activeBook.name} {v.chapter}:{v.verse}
                            </span>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleStartEditVerse(v)}
                                className="p-1.5 text-bible-muted hover:text-bible-gold transition-colors"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                onClick={() =>
                                  deleteVerse(
                                    activePhaseId,
                                    activeBook.id,
                                    v.id,
                                  )
                                }
                                className="p-1.5 text-bible-muted hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>

                          {editingVerseId === v.id ? (
                            <div className="space-y-3">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={editVerseRef}
                                  onChange={(e) =>
                                    setEditVerseRef(
                                      e.target.value.replace(/[^0-9:.-]/g, ""),
                                    )
                                  }
                                  className="w-1/3 bg-bible-dark/50 border border-bible-gold/30 rounded-xl p-2 text-[10px] font-cinzel text-bible-gold focus:border-bible-gold outline-none"
                                  placeholder="1:5"
                                />
                              </div>
                              <textarea
                                value={editVerseText}
                                onChange={(e) =>
                                  setEditVerseText(e.target.value)
                                }
                                className="w-full bg-bible-dark/50 border border-bible-gold/30 rounded-xl p-3 text-sm font-serif text-bible-text focus:border-bible-gold outline-none resize-none"
                                rows={3}
                                autoFocus
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => setEditingVerseId(null)}
                                  className="text-[10px] font-cinzel text-bible-muted uppercase px-3 py-1 hover:text-white"
                                >
                                  {t("common.cancel")}
                                </button>
                                <button
                                  onClick={() => handleSaveEditVerse(v.id)}
                                  className="text-[10px] font-cinzel text-bible-gold uppercase bg-bible-gold/10 px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-bible-gold hover:text-white transition-all"
                                >
                                  <Check size={10} /> {t("common.save")}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm font-serif text-bible-text/90 leading-relaxed italic italic-font italic-style">
                              "{v.text}"
                            </p>
                          )}
                        </motion.div>
                      ))}
                    {(!activeBook.savedVerses ||
                      activeBook.savedVerses.length === 0) && (
                      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <Quote size={32} className="text-bible-muted/20" />
                        <p className="text-bible-muted/40 font-serif italic text-sm">
                          {t("empty.no_saved_verses")}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-bible-border/30">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-1/3">
                        <label className="text-[9px] font-cinzel text-bible-gold uppercase mb-1.5 block ml-1">
                          {t("modal.reference")}
                        </label>
                        <input
                          type="text"
                          placeholder="1.5"
                          value={newVerseRef}
                          onChange={(e) =>
                            setNewVerseRef(
                              e.target.value.replace(/[^0-9:.-]/g, ""),
                            )
                          }
                          className="w-full bg-bible-dark/50 border border-bible-border rounded-xl px-4 py-3 text-xs font-cinzel outline-none focus:border-bible-gold transition-all"
                        />
                      </div>
                      <div className="w-full md:w-2/3">
                        <label className="text-[9px] font-cinzel text-bible-gold uppercase mb-1.5 block ml-1">
                          {t("modal.content")}
                        </label>
                        <textarea
                          placeholder={t("modal.verse_placeholder")}
                          value={newVerseText}
                          onChange={(e) => setNewVerseText(e.target.value)}
                          className="w-full bg-bible-dark/50 border border-bible-border rounded-xl px-4 py-3 text-sm font-serif outline-none focus:border-bible-gold h-12 md:h-12 resize-none transition-all scrollbar-none"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleAddVerse}
                      disabled={!newVerseText || !newVerseRef}
                      className="w-full bg-bible-gold text-white py-4 rounded-2xl font-cinzel text-[11px] tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-bible-gold/20 disabled:opacity-40"
                    >
                      {t("common.save_verse")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmDelete(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-bible-card border border-red-500/20 rounded-[2.5rem] p-10 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h3 className="font-cinzel text-2xl text-bible-text mb-2 tracking-wide">
                {t("common.delete")} {t("common.manuscript")}?
              </h3>
              <p className="text-bible-muted mb-10 font-serif italic text-sm">
                {t("modal.delete_warning", {
                  name: activeBook.name,
                  count: activeBook.savedVerses?.length || 0,
                })}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="py-4 px-4 rounded-2xl border border-bible-border hover:bg-white/5 text-bible-muted font-cinzel text-[10px] uppercase tracking-widest transition-all"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={confirmDelete}
                  className="py-4 px-4 rounded-2xl bg-red-500 text-white font-cinzel text-[10px] uppercase tracking-widest shadow-xl shadow-red-500/30 hover:bg-red-600 transition-all"
                >
                  {t("common.delete")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
