import { useMemo } from "react";
import { motion } from "framer-motion";
import { useBibleStore } from "../../../store/use-bible-store";
import { useCustomCanonStore } from "../../../store/use-custom-canon-store";
import { useTranslation } from "react-i18next";

export const StatsHeader = () => {
  const { readStatus } = useBibleStore();
  const { activeProfile, personalPhases, suggestionPhases } =
    useCustomCanonStore();
  const phases =
    activeProfile === "suggestion" ? suggestionPhases : personalPhases;
  const { t } = useTranslation();

  const stats = useMemo(() => {
    // Usar os livros reais das fases do Zustand de forma segura
    const safePhases = Array.isArray(phases) ? phases : [];
    const allBooks = safePhases.flatMap((phase) =>
      phase && Array.isArray(phase.books) ? phase.books : [],
    );
    const total = allBooks.length;

    // Contar lidos que pertencem aos IDs dos livros atuais
    const bookIds = new Set(
      allBooks.filter((b) => b && b.id).map((b) => b.id),
    );
    const readCount = Object.entries(readStatus || {}).filter(
      ([id, isRead]) => isRead && bookIds.has(id),
    ).length;

    const percentage = total > 0 ? Math.round((readCount / total) * 100) : 0;

    return { total, readCount, percentage };
  }, [readStatus, phases]);

  return (
    <div className="mx-auto px-4 py-4 md:py-8">
      <div className="relative group p-6 md:p-8 rounded-[2rem] bg-bible-card/40 backdrop-blur-md border border-bible-border shadow-2xl overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-bible-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="font-cinzel text-bible-gold text-[10px] md:text-xs tracking-[0.4em] uppercase opacity-70">
              {t("stats.progress")}
            </h2>
            <div className="flex flex-col md:flex-row items-center md:items-baseline gap-1 md:gap-3">
              <span className="font-cinzel text-4xl md:text-5xl text-bible-text leading-none">
                {stats.percentage}%
              </span>
              <span className="font-serif text-bible-muted italic text-xs md:text-sm">
                {t("stats.completed")}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="font-cinzel text-[11px] md:text-sm text-bible-gold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-bible-gold animate-pulse" />
              <span>
                {t("stats.books_count", {
                  read: stats.readCount,
                  total: stats.total,
                })}
              </span>
            </div>

            {/* Minimalist Progress Bar */}
            <div className="h-1 w-full md:w-64 bg-bible-border/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentage}%` }}
                transition={{ duration: 1.2, ease: "circOut" }}
                className="h-full bg-bible-gold shadow-[0_0_15px_rgba(201,168,76,0.5)]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
