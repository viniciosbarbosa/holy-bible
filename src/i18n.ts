import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      nav: {
        my_bible: "Personal",
        default_bible: "Conventional",
      },
      common: {
        add_phase: "Add Phase",
        add_book: "Add Book",
        edit: "Edit",
        delete: "Delete",
        cancel: "Cancel",
        save: "Save",
        save_verse: "Save Verse",
        search_placeholder: "Search books or phases...",
        none: "Acquired",
        missing: "Missing",
        acquired: "Purchased",
        downloaded: "Got File",
        manuscript: "Manuscript",
        sacred_verses: "Sacred Verses",
        tags: "Tags & Collections",
        no_favorites_yet: "You haven't saved any favorite verses yet.",
        go_to_chapter: "Go to Chapter",
        canon: "Library",
        favorites: "Verses",
        books: "Books",
        old_testament: "Old Testament",
        new_testament: "New Testament",
        chapters: "Chapters",
        read: "Read",
        loading: "Loading Scriptures...",
        error_loading: "Error loading the bible. Please check your connection.",
        back_to_canon: "Return to Canon",
        next: "Next",
        previous: "Previous",
        chapter: "Chapter",
        footer: "In Principio Erat Verbum",
        book_num: "Book {{num}}",
        no_results: "No results found",
        try_other_terms: "Try other sacred terms",
        back: "Back",
        opening_scrolls: "Opening the Scrolls...",
        verse_saved: "Verse Saved!",
        phase_num: "PHASE {{num}}",
        restart_journey: "Restart Journey",
        theme: "Toggle Theme",
        manage_data: "Sacred Data",
        export_backup: "Export Backup",
        export_desc: "Download your entire journey into a JSON file.",
        import_backup: "Restore Backup",
        import_desc: "Upload a previously saved backup file.",
      },
      onboarding: {
        title: "Your Sacred Journey",
        subtitle: "Choose how you want to organize your library",
        personal_title: "My Own Journey",
        personal_desc:
          "Create everything from scratch. Add your own books, phases, and themes.",
        suggestion_title: "Guided Suggestion",
        suggestion_desc:
          "Start with our curated canon of 250+ books across 19 historical phases.",
        conventional_title: "Conventional Canon",
        conventional_desc:
          "Access the traditional Bible with the standard 66 books and study tools.",
        start: "Start Journey",
      },
      modal: {
        add_books: "Add Books",
        book_name: "Book Name",
        book_sub: "Subtitle (Optional)",
        finish: "Finish Phase",
        add_another: "Add Another Book",
        new_manuscript: "New Manuscript",
        step_phase: "Phase Details",
        step_books: "Initial Books",
        phase_title: "Phase Title",
        phase_placeholder: "Enter phase title (e.g., Old Testament)",
        choose_theme: "Choose Visual Theme",
        add: "Add",
        no_books_added: "No books added yet.",
        create_phase: "Create Phase with {{count}} books",
        creating: "Creating...",
        suggested_tags: "Suggested Tags",
        new_tag: "New tag...",
        optional: "Optional",
        new_journey: "New Journey",
        first_record: "The First Record",
        phase_step1_desc:
          "Define the title and visual atmosphere of this new stage.",
        phase_step2_desc: "Add the initial manuscript to start your library.",
        book_placeholder: "Ex: Genesis, Acts...",
        book_sub_placeholder: "The origin of all things...",
        delete_confirm: "Are you sure you want to delete this book?",
        custom_url: "Custom Wallpaper URL",
        delete_warning:
          'This will permanently remove "{{name}}" and all its {{count}} verses.',
        status_acquisition: "Acquisition Status",
        reference: "Reference",
        content: "Content",
        verse_placeholder: "Enter the sacred words...",
      },
      stats: {
        progress: "Sacred Canon",
        completed: "of the journey completed",
        books_count: "{{read}} of {{total}} Books",
        books_in_journey: "{{count}} Books in the Journey",
      },
      empty: {
        journey_not_started: "Your journey hasn't started yet.",
        create_first_phase:
          "Create your first phase and start organizing your library.",
        no_saved_verses: "Your sacred verse collection is empty.",
        add_verses_by_editing: "Add verses by editing your books.",
        phase_empty: "Your library is empty in this phase. Start adding books!",
      },
      confirm: {
        delete_phase: "Delete Phase?",
        delete_phase_warning:
          'This will permanently remove "{{title}}" and all its books.',
        restart_confirm:
          "Are you sure you want to restart your journey? All your personal phases and saved verses will be lost.",
      },
      legend: {
        missing_label: "MISSING",
        click_to_change: "Click to change status",
      },
      tags: {
        b201_desc: "201 Ethiopia Bible",
        v1_desc: "Apocrypha Vol.1",
        v2_desc: "Apocrypha Vol.2",
        v3_desc: "Apocrypha Vol.3",
        cnbb_desc: "CNBB Bible",
        gnose_desc: "Gnostic Text",
        ponte_desc: "Bridge to Islam",
        qumran_desc: "Dead Sea Scrolls",
      },
    },
  },
  pt: {
    translation: {
      nav: {
        my_bible: "Personal",
        default_bible: "Bíblia",
      },
      common: {
        add_phase: "Nova Fase",
        cancel: "Cancelar",
        save: "Salvar",
        delete: "Excluir",
        edit: "Editar",
        search_placeholder: "Pesquisar livros ou fases...",
        none: "Tenho",
        missing: "Faltando",
        acquired: "Comprado",
        downloaded: "Baixado",
        manuscript: "Manuscrito",
        sacred_verses: "Versículos Sagrados",
        tags: "Tags & Coleções",
        no_favorites_yet: "Você ainda não salvou nenhum versículo favorito.",
        go_to_chapter: "Ir para o Capítulo",
        canon: "Biblioteca",
        favorites: "Versículos",
        books: "Livros",
        old_testament: "Antigo Testamento",
        new_testament: "Novo Testamento",
        chapters: "Capítulos",
        read: "Ler",
        loading: "Carregando Escrituras...",
        error_loading: "Erro ao carregar a bíblia. Verifique sua conexão.",
        back_to_canon: "Retornar ao Cânone",
        next: "Próximo",
        previous: "Anterior",
        chapter: "Capítulo",
        footer: "In Principio Erat Verbum",
        book_num: "Livro {{num}}",
        no_results: "Exemplo não encontrado",
        try_other_terms: "Tente outros termos sagrados",
        back: "Voltar",
        opening_scrolls: "Abrindo os Pergaminhos...",
        verse_saved: "Versículo Salvo!",
        phase_num: "FASE {{num}}",
        restart_journey: "Recomeçar Jornada",
        theme: "Alternar Tema",
        manage_data: "Dados Sagrados",
        export_backup: "Exportar Backup",
        export_desc: "Baixe sua jornada completa em um arquivo JSON.",
        import_backup: "Restaurar Backup",
        import_desc: "Suba um arquivo de backup salvo anteriormente.",
      },
      onboarding: {
        title: "Sua Jornada Sagrada",
        subtitle: "Escolha como deseja organizar sua biblioteca",
        personal_title: "Minha Própria Jornada",
        personal_desc:
          "Crie tudo do zero. Adicione seus próprios livros, fases e temas.",
        suggestion_title: "Sugestão Guiada",
        suggestion_desc:
          "Comece com nosso cânone curado de 250+ livros em 19 fases históricas.",
        conventional_title: "Cânone Convencional",
        conventional_desc:
          "Acesse a Bíblia tradicional com os 66 livros padrões e ferramentas de estudo.",
        start: "Iniciar Jornada",
      },
      modal: {
        add_books: "Adicionar Livros",
        book_name: "Nome do Livro",
        book_sub: "Subtítulo (Opcional)",
        finish: "Finalizar Fase",
        add_another: "Adicionar outro livro",
        new_manuscript: "Novo Manuscrito",
        step_phase: "Detalhes da Fase",
        step_books: "Livros Iniciais",
        phase_title: "Título da Fase",
        phase_placeholder: "Ex: Antigo Testamento",
        choose_theme: "Escolha o Tema Visual",
        add: "Adicionar",
        no_books_added: "Nenhum livro adicionado ainda.",
        create_phase: "Criar Fase com {{count}} livros",
        creating: "Criando...",
        suggested_tags: "Tags Sugeridas",
        new_tag: "Nova tag...",
        optional: "Opcional",
        new_journey: "Nova Jornada",
        first_record: "O Primeiro Registro",
        phase_step1_desc:
          "Defina o título e a atmosfera visual desta nova etapa.",
        phase_step2_desc:
          "Adicione o manuscrito inicial para começar sua biblioteca.",
        book_placeholder: "Ex: Gênesis, Atos...",
        book_sub_placeholder: "A origem de todas as coisas...",
        delete_confirm: "Deseja excluir este livro?",
        custom_url: "URL de Papel de Parede Personalizada",
        delete_warning:
          'Isso removerá permanentemente "{{name}}" e todos os seus {{count}} versículos.',
        status_acquisition: "Status de Aquisição",
        reference: "Referência",
        content: "Conteúdo",
        verse_placeholder: "Digite as palavras sagradas...",
      },
      stats: {
        progress: "Cânone Sagrado",
        completed: "da jornada concluída",
        books_count: "{{read}} de {{total}} Livros",
        books_in_journey: "{{count}} Livros na Jornada",
      },
      empty: {
        journey_not_started: "Sua jornada ainda não começou.",
        create_first_phase:
          "Crie sua primeira fase e comece a organizar sua biblioteca.",
        no_saved_verses: "Sua coleção de versículos está vazia.",
        add_verses_by_editing: "Adicione versículos editando seus livros.",
        phase_empty:
          "Sua biblioteca está vazia nesta fase. Comece a adicionar livros!",
      },
      confirm: {
        delete_phase: "Excluir Fase?",
        delete_phase_warning:
          'Isso removerá permanentemente "{{title}}" e todos os seus livros.',
        restart_confirm:
          "Tem certeza que deseja recomeçar sua jornada? Todas as suas fases personalizadas e versículos salvos serão perdidos.",
      },
      legend: {
        missing_label: "FALTANDO",
        click_to_change: "Clique para mudar",
      },
      tags: {
        b201_desc: "Bíblia 201 Etiópia",
        v1_desc: "Apócrifos Vol.1",
        v2_desc: "Apócrifos Vol.2",
        v3_desc: "Apócrifos Vol.3",
        cnbb_desc: "Bíblia CNBB",
        gnose_desc: "Texto Gnóstico",
        ponte_desc: "Ponte para o Islã",
        qumran_desc: "Manuscritos do Mar Morto",
      },
    },
  },
};

// Auto-detect browser language if the user hasn't explicitly set their preferred language yet.
// This corrects situations where the app previously cached an incorrect default.
if (typeof window !== "undefined") {
  const manualSet = localStorage.getItem("i18n_lang_manually_set");
  if (!manualSet) {
    const navLang = window.navigator.language;
    if (navLang.startsWith("pt")) {
      localStorage.setItem("i18nextLng", "pt");
    } else {
      localStorage.setItem("i18nextLng", "en");
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "pt"],
    load: "languageOnly",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"],
    },
  });

export default i18n;
