export type WordItem = {
  word: string;
  meaning: string;
};

export type VocabularySet = {
  id: string;
  name: string;
  description: string;
  words: WordItem[];
};

export const vocabularySets: VocabularySet[] = [
  {
    id: "basic-1",
    name: "小升初弱智單詞",
    description: "9527專用，不會的可以自刎歸天了。",
    words: [
      { word: "again", meaning: "再次" },
      { word: "all", meaning: "全部" },
      { word: "around", meaning: "朝相反方向" },
      { word: "camera", meaning: "相機" },
      { word: "catch", meaning: "抓" },
      { word: "cook", meaning: "烹飪" },
      { word: "factory", meaning: "工廠" },
      { word: "finish", meaning: "完成" },
    ],
  },
  {
    id: "campus",
    name: "托福詞匯",
    description: "高級大學生專用英文詞彙，給我擦皮鞋。",
    words: [
      { word: "lust", meaning: "渴望" },
      { word: "margin", meaning: "邊緣" },
      { word: "mimic", meaning: "仿造物；假的" },
      { word: "monochrome", meaning: "單色的" },
      { word: "myth", meaning: "神話" },
      { word: "nickel", meaning: "鎳" },
      { word: "oblige", meaning: "迫使" },
      { word: "paramount", meaning: "至上的" },
    ],
  },
  {
    id: "travel",
    name: "德意志詞匯",
    description: "高貴的德意志公民專用，低等下人與狗不得入内。",
    words: [
      { word: "die Banane", meaning: "香蕉" },
      { word: "der Brötchen", meaning: "小麵包" },
      { word: "das Getränk", meaning: "飲料" },
      { word: "der Fisch", meaning: "魚" },
      { word: "das Obst", meaning: "水果" },
      { word: "die Sahne", meaning: "奶油" },
      { word: "der Kuchen", meaning: "蛋糕" },
      { word: "die Pommes frites", meaning: "薯條" },
    ],
  },
];