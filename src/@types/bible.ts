export interface Tag {
  lbl: string;
  bg: string;
  color: string;
  border: string;
  desc?: string;
}

export interface SavedVerse {
  id: string;
  chapter: string;
  verse: string;
  text: string | any[];
  timestamp: number;
}

export interface Book {
  id: string;
  num: string;
  name: string;
  sub?: string;
  tags: string[];
  isQ?: boolean;
  savedVerses?: SavedVerse[];
}

export const DEFAULT_WALLPAPERS = {
  hermetism_base:
    "https://wayofhermes.com/wp-content/uploads/2022/08/hermes_trimegistus.jpg",
  genesis:
    "https://santhatela.com.br/wp-content/uploads/2017/06/michelangelo-criacao-adao-d.jpg",
  patriarchs:
    "https://www.fulcrum-anglican.org.uk/wp-content/uploads/2013/11/patriarchs.jpg",
  exodus:
    "https://assets-us-01.kc-usercontent.com/c7bb3f89-eb78-007e-971a-d5864cf7a236/4548d78e-7734-464d-8bae-72dfedc6d812/Exodus_thumbnail.jpg",
  conquest_and_judges:
    "https://media.bible.art/7a319da8-b013-4937-aead-c65c6058148c-compressed.jpg",
  kingdom:
    "https://wp.en.aleteia.org/wp-content/uploads/sites/2/2019/08/web3-biblical-war-spoils-moabite-israel-gerbrand-van-den-eeckhout-pd.png",
  exile:
    "https://upload.wikimedia.org/wikipedia/commons/8/8f/Tissot_The_Flight_of_the_Prisoners.jpg",
  wisdom:
    "https://seeinggodinart.wordpress.com/wp-content/uploads/2015/09/jacob_de_wit_-_moses_elects_the_council_of_seventy_elders_-_google_art_project-1.jpg",
  prophets: "https://thumbs.dreamstime.com/b/biblical-prophets-10061822.jpg",
  minor_prophets:
    "https://www.ultimato.com.br/image/atualiza_home/principal/ultimas/opiniao/2021/08_ago/022-jtjm-minor-prophets.jpg",
  intertestamental: "https://cdn.wallpapersafari.com/73/14/4l7NDL.jpg",
  infancy:
    "https://wallpapers.com/images/hd/jesus-loves-children-8hing55wvgzh8ua4.jpg",
  gospels: "https://images8.alphacoders.com/469/thumb-1920-469840.jpg",
  passion:
    "https://miro.medium.com/v2/resize:fit:1400/1*rOVtRzOQOjhiUF5M7lZh2Q.jpeg",
  acts: "https://cdn.magicdecor.in/com/2024/06/11162616/Christian-Mythology-Twelve-Apostles-Painting-Wallpaper-Mural-for-Wall.jpg",
  epistles:
    "https://www.learnreligions.com/thmb/EqM-Ow6ZCM48qqeH1uSu-Tapxm4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Epistles-GettyImages-91725848-583b536e3df78c6f6a10da1f.jpg",
  apocalypse:
    "https://static01.nyt.com/images/2020/03/27/us/00VIRUS-APOCALYPSE-palehorse/00VIRUS-APOCALYPSE-palehorse-videoSixteenByNineJumbo1600.jpg",
  fathers:
    "https://hdwallpaperim.com/wp-content/uploads/2017/08/25/451814-Holy_Trinity-Christianity.jpg",
  gnosis: "https://escolagnostica.org.br/wp-content/uploads/2022/05/Gnose.webp",
  bridge: "https://images.sympla.com.br/5b72f316bb5b2-lg.jpg",
  islam:
    "https://images.squarespace-cdn.com/content/v1/6027387fa69d7d4425a64dbf/11228a3e-d423-4dd1-8ea5-bdf894562de0/Mohammed_kaaba_1315_wide.jpeg",
  koran:
    "https://images.squarespace-cdn.com/content/v1/6027387fa69d7d4425a64dbf/11228a3e-d423-4dd1-8ea5-bdf894562de0/Mohammed_kaaba_1315_wide.jpeg",
  qumran:
    "https://res.cloudinary.com/aenetworks/image/upload/c_fill,ar_2,w_3840,h_1920,g_auto/dpr_auto/f_auto/q_auto:eco/v1/gettyimages-544273540?_a=BAVMn6DY0",
  conspiracy:
    "/wallpapers/conspiracy.png",
} as const;

export type BibleTheme = keyof typeof DEFAULT_WALLPAPERS | string;

export interface Phase {
  id: string;
  num: string;
  title: string;
  theme: BibleTheme;
  div?: string;
  books: Book[];
}

export type ProfileType = "personal" | "suggestion" | "conventional";

export interface ApiBook {
  abbrev: string;
  author: string;
  chapters: number;
  group: string;
  name: string;
  testament: string;
}
