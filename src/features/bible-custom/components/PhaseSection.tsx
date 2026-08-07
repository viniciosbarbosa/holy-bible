import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PlusCircle, Trash2 } from "lucide-react";
import type { Phase } from "../../../@types/bible";
import { BookItem } from "./BookItem";
import { useCustomCanonStore } from "../../../store/use-custom-canon-store";
import { useModalStore } from "../../../store/use-modal-store";
import { normalizeString } from "../../../lib/utils";

interface Props {
  phase: Phase;
  onOpen?: () => void;
  forceOpen?: boolean;
  searchQuery?: string;
}

export const PhaseSection = ({ phase, onOpen, forceOpen, searchQuery }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const { t } = useTranslation();
  const deletePhase = useCustomCanonStore((state) => state.deletePhase);
  const { openAddBook } = useModalStore();

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    } else if (!searchQuery) {
      setIsOpen(false);
    }
  }, [forceOpen, searchQuery]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState && onOpen) {
      onOpen();
    }
  };

  const handleAddBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    openAddBook(phase.id);
  };

  const handleDeletePhase = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmDelete(true);
  };

  const confirmDelete = () => {
    deletePhase(phase.id);
  };

  return (
    <>
      <motion.section
        layout
        className={`relative mb-6 overflow-hidden rounded-3xl border bg-bible-card shadow-xl transition-all duration-500 ${
          searchQuery && normalizeString(phase.title).includes(normalizeString(searchQuery))
            ? "border-bible-gold shadow-[0_0_15px_rgba(201,168,76,0.2)]"
            : "border-bible-border"
        }`}
      >
        {/* Header */}
        <motion.header
          layout="position"
          onClick={handleToggle}
          className="relative z-20 p-4 md:p-6 cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            <div className="shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-bible-gold text-white font-cinzel text-[10px] md:text-xs font-bold rounded-full shadow-lg shadow-bible-gold/10 border border-bible-gold/20">
              {(phase?.num || '').replace('Fase ', '').padStart(2, '0')}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <h2 className="font-cinzel text-[13px] md:text-lg tracking-[0.05em] md:tracking-[0.1em] text-bible-gold group-hover:text-bible-gold-light transition-colors leading-tight mb-0.5 truncate">
                {phase?.title || ''}
              </h2>
              <p className="text-[8px] md:text-[9px] text-bible-muted font-cinzel uppercase tracking-[0.1em] md:tracking-[0.15em] opacity-60">
                {t("stats.books_in_journey", { count: (phase?.books || []).length })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 md:gap-2 mr-1"
                >
                  <button
                    onClick={handleAddBook}
                    className="p-1.5 md:p-2 text-bible-gold hover:bg-bible-gold/10 rounded-xl transition-all border border-bible-gold/20"
                    title={t("common.add_book")}
                  >
                    <PlusCircle size={14} md:size={16} />
                  </button>
                  <button
                    onClick={handleDeletePhase}
                    className="p-1.5 md:p-2 text-red-500/70 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/20"
                    title={t("common.delete")}
                  >
                    <Trash2 size={14} md:size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-bible-gold/5 flex items-center justify-center border border-bible-gold/10 group-hover:bg-bible-gold/20 transition-all"
            >
              <ChevronDown className="text-bible-gold" size={14} md:size={16} />
            </motion.div>
          </div>
        </motion.header>

        {/* Content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-5 md:px-6 pb-6 overflow-hidden"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4 border-t border-bible-border">
                {(phase?.books || []).map((book) => (
                  <BookItem
                    key={book.id}
                    book={book}
                    phaseId={phase.id}
                    searchQuery={searchQuery}
                  />
                ))}
                {(!phase?.books || phase.books.length === 0) && (
                  <div className="col-span-full py-12 text-center text-bible-muted font-serif italic border border-dashed border-bible-border rounded-2xl">
                    {t("empty.phase_empty")}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {showConfirmDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmDelete(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm bg-bible-card border border-bible-border rounded-3xl p-8 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="font-cinzel text-lg text-bible-text mb-2">{t("confirm.delete_phase")}</h3>
              <p className="text-bible-muted text-sm mb-8 font-serif">
                {t("confirm.delete_phase_warning", { title: phase.title })}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-bible-border hover:bg-bible-gold/5 text-bible-muted transition-colors text-sm font-cinzel uppercase"
                >
                  {t("common.cancel")}
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all text-sm font-cinzel uppercase shadow-lg shadow-red-500/20"
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
