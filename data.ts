export interface WordPair {
  id: number;
  spanish: string;
  armenian: string;
}

export const VOCABULARY_WORDS: WordPair[] = [
  { id: 1, spanish: "Hola", armenian: "Ողջույն" },
  { id: 2, spanish: "Adiós", armenian: "Ցտեսություն" },
  { id: 3, spanish: "Gracias", armenian: "Շնորհակալություն" },
  { id: 4, spanish: "Por favor", armenian: "Խնդրում եմ" },
  { id: 5, spanish: "Perdón", armenian: "Ներողություն" },
  { id: 6, spanish: "Sí", armenian: "Այո" },
  { id: 7, spanish: "No", armenian: "Ոչ" },
  { id: 8, spanish: "Hombre", armenian: "Տղամարդ" },
  { id: 9, spanish: "Mujer", armenian: "Կին" },
  { id: 10, spanish: "Niño", armenian: "Տղա" },
  { id: 11, spanish: "Niña", armenian: "Աղջիկ" },
  { id: 12, spanish: "Agua", armenian: "Ջուր" },
  { id: 13, spanish: "Pan", armenian: "Հաց" },
  { id: 14, spanish: "Leche", armenian: "Կաթ" },
  { id: 15, spanish: "Manzana", armenian: "Խնձոր" },
  { id: 16, spanish: "Casa", armenian: "Տուն" },
  { id: 17, spanish: "Libro", armenian: "Գիրք" },
  { id: 18, spanish: "Escuela", armenian: "Դպրոց" },
  { id: 19, spanish: "Amigo", armenian: "Ընկեր" },
  { id: 20, spanish: "Familia", armenian: "Ընտանիք" }
];

export interface GrammarRule {
  title: string;
  description: string;
  examples: { original: string; translation: string; pronunciation: string }[];
}

export const SPANISH_PRONUNCIATION_RULES: GrammarRule[] = [
  {
    title: "Արտասանության հիմունքներ (Basics)",
    description: "Իսպաներենի արտասանությունը հայախոսների համար բավականին հեշտ է, քանի որ շատ հնչյուններ նման են:",
    examples: [
      { original: "Hola", translation: "Ողջույն", pronunciation: "Օլա (H-ն չի արտասանվում)" },
      { original: "Jamón", translation: "Խոզապուխտ", pronunciation: "Խամոն (J-ն արտասանվում է որպես Խ)" },
      { original: "Llama", translation: "Լամա", pronunciation: "Յամա (LL-ն արտասանվում է որպես Յ)" },
      { original: "Niño", pronunciation: "Նինյո (Ñ-ն արտասանվում է որպես ՆՅ)", translation: "Տղա" }
    ]
  },
  {
    title: "Շեշտադրություն (Stress/Accents)",
    description: "Իսպաներենում շեշտը կարևոր է։ Հայերենում շեշտը սովորաբար վերջին վանկի վրա է, բայց իսպաներենում կան կանոններ.",
    examples: [
      { original: "Casa", translation: "Տուն", pronunciation: "ԿԱ-սա (Վերջանում է ձայնավորով -> նախավերջին վանկ)" },
      { original: "Hablamos", translation: "Խոսում ենք", pronunciation: "ա-ԲԼԱ-մոս (Վերջանում է 's'-ով -> նախավերջին վանկ)" },
      { original: "Hablar", translation: "Խոսել", pronunciation: "ա-ԲԼԱՐ (Վերջանում է այլ բաղաձայնով -> վերջին վանկ)" },
      { original: "Café", translation: "Սուրճ", pronunciation: "կա-ՖԵ (Շեշտը գրված է -> բացառություն)" }
    ]
  }
];
