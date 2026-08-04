import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { MainLayout } from "../layout/MainLayout";
import { useCustomCanonStore } from "../store/use-custom-canon-store";
import i18n from "../i18n";

/**
 * Lazy Loading:
 * O navegador só baixará os 255 textos do seu cânone ou o código da API
 * quando o usuário clicar na respectiva aba.
 */
const CustomCanon = lazy(
  () => import("../features/bible-custom/pages/CustomCanon"),
);
const CommonBible = lazy(
  () => import("../features/bible-api/pages/CommonBible"),
);
const BibleReader = lazy(
  () => import("../features/bible-api/pages/BibleReader"),
);
const ChapterSelector = lazy(
  () => import("../features/bible-api/pages/ChapterSelector"),
);

const RootRedirect = () => {
  const activeProfile = useCustomCanonStore((state) => state.activeProfile);
  
  if (!activeProfile) return null;
  
  if (activeProfile === "conventional") {
    return <Navigate to="/default-bible" replace />;
  }
  
  return <Navigate to="/my-personal-bible" replace />;
};

const RouteErrorBoundary = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="p-8 rounded-3xl bg-bible-card border border-bible-border shadow-2xl max-w-md w-full">
        <h2 className="font-cinzel text-xl text-bible-gold mb-3 uppercase tracking-wider">
          Cânone em Atualização
        </h2>
        <p className="text-bible-muted font-serif text-sm mb-6">
          Ocorreu uma inconsistência temporária nos dados salvos. Clique abaixo para recarregar a sessão.
        </p>
        <button
          onClick={() => {
            useCustomCanonStore.getState().clearStore();
            window.location.reload();
          }}
          className="w-full py-3 px-6 rounded-xl bg-bible-gold text-white font-cinzel text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-bible-gold/20"
        >
          Resetar e Recarregar
        </button>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <RootRedirect /> },

      {
        path: "my-personal-bible",
        element: (
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center font-cinzel text-bible-gold animate-pulse">
                Opening Sacred Scrolls...
              </div>
            }
          >
            <CustomCanon />
          </Suspense>
        ),
      },

      {
        path: "default-bible",
        element: (
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center font-cinzel text-bible-gold animate-pulse">
                Connecting to Divine API...
              </div>
            }
          >
            <CommonBible />
          </Suspense>
        ),
      },
      {
        path: "chapters/:bookId",
        element: (
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center font-cinzel text-bible-gold animate-pulse">
                {i18n.t("common.opening_scrolls")}
              </div>
            }
          >
            <ChapterSelector />
          </Suspense>
        ),
      },

      {
        path: "read/:bookId/:chapter",
        element: (
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center font-cinzel text-bible-gold animate-pulse">
                Preparando os Pergaminhos...
              </div>
            }
          >
            <BibleReader />
          </Suspense>
        ),
      },
    ],
  },
], {
  basename: import.meta.env.BASE_URL
});

/**
 * Provider principal que será injetado no seu main.tsx
 */
export const AppRouter = () => <RouterProvider router={router} />;
