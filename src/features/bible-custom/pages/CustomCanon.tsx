import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { PlusCircle, Library, Bookmark } from "lucide-react";
import { PhaseSection } from "../components/PhaseSection";
import { StatsHeader } from "../components/StatsHeader";
import { EditBookModal } from "../components/EditBookModal";
import { AddPhaseModal } from "../components/AddPhaseModal";
import { AddBookModal } from "../components/AddBookModal";
import { PersonalFavorites } from "../components/PersonalFavorites";
import { useModalStore } from "../../../store/use-modal-store";
import { useCustomCanonStore } from "../../../store/use-custom-canon-store";
import { useAppStore } from "../../../store/use-app-store";
import { normalizeString } from "../../../lib/utils";

export default function CustomCanon() {
  const { personalPhases, suggestionPhases, activeProfile } =
    useCustomCanonStore();
  const allPhases =
    activeProfile === "suggestion" ? suggestionPhases : personalPhases;

  const setBackgroundFromTheme = useAppStore(
    (state) => state.setBackgroundFromTheme,
  );
  const { openAddPhase } = useModalStore();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<"books" | "favorites">("books");
  const [search, setSearch] = useState("");

  const phasesToExpand = useMemo(() => {
    if (!search) return [];
    const s = normalizeString(search);
    return (allPhases || [])
      .filter((p) =>
        p && Array.isArray(p.books) && p.books.some(
          (b) =>
            b && (
              normalizeString(b?.name).includes(s) ||
              (b?.sub && normalizeString(b?.sub).includes(s))
            ),
        ),
      )
      .map((p) => p.id);
  }, [search, allPhases]);

  const filteredPhases = useMemo(() => {
    const s = normalizeString(search);
    return (allPhases || [])
      .map((p) => {
        if (!p) return null;
        const phaseMatches = p.title ? normalizeString(p.title).includes(s) : false;
        const books = Array.isArray(p.books) ? p.books : [];
        const filteredBooks = books.filter(
          (b) =>
            b && (
              normalizeString(b?.name).includes(s) ||
              (b?.sub && normalizeString(b?.sub).includes(s))
            ),
        );

        if (phaseMatches || filteredBooks.length > 0) {
          return { ...p, books: phaseMatches ? books : filteredBooks };
        }
        return null;
      })
      .filter(Boolean) as any[];
  }, [allPhases, search]);

  // Performance: Load phases in chunks to avoid UI freeze
  const [visibleCount, setVisibleCount] = useState(2);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to allow the layout to settle before rendering more
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (visibleCount < allPhases.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => Math.min(prev + 3, allPhases.length));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, allPhases.length, isReady]);

  const displayedPhases = filteredPhases.slice(0, visibleCount);

  return (
    <div className="relative">
      <StatsHeader />

      <header className="mb-16">
        <div className="mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 px-4">
          {/* Action Tabs */}
          <div className="w-full md:w-auto flex items-center p-1.5 bg-bible-card/60 backdrop-blur-md border border-bible-border/30 rounded-[1.25rem] shadow-xl">
            <button
              onClick={() => setActiveTab("books")}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-cinzel text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${
                activeTab === "books"
                  ? "bg-bible-gold text-white shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
                  : "text-bible-muted hover:text-bible-gold"
              }`}
            >
              <Library size={14} /> {t("common.canon")}
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-cinzel text-[10px] uppercase tracking-[0.2em] transition-all duration-500 ${
                activeTab === "favorites"
                  ? "bg-bible-gold text-white shadow-[0_4_20px_rgba(201,168,76,0.3)]"
                  : "text-bible-muted hover:text-bible-gold"
              }`}
            >
              <Bookmark size={14} /> {t("common.favorites")}
            </button>
          </div>

          {/* Search and Add Action Group */}
          <div className="flex items-center gap-3 w-full md:flex-1 md:max-w-3xl">
            {activeTab === "books" && (
              <div className="flex-1 relative group">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("common.search_placeholder")}
                  className="w-full bg-bible-card/60 backdrop-blur-2xl border border-bible-border/30 rounded-[1.25rem] py-4 px-6 md:px-10 text-bible-text text-sm focus:border-bible-gold/50 outline-none transition-all placeholder:text-bible-muted/40 shadow-2xl"
                />
                <div className="absolute inset-0 rounded-[1.25rem] bg-bible-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            )}

            {activeTab === "books" && (
              <button
                onClick={openAddPhase}
                data-testid="add-phase-btn"
                className="flex items-center justify-center gap-3 bg-bible-gold text-white h-[52px] md:h-auto px-4 md:px-10 py-4 rounded-[1.25rem] transition-all font-cinzel text-[10px] uppercase tracking-[0.3em] shadow-[0_8px_25px_rgba(201,168,76,0.25)] hover:scale-[1.02] active:scale-95 whitespace-nowrap shrink-0"
                title={t("common.add_phase")}
              >
                <PlusCircle size={20} />
                <span className="hidden md:inline">
                  {t("common.add_phase")}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="px-4 space-y-6 pb-1">
        <AnimatePresence mode="wait">
          {activeTab === "favorites" ? (
            <motion.div
              key="favs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PersonalFavorites />
            </motion.div>
          ) : (
            <motion.div key="books" className="space-y-6">
              <AnimatePresence mode="popLayout">
                {search && filteredPhases.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-32 border-2 border-dashed border-bible-border rounded-[3rem] bg-bible-card backdrop-blur-sm px-8"
                  >
                    <Library
                      size={48}
                      className="mx-auto text-bible-gold/20 mb-4"
                    />
                    <h3 className="font-serif text-2xl text-bible-parchment mb-3">
                      {t("common.no_results")}
                    </h3>
                    <p className="text-bible-muted text-xs font-cinzel tracking-[0.2em] uppercase opacity-60">
                      {t("common.try_other_terms")}
                    </p>
                  </motion.div>
                ) : (
                  displayedPhases.map((phase, idx) => (
                    <motion.div
                      key={phase.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <PhaseSection
                        phase={phase}
                        forceOpen={phasesToExpand.includes(phase.id)}
                        searchQuery={search}
                        onOpen={() => setBackgroundFromTheme(phase.theme)}
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>

              {allPhases.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-32 border-2 border-dashed border-bible-border rounded-[3rem] bg-bible-card backdrop-blur-sm px-8"
                >
                  <PlusCircle
                    size={48}
                    className="mx-auto text-bible-gold/30 mb-4"
                  />
                  <p className="text-bible-muted font-serif text-lg leading-relaxed">
                    {t("empty.journey_not_started")} <br />
                    <span className="text-sm opacity-60">
                      {t("empty.create_first_phase")}
                    </span>
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="mt-32 mb-12 text-center text-bible-muted font-cinzel text-[10px] uppercase tracking-[0.5em] opacity-30">
        {t("common.footer")}
      </footer>

      <EditBookModal />
      <AddPhaseModal />
      <AddBookModal />
    </div>
  );
}
