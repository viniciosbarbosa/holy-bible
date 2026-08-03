import { useModalStore } from "../../../store/use-modal-store";
import { useBibleStore } from "../../../store/use-bible-store";
import {
  CheckCircle2,
  Bookmark,
  Download,
  AlertCircle,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { Book } from "../../../@types/bible";
import { normalizeString } from "../../../lib/utils";

export const BookItem = ({
  book,
  phaseId,
  searchQuery,
}: {
  book: Book;
  phaseId: string;
  searchQuery?: string;
}) => {
  const { readStatus, acquisitionStatus, toggleRead } = useBibleStore();
  const { openEditBook } = useModalStore();
  const { t } = useTranslation();

  const isHighlighted =
    searchQuery &&
    (normalizeString(book.name).includes(normalizeString(searchQuery)) ||
      (book.sub &&
        normalizeString(book.sub).includes(normalizeString(searchQuery))));

  const isRead = readStatus[book.id];
  const currentStatus = acquisitionStatus[book.id] || "none";

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditBook(book.id, phaseId);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`group relative flex flex-col justify-between rounded-3xl border p-7 transition-all duration-500 overflow-hidden cursor-pointer
        ${isHighlighted ? "border-bible-gold shadow-[0_0_15px_rgba(201,168,76,0.2)] bg-bible-gold/[0.03]" : "border-bible-border/50"}
        ${isRead ? "opacity-60" : "hover:border-bible-gold shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)]"}
        ${isRead && !isHighlighted ? "bg-bible-card" : "bg-bible-card"}
      `}
      onClick={() => toggleRead(book.id)}
    >
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-bible-gold/0 via-bible-gold/0 to-bible-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {!isRead && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-bible-gold/5 rounded-full blur-3xl group-hover:bg-bible-gold/10 transition-all duration-700 pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <span className="font-cinzel text-[9px] bg-bible-gold/10 px-2 py-0.5 rounded-md text-bible-gold uppercase tracking-widest border border-bible-gold/20">
          {t("common.book_num", { num: String(book.num).padStart(3, '0') })}
          {book.page !== undefined && ` • p. ${book.page}`}
        </span>

        <div className="flex gap-1.5">
          {currentStatus === "missing" && (
            <AlertCircle size={14} className="text-red-500/80" />
          )}
          {currentStatus === "acquired" && (
            <Bookmark size={14} className="text-green-500/80" />
          )}
          {currentStatus === "downloaded" && (
            <Download size={14} className="text-blue-500/80" />
          )}
          {isRead && (
            <CheckCircle2
              size={16}
              className="text-bible-gold drop-shadow-[0_0_8px_rgba(201,168,76,0.4)]"
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 mb-6 flex-1">
        <h4
          className={`font-serif text-lg font-bold mb-1 transition-colors duration-300 ${isRead ? "line-through text-bible-muted" : "text-bible-text group-hover:text-bible-gold"}`}
        >
          {book.name}
        </h4>
        <p className="text-[11px] text-bible-muted italic line-clamp-2 leading-relaxed font-serif">
          {book.sub}
        </p>

        {book.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-3">
            {book.tags.map((tag, idx) => (
              <span
                key={idx}
                className={`text-[8px] px-1.5 py-0.5 rounded-md uppercase tracking-tighter border 
                  ${
                    idx % 2 === 0
                      ? "bg-bible-gold/5 text-bible-gold border-bible-gold/20"
                      : "bg-bible-text/5 text-bible-muted border-bible-border"
                  }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Settings Button */}
      <div className="relative z-10 mt-auto pt-4 border-t border-bible-border/30 flex justify-center md:justify-end">
        <button
          onClick={handleEditClick}
          className="w-full md:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-bible-gold/5 hover:bg-bible-gold/10 text-bible-muted hover:text-bible-gold transition-all duration-300 text-[9px] font-cinzel uppercase tracking-widest border border-bible-gold/10 hover:border-bible-gold/30"
        >
          <Settings size={12} /> {t("common.edit")}
        </button>
      </div>
    </motion.div>
  );
};
