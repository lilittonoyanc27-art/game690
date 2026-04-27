export interface BilliardsQuestion {
  id: string;
  prompt: string;
  choices: string[];
  target: string;
  translation: string;
}

export const BILLIARDS_QUESTIONS: BilliardsQuestion[] = [
  { id: 'bi1', prompt: 'Yo ___ español fluido.', choices: ['hablo', 'digo'], target: 'hablo', translation: 'Ես սահուն իսպաներեն եմ խոսում:' },
  { id: 'bi2', prompt: 'Ella me ___ que vendría.', choices: ['habló', 'dijo'], target: 'dijo', translation: 'Նա ինձ ասաց, որ կգա:' },
  { id: 'bi3', prompt: 'Siempre ___ la verdad.', choices: ['hablo', 'digo'], target: 'digo', translation: 'Ես միշտ ասում եմ ճշմարտությունը:' },
  { id: 'bi4', prompt: '¿Con quién ___?', choices: ['hablas', 'dices'], target: 'hablas', translation: 'Ո՞ւմ հետ ես խոսում:' },
  { id: 'bi5', prompt: 'Él no ___ el secreto.', choices: ['habla', 'dice'], target: 'dice', translation: 'Նա չի ասում գաղտնիքը:' },
  { id: 'bi6', prompt: 'Ellos ___ mucho.', choices: ['hablan', 'dicen'], target: 'hablan', translation: 'Նրանք շատ են խոսում:' },
  { id: 'bi7', prompt: 'No me ___ mentiras.', choices: ['hables', 'digas'], target: 'digas', translation: 'Ինձ սուտ մի՛ ասա:' },
  { id: 'bi8', prompt: 'Mañana ___ con ella.', choices: ['hablaré', 'diré'], target: 'hablaré', translation: 'Վաղը ես կխոսեմ նրա հետ:' },
  { id: 'bi9', prompt: 'Pedro ___ muy rápido.', choices: ['habla', 'dice'], target: 'habla', translation: 'Պեդրոն շատ արագ է խոսում:' },
  { id: 'bi10', prompt: '¿Qué le ___ a tu madre?', choices: ['hablas', 'dices'], target: 'dices', translation: 'Ի՞նչ ես ասում մորդ:' },
  { id: 'bi11', prompt: 'Nosotros ___ de música.', choices: ['hablamos', 'decimos'], target: 'hablamos', translation: 'Մենք խոսում ենք երաժշտության մասին:' },
  { id: 'bi12', prompt: 'Me ___ que no puede ir.', choices: ['habla', 'dice'], target: 'dice', translation: 'Ինձ ասում է, որ չի կարող գնալ:' },
  { id: 'bi13', prompt: 'Ustedes ___ muy bien.', choices: ['hablan', 'dicen'], target: 'hablan', translation: 'Դուք շատ լավ եք խոսում:' },
  { id: 'bi14', prompt: 'No entiendo lo que ___.', choices: ['hablas', 'dices'], target: 'dices', translation: 'Չեմ հասկանում, թե ինչ ես ասում:' },
  { id: 'bi15', prompt: 'Quiero ___ contigo.', choices: ['hablar', 'decir'], target: 'hablar', translation: 'Ուզում եմ խոսել քեզ հետ:' }
];

export const PEDRITO_COLOR = "#fbbf24";
