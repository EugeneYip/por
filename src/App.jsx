import React, { useMemo, useState, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   ICON PATH DICTIONARY — pure SVG, zero dependencies
   ═══════════════════════════════════════════════════════════════ */
const ICON_PATHS = {
  book: ["M4 5.5h5a3 3 0 0 1 3 3V20a2.5 2.5 0 0 0-2.5-2.5H4z","M20 5.5h-5a3 3 0 0 0-3 3V20a2.5 2.5 0 0 1 2.5-2.5H20z"],
  sound: ["M5 14h3l4 4V6L8 10H5z","M16 9a4 4 0 0 1 0 6","M18.5 6.5a7.5 7.5 0 0 1 0 11"],
  chat: ["M4 5.5h16v10H8l-4 4v-14Z","M8 10h8","M8 13h5"],
  globe: ["M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20Z","M2 12h20","M12 2c2.8 2.7 4.4 6.2 4.4 10S14.8 19.3 12 22","M12 2c-2.8 2.7-4.4 6.2-4.4 10S9.2 19.3 12 22"],
  layers: ["m12 3 9 4.5-9 4.5-9-4.5L12 3Z","m3 12 9 4.5 9-4.5","m3 16.5 9 4.5 9-4.5"],
  arrow: ["M5 12h14","m13 6 6 6-6 6"],
  check: ["M20 6 9 17l-5-5"],
  spark: ["M12 3 13.6 8.4 19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z","M19 3v3","M20.5 4.5h-3","M4 17v4","M6 19H2"],
  map: ["M3.5 6.5 8.5 4l7 2 5-2.5v14L15.5 20l-7-2-5 2.5z","M8.5 4v14","M15.5 6v14"],
  clock: ["M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20Z","M12 6v6l4 2"],
  compass: ["M12 2a10 10 0 1 0 0 20a10 10 0 1 0 0-20Z","m16.2 7.8-2.6 6.6-6.6 2.6 2.6-6.6z"],
  hash: ["M4 9h16","M4 15h16","M10 3v18","M14 3v18"],
  calendar: ["M4 6h16v14H4z","M16 2v4","M8 2v4","M4 10h16"],
  palette: ["M12 2a10 10 0 0 0 0 20c1.1 0 2-.4 2.7-1.1.7-.7 1.1-1.6 1.1-2.7 0-.6-.2-1.1-.5-1.4-.3-.3-.4-.7-.4-1.1 0-1.1.9-2 2-2h2.3c2.8 0 5-2.2 5-5A10 10 0 0 0 12 2z","M8.5 11.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0","M10 7.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0","M14 7.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0","M16.5 11.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0"],
  zap: ["M13 2 3 14h9l-1 8 10-12h-9l1-8z"],
  mic: ["M12 1a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z","M19 10v1a7 7 0 0 1-14 0v-1","M12 18v4","M8 22h8"],
  chevDown: ["m6 9 6 6 6-6"],
  flag: ["M4 15s1-1 4-1 5 2 8 2 4 0 4-1V3s-1 1-4 1-5-2-8-2-4 0-4 1z","M4 22v-7"],
  user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2","M12 3a4 4 0 1 0 0 8 4 4 0 1 0 0-8z"],
  heart: ["M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"],
};

function Icon({ name, className = "h-5 w-5" }) {
  const paths = ICON_PATHS[name] || [];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEVEL COLOR SYSTEM (removed unused b1)
   ═══════════════════════════════════════════════════════════════ */
const LEVELS = {
  a0: { label: "A0", name: "First Contact", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800", accent: "#059669" },
  a1: { label: "A1", name: "Survival", bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-700", badge: "bg-sky-100 text-sky-800", accent: "#0284c7" },
  a2: { label: "A2", name: "Foundation", bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", badge: "bg-violet-100 text-violet-800", accent: "#7c3aed" },
  ref: { label: "REF", name: "Reference", bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-600", badge: "bg-slate-100 text-slate-700", accent: "#475569" },
};

const SECTIONS = [
  { id: "alphabet", level: "a0", icon: "book", title: "The Alphabet" },
  { id: "pronunciation", level: "a0", icon: "sound", title: "Pronunciation" },
  { id: "first-phrases", level: "a0", icon: "chat", title: "First Phrases" },
  { id: "numbers", level: "a0", icon: "hash", title: "Numbers" },
  { id: "pronouns-articles", level: "a1", icon: "user", title: "Pronouns & Articles" },
  { id: "essential-verbs", level: "a1", icon: "zap", title: "Essential Verbs" },
  { id: "ser-estar", level: "a1", icon: "layers", title: "Ser vs. Estar" },
  { id: "questions", level: "a1", icon: "compass", title: "Question Words" },
  { id: "time-calendar", level: "a1", icon: "calendar", title: "Days, Months & Time" },
  { id: "dialogues", level: "a1", icon: "chat", title: "Dialogues" },
  { id: "conjugation", level: "a2", icon: "layers", title: "Regular Conjugation" },
  { id: "past-tense", level: "a2", icon: "clock", title: "Past Tense" },
  { id: "prepositions", level: "a2", icon: "map", title: "Prepositions" },
  { id: "vocabulary", level: "a2", icon: "palette", title: "Vocabulary Themes" },
  { id: "pt-br-pt", level: "ref", icon: "globe", title: "PT-BR vs. PT-PT" },
  { id: "cultural", level: "ref", icon: "heart", title: "Cultural Notes" },
  { id: "practice", level: "ref", icon: "spark", title: "Practice" },
];

const TRACKS = {
  br: { label: "Brazilian Portuguese", short: "PT-BR", greeting: "Oi, tudo bem?", train: "trem", bus: "ônibus", phone: "celular" },
  pt: { label: "European Portuguese", short: "PT-PT", greeting: "Olá, tudo bem?", train: "comboio", bus: "autocarro", phone: "telemóvel" },
};

/* ═══════════════════════════════════════════════════════════════
   CONTENT DATA — A0
   ═══════════════════════════════════════════════════════════════ */
const ALPHABET_ROWS = [
  ["A a","ah","casa","house"],["B b","beh","bom","good"],["C c","seh","café","coffee"],
  ["D d","deh","dia","day"],["E e","eh","ele","he"],["F f","effi","fala","speak"],
  ["G g","zheh / geh","gato","cat"],["H h","agá (silent)","hotel","hotel"],
  ["I i","ee","ilha","island"],["J j","jota","janela","window"],
  ["K k","cá","kit","kit ¹"],["L l","eli","livro","book"],
  ["M m","emi","mãe","mother"],["N n","eni","noite","night"],
  ["O o","oh","olá","hello"],["P p","peh","por favor","please"],
  ["Q q","keh","que","what / that"],["R r","erre","rua","street"],
  ["S s","essi","sim","yes"],["T t","teh","tudo","everything"],
  ["U u","oo","um","a / one"],["V v","veh","você","you"],
  ["W w","dáblio","web","web ¹"],["X x","xis","xícara","cup"],
  ["Y y","ípsilon","yoga","yoga ¹"],["Z z","zeh","zero","zero"],
];

const SOUND_ROWS = [
  ["a","casa","ah","Open, stable vowel."],
  ["e","mesa / pé","ay / eh","Closed or open depending on word."],
  ["o","ovo / avó","oh / aw","Two distinct sounds; do not flatten."],
  ["ão","pão, não","ow̃ (nasal)","Nasal diphthong. No hard 'n' at end."],
  ["ãe","mãe","ãy (nasal)","Nasal diphthong. Lips spread."],
  ["õe","põe","oy̰ (nasal)","Nasal diphthong."],
  ["nh","vinho","ny","Like English 'canyon', shorter."],
  ["lh","filho","ly / lli","Soft palatal l."],
  ["ch","chave","sh","Like English 'ship'."],
  ["ç","coração","s","Always an 's' sound."],
  ["j","janela","zh","Like 's' in English 'measure'."],
  ["r (single)","caro","tap","Tongue tap, like Spanish single r."],
  ["rr / initial r","carro, rua","h / guttural","Varies by region; often guttural."],
  ["s (between vowels)","casa","z","Voiced, like English 'z'."],
  ["s (start / consonant)","sim, pensar","s","Voiceless, like English 's'."],
  ["x","xícara / exame","sh / z / ks","Varies by word; must be memorized."],
];

const STRESS_ROWS = [
  ["casa","CA-sa","Most common: stress on second-to-last syllable."],
  ["café","ca-FÉ","Accent mark always shows where stress falls."],
  ["médico","MÉ-di-co","Third-to-last syllable (proparoxytone)."],
  ["português","por-tu-GUÊS","Final syllable stress is also common."],
  ["ação","a-ÇÃO","Nasal ending naturally takes the stress."],
];

const FIRST_PHRASES = [
  ["Olá / Oi","Hello / Hi"],["Bom dia","Good morning"],
  ["Boa tarde","Good afternoon"],["Boa noite","Good evening / night"],
  ["Tudo bem?","How are you? / All good?"],["Tudo bem.","All good. (reply)"],
  ["Sim","Yes"],["Não","No"],
  ["Por favor","Please"],["Obrigado (♂) / Obrigada (♀)","Thank you"],
  ["De nada","You're welcome"],["Desculpe","Sorry / Excuse me"],
  ["Com licença","Excuse me (passing by)"],["Eu não entendo","I don't understand"],
  ["Fala inglês?","Do you speak English?"],["Pode repetir?","Can you repeat?"],
  ["Quanto custa?","How much is it?"],["Onde fica o banheiro?","Where is the bathroom?"],
  ["Quero um café","I want a coffee"],["A conta, por favor","The check, please"],
];

const NUMBER_ROWS_FULL = [
  ["0","zero"],["1","um / uma"],["2","dois / duas"],["3","três"],["4","quatro"],
  ["5","cinco"],["6","seis"],["7","sete"],["8","oito"],["9","nove"],["10","dez"],
  ["11","onze"],["12","doze"],["13","treze"],["14","catorze"],["15","quinze"],
  ["16","dezesseis"],["17","dezessete"],["18","dezoito"],["19","dezenove"],["20","vinte"],
  ["30","trinta"],["40","quarenta"],["50","cinquenta"],["60","sessenta"],
  ["70","setenta"],["80","oitenta"],["90","noventa"],["100","cem / cento"],
  ["1.000","mil"],["1.000.000","milhão"],
];

/* ═══════════════════════════════════════════════════════════════
   CONTENT DATA — A1
   ═══════════════════════════════════════════════════════════════ */
const PRONOUN_ROWS = [
  ["eu","I","Both BR and PT."],["você","you (informal)","Standard in Brazil; also used in PT."],
  ["tu","you (informal)","Common in PT-PT and some BR regions."],["ele / ela","he / she","Same in both variants."],
  ["nós","we","Formal. 'A gente' is common informally."],["a gente","we (informal)","Very common in spoken BR."],
  ["vocês","you all","Standard in Brazil."],["eles / elas","they (m / f)","Gender must match the group."],
];

const ARTICLE_ROWS = [
  ["o","the","masc. sing.","o livro"],["a","the","fem. sing.","a casa"],
  ["os","the","masc. pl.","os livros"],["as","the","fem. pl.","as casas"],
  ["um","a / one","masc. sing.","um carro"],["uma","a / one","fem. sing.","uma mesa"],
  ["uns","some","masc. pl.","uns amigos"],["umas","some","fem. pl.","umas amigas"],
];

const CONTRACTION_ROWS = [
  ["de + o = do","of the (m)","do Brasil"],["de + a = da","of the (f)","da escola"],
  ["em + o = no","in the (m)","no centro"],["em + a = na","in the (f)","na rua"],
  ["a + o = ao","to the (m)","ao mercado"],["a + a = à","to the (f)","à noite"],
  ["por + o = pelo","through the (m)","pelo parque"],["por + a = pela","through the (f)","pela cidade"],
];

const BASIC_VERBS = [
  ["ser","sou / é / somos / são","to be (identity)","Eu sou estudante."],
  ["estar","estou / está / estamos / estão","to be (state)","Estou em Boston."],
  ["ter","tenho / tem / temos / têm","to have","Tenho uma pergunta."],
  ["ir","vou / vai / vamos / vão","to go","Vou ao centro."],
  ["fazer","faço / faz / fazemos / fazem","to do / make","Faço exercício."],
  ["falar","falo / fala / falamos / falam","to speak","Falo um pouco."],
  ["querer","quero / quer / queremos / querem","to want","Quero água."],
  ["poder","posso / pode / podemos / podem","can / to be able","Posso entrar?"],
  ["saber","sei / sabe / sabemos / sabem","to know (fact)","Sei o caminho."],
  ["gostar de","gosto / gosta / gostamos / gostam","to like","Gosto de café."],
  ["precisar de","preciso / precisa / precisamos","to need","Preciso de ajuda."],
  ["morar em","moro / mora / moramos / moram","to live (in)","Moro em Boston."],
];

const SER_ESTAR_DATA = [
  { verb: "ser", items: [
    { emoji: "🪪", label: "Identity", ex: "Eu sou professor." },
    { emoji: "🌍", label: "Origin", ex: "Ela é do Brasil." },
    { emoji: "📏", label: "Trait", ex: "Ele é alto." },
    { emoji: "🕐", label: "Time", ex: "São 3 horas." },
  ]},
  { verb: "estar", items: [
    { emoji: "😴", label: "Mood", ex: "Estou cansado." },
    { emoji: "📍", label: "Location", ex: "Estamos em casa." },
    { emoji: "🤒", label: "Health", ex: "Ela está doente." },
    { emoji: "📖", label: "Action (-ando)", ex: "Estou estudando." },
  ]},
];

const SER_ESTAR_TABLE = [
  ["Identity / profession","Ela é médica.","She is a doctor.","ser"],
  ["Origin / nationality","Eu sou do Brasil.","I am from Brazil.","ser"],
  ["Physical trait (permanent)","Ele é alto.","He is tall.","ser"],
  ["Time / date","São três horas.","It is three o'clock.","ser"],
  ["Temporary state / mood","Estou cansado.","I am tired.","estar"],
  ["Location (people/things)","Estamos em casa.","We are at home.","estar"],
  ["Health condition","Ela está doente.","She is sick.","estar"],
  ["Progressive (-ando/-endo)","Estou estudando.","I am studying.","estar"],
];

const QUESTION_ROWS = [
  ["O que / O quê?","What?","O que você quer?"],["Quem?","Who?","Quem é ela?"],
  ["Onde?","Where?","Onde fica o hotel?"],["Quando?","When?","Quando começa?"],
  ["Como?","How?","Como se diz?"],["Por que / Por quê?","Why?","Por que não?"],
  ["Quanto/a?","How much?","Quanto custa?"],["Quantos/as?","How many?","Quantos anos você tem?"],
  ["Qual / Quais?","Which?","Qual é o seu nome?"],
];

const DAYS = [["segunda-feira","Monday"],["terça-feira","Tuesday"],["quarta-feira","Wednesday"],["quinta-feira","Thursday"],["sexta-feira","Friday"],["sábado","Saturday"],["domingo","Sunday"]];
const MONTHS = [["janeiro","January"],["fevereiro","February"],["março","March"],["abril","April"],["maio","May"],["junho","June"],["julho","July"],["agosto","August"],["setembro","September"],["outubro","October"],["novembro","November"],["dezembro","December"]];
const TIME_EXPRESSIONS = [["agora","now"],["hoje","today"],["amanhã","tomorrow"],["ontem","yesterday"],["sempre","always"],["nunca","never"],["às vezes","sometimes"],["cedo","early"],["tarde","late"],["de manhã","in the morning"],["à tarde","in the afternoon"],["à noite","at night"]];

const DIALOGUES = [
  { key:"greeting",title:"Self-introduction",level:"beginner",lines:[["A","Oi. Eu sou Daniel."],["B","Prazer. Eu sou Anna."],["A","Você é do Brasil?"],["B","Não. Eu sou de Portugal."],["A","Ah, entendi. E você fala inglês?"],["B","Falo um pouco. E você fala português?"],["A","Estou aprendendo."]]},
  { key:"coffee",title:"Ordering coffee",level:"beginner",lines:[["A","Bom dia. Um café, por favor."],["B","Com leite ou sem leite?"],["A","Com leite, sem açúcar."],["B","Mais alguma coisa?"],["A","Não, só isso. Quanto custa?"],["B","Três e cinquenta."],["A","Aqui está. Obrigado."]]},
  { key:"restaurant",title:"At a restaurant",level:"beginner",lines:[["A","Boa noite. Tem mesa para dois?"],["B","Tem sim. Pode sentar ali."],["A","O menu, por favor."],["B","Claro. Aqui está."],["A","Quero este prato e uma água."],["B","Mais alguma coisa?"],["A","Só isso. Obrigado."]]},
  { key:"directions",title:"Asking for directions",level:"beginner",lines:[["A","Com licença. Onde fica a estação?"],["B","Fica ali, à direita."],["A","É longe?"],["B","Não, fica a cinco minutos a pé."],["A","Muito obrigado."],["B","De nada."]]},
  { key:"shopping",title:"Shopping",level:"intermediate",lines:[["A","Boa tarde. Posso ajudar?"],["B","Estou procurando uma camiseta."],["A","Que tamanho?"],["B","Médio. Tem na cor azul?"],["A","Temos. Quer experimentar?"],["B","Sim, por favor. Onde fica o provador?"],["A","Ali à esquerda."]]},
  { key:"phone",title:"Phone call",level:"intermediate",lines:[["A","Alô?"],["B","Oi, posso falar com o Pedro?"],["A","Ele não está. Quer deixar recado?"],["B","Pode dizer que a Maria ligou?"],["A","Claro. Mais alguma coisa?"],["B","Só isso. Obrigada."]]},
  { key:"doctor",title:"At the doctor",level:"intermediate",lines:[["A","O que está sentindo?"],["B","Estou com dor de cabeça e febre."],["A","Desde quando?"],["B","Desde ontem à noite."],["A","Vou receitar um remédio. Descanse bastante."],["B","Obrigado, doutor."]]},
  { key:"meeting",title:"Work meeting",level:"advanced",lines:[["A","Desculpe o atraso."],["B","Sem problema. Vamos começar."],["A","Pode repetir o ponto principal?"],["B","Precisamos fechar o cronograma esta semana."],["A","Entendi. Posso enviar a proposta amanhã."],["B","Perfeito. Combinado."]]},
];

/* ═══════════════════════════════════════════════════════════════
   CONTENT DATA — A2
   ═══════════════════════════════════════════════════════════════ */
const CONJUGATION_GROUPS = [
  { ending:"ar", verb:"falar", meaning:"to speak", badge:"bg-emerald-100 text-emerald-800",
    present:[["eu","falo"],["você / ele / ela","fala"],["nós","falamos"],["vocês / eles","falam"]],
    past:[["eu","falei"],["você / ele / ela","falou"],["nós","falamos"],["vocês / eles","falaram"]]},
  { ending:"er", verb:"comer", meaning:"to eat", badge:"bg-sky-100 text-sky-800",
    present:[["eu","como"],["você / ele / ela","come"],["nós","comemos"],["vocês / eles","comem"]],
    past:[["eu","comi"],["você / ele / ela","comeu"],["nós","comemos"],["vocês / eles","comeram"]]},
  { ending:"ir", verb:"partir", meaning:"to leave", badge:"bg-violet-100 text-violet-800",
    present:[["eu","parto"],["você / ele / ela","parte"],["nós","partimos"],["vocês / eles","partem"]],
    past:[["eu","parti"],["você / ele / ela","partiu"],["nós","partimos"],["vocês / eles","partiram"]]},
];

const PREPOSITION_ROWS = [
  ["de","of / from","Sou de Boston."],["em","in / on / at","Moro em Boston."],
  ["a","to / at","Vou ao cinema."],["para","to / for","Isto é para você."],
  ["com","with","Café com leite."],["sem","without","Sem açúcar."],
  ["por","by / through","Passo por aqui."],["entre","between","Entre a escola e o parque."],
  ["sobre","on / about","Sobre a mesa."],["até","until / up to","Até amanhã."],
];

const VOCAB_FOOD = [["água","water"],["café","coffee"],["chá","tea"],["leite","milk"],["suco / sumo","juice"],["cerveja","beer"],["vinho","wine"],["pão","bread"],["arroz","rice"],["feijão","beans"],["carne","meat"],["frango","chicken"],["peixe","fish"],["ovo","egg"],["queijo","cheese"],["fruta","fruit"],["salada","salad"],["sobremesa","dessert"],["açúcar","sugar"],["sal","salt"]];
const VOCAB_TRAVEL = [["aeroporto","airport"],["hotel","hotel"],["estação","station"],["rua","street"],["passagem","ticket"],["mala","suitcase"],["passaporte","passport"],["mapa","map"],["praia","beach"],["museu","museum"],["banco","bank"],["farmácia","pharmacy"],["hospital","hospital"],["supermercado","supermarket"],["restaurante","restaurant"],["táxi","taxi"],["metrô / metro","subway"],["entrada","entrance"],["saída","exit"],["banheiro","bathroom"]];
const VOCAB_DIRECTIONS = [["esquerda","left"],["direita","right"],["em frente","straight ahead"],["atrás","behind"],["perto","near"],["longe","far"],["aqui","here"],["ali / lá","there"],["norte","north"],["sul","south"],["leste","east"],["oeste","west"]];
const VOCAB_COLORS = [["vermelho/a","red"],["azul","blue"],["verde","green"],["amarelo/a","yellow"],["preto/a","black"],["branco/a","white"],["cinza","gray"],["marrom / castanho","brown"],["roxo/a","purple"],["rosa","pink"],["laranja","orange"],["dourado/a","gold"]];
const VOCAB_EMERGENCY = [["Ajuda!","Help!"],["Chame a polícia!","Call the police!"],["Chame uma ambulância!","Call an ambulance!"],["Preciso de um médico.","I need a doctor."],["É uma emergência.","It's an emergency."],["Fogo!","Fire!"],["Estou perdido/a.","I'm lost."],["Roubaram minha carteira.","My wallet was stolen."]];

const PT_DIFF_ROWS = [["Hello","Oi / Olá","Olá"],["You (informal)","você","tu (mostly)"],["Train","trem","comboio"],["Bus","ônibus","autocarro"],["Cell phone","celular","telemóvel"],["Bathroom","banheiro","casa de banho"],["Breakfast","café da manhã","pequeno-almoço"],["Ice cream","sorvete","gelado"],["Pedestrian","pedestre","peão"],["Juice","suco","sumo"],["Past tense (we)","falamos","falámos"],["Gerund / Infinitive","estou falando","estou a falar"]];

const CULTURAL_NOTES = [
  { title:"Obrigado vs. Obrigada", text:"Males say 'obrigado,' females say 'obrigada.' This matches the speaker's gender, not the listener's." },
  { title:"Greetings include physical contact", text:"In Brazil, a kiss on each cheek (or one) is common when meeting someone. In Portugal, two kisses are standard. Handshakes for formal settings." },
  { title:"Meals are social events", text:"Lunch (almoço) is the largest meal in both countries. Dinner (jantar) in Portugal often starts after 8 PM; in Brazil, around 7 PM." },
  { title:"6th most spoken language", text:"Over 260 million speakers worldwide across Brazil, Portugal, Angola, Mozambique, Cape Verde, Guinea-Bissau, São Tomé and Príncipe, and East Timor." },
  { title:"Diminutives express affection", text:"Adding -inho/-inha softens a word. 'Cafezinho' is a small coffee (and a social ritual in Brazil). 'Obrigadinho' adds warmth." },
  { title:"Formality levels matter", text:"In Portugal, 'tu' is for close friends; 'você' is semi-formal. In Brazil, 'você' is the everyday default. In both, 'o senhor / a senhora' is formal." },
];

const PRACTICE_BLOCKS = [
  { title:"Fill the gap", icon:"book", items:["Eu ___ estudante. (sou / estou)","Nós ___ em casa. (somos / estamos)","Ela ___ uma irmã. (é / tem)","Eu ___ café. (quero / queiro)","Ele ___ ao mercado. (vai / vou)","Eles ___ português. (falam / fala)"]},
  { title:"Translate into Portuguese", icon:"chat", items:["I am from Boston.","I want water, please.","Do you speak English?","Where is the station?","How much does this cost?","I don't understand."]},
  { title:"Read aloud", icon:"mic", items:["pão, mão, não, estação, coração","filho, vinho, janela, chave, rua","Bom dia. Tudo bem? Tudo bem.","Quero um café com leite, por favor.","Onde fica o banheiro? À direita.","Quanto custa? Dez reais."]},
];

/* ═══════════════════════════════════════════════════════════════
   FONT CONSTANTS — single source, no leakage
   ═══════════════════════════════════════════════════════════════ */
const FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif";
const FONT_DISPLAY = "Georgia, 'Times New Roman', serif";

/* ═══════════════════════════════════════════════════════════════
   UI COMPONENTS
   ═══════════════════════════════════════════════════════════════ */
function Card({ children, className = "" }) {
  return <div className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

function LevelBadge({ level }) {
  const l = LEVELS[level];
  if (!l) return null;
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-widest ${l.badge}`}>{l.label}</span>;
}

/* FIX #5: SectionHeader badge says "Lesson", not duplicated title */
function SectionHeader({ id, level, icon, title, description }) {
  const l = LEVELS[level];
  return (
    <div id={id} className="scroll-mt-20 mb-6 pt-10">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <LevelBadge level={level} />
        <div className={`inline-flex items-center gap-1.5 rounded-full ${l.bg} ${l.border} border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${l.text}`}>
          <Icon name={icon} className="h-3.5 w-3.5" />
          <span>Lesson</span>
        </div>
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-3xl text-sm leading-7 text-stone-500 sm:text-base">{description}</p>}
    </div>
  );
}

function Table({ headers, rows, highlight, small = false }) {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-white text-left">
          <thead className="bg-stone-50">
            <tr>{headers.map((h) => (
              <th key={h} className={`border-b border-stone-200 px-4 py-2.5 font-semibold text-stone-700 whitespace-nowrap ${small ? "text-xs" : "text-sm"}`}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>{rows.map((row, idx) => (
            <tr key={idx} className="odd:bg-white even:bg-stone-50/60 hover:bg-stone-100/60 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className={`border-b border-stone-100 px-4 py-2.5 text-stone-700 ${small ? "text-xs leading-relaxed" : "text-sm leading-relaxed"} ${ci === 0 ? "font-semibold text-stone-900" : ""} ${highlight && row[highlight.col] === highlight.val ? "bg-sky-50/80" : ""}`}>{cell}</td>
              ))}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function VocabGrid({ items, cols = 2 }) {
  return (
    <div className={`grid gap-2 ${cols === 4 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2"}`}>
      {items.map(([pt, en]) => (
        <div key={pt} className="flex items-baseline justify-between gap-3 rounded-xl bg-stone-50 px-4 py-2.5 text-sm">
          <span className="font-semibold text-stone-900">{pt}</span>
          <span className="text-stone-500 text-right">{en}</span>
        </div>
      ))}
    </div>
  );
}

/* FIX #4: SER vs ESTAR as HTML cards (emojis render properly everywhere) */
function SerEstarVisual() {
  return (
    <div className="grid gap-4 md:grid-cols-2 my-4">
      {SER_ESTAR_DATA.map(({ verb, items }) => {
        const isSer = verb === "ser";
        return (
          <div key={verb} className={`rounded-2xl border p-5 ${isSer ? "border-emerald-200 bg-emerald-50/60" : "border-sky-200 bg-sky-50/60"}`}>
            <div className="text-center mb-4">
              <div className={`text-2xl font-black ${isSer ? "text-emerald-800" : "text-sky-800"}`}>{verb.toUpperCase()}</div>
              <div className={`text-xs font-semibold mt-0.5 ${isSer ? "text-emerald-600" : "text-sky-600"}`}>
                {isSer ? "permanent / identity" : "temporary / state"}
              </div>
            </div>
            <div className="space-y-2.5">
              {items.map((it) => (
                <div key={it.label} className="flex items-start gap-3 rounded-xl bg-white/80 p-3">
                  <span className="text-xl leading-none mt-0.5">{it.emoji}</span>
                  <div className="min-w-0">
                    <div className={`text-xs font-bold ${isSer ? "text-emerald-700" : "text-sky-700"}`}>{it.label}</div>
                    <div className={`text-sm mt-0.5 ${isSer ? "text-emerald-600" : "text-sky-600"}`}>{it.ex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* FIX #6: Verb ending pattern as HTML (no fragile pixel math) */
function VerbEndingVisual() {
  const groups = [
    { label:"-AR", verb:"falar", stem:"fal", endings:["o","a","amos","am"], cls:"border-emerald-200 bg-emerald-50/60", accent:"text-emerald-700", badge:"bg-emerald-200 text-emerald-900" },
    { label:"-ER", verb:"comer", stem:"com", endings:["o","e","emos","em"], cls:"border-sky-200 bg-sky-50/60", accent:"text-sky-700", badge:"bg-sky-200 text-sky-900" },
    { label:"-IR", verb:"partir", stem:"part", endings:["o","e","imos","em"], cls:"border-violet-200 bg-violet-50/60", accent:"text-violet-700", badge:"bg-violet-200 text-violet-900" },
  ];
  const pronouns = ["eu","você","nós","eles"];
  return (
    <div className="grid gap-3 sm:grid-cols-3 my-4">
      {groups.map((g) => (
        <div key={g.label} className={`rounded-2xl border p-4 ${g.cls}`}>
          <div className="text-center mb-3">
            <span className={`inline-block rounded-full px-3 py-1 text-sm font-black ${g.badge}`}>{g.label}</span>
            <div className={`text-xs mt-1 ${g.accent} opacity-70`}>{g.verb}</div>
          </div>
          <div className="space-y-1.5">
            {pronouns.map((p, i) => (
              <div key={p} className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-1.5 text-sm">
                <span className="text-stone-400 w-12 shrink-0 text-xs">{p}</span>
                <span className={`font-bold ${g.accent}`}>{g.stem}<span className="underline underline-offset-2 decoration-2">{g.endings[i]}</span></span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* FIX #12: Nasal diagram as full HTML (responsive on all screens) */
function NasalDiagram() {
  return (
    <Card className="p-5">
      <h3 className="text-lg font-bold text-stone-900 mb-1">How nasal vowels work</h3>
      <p className="text-sm text-stone-500 mb-5">Air flows through both the mouth and nose for nasal vowels. This is the defining feature of Portuguese pronunciation.</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-2">Oral vowel</div>
          <div className="text-4xl font-black text-stone-800 mb-1">a</div>
          <div className="text-xs text-stone-500 mb-3">casa</div>
          <div className="mx-auto w-fit space-y-1.5 text-xs text-left">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-0.5 bg-emerald-400 rounded"></span>
              <span className="text-stone-500">mouth: air out</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-0.5 bg-stone-300 rounded"></span>
              <span className="text-stone-500">nose: <span className="font-bold text-red-400">closed</span></span>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">Nasal vowel</div>
          <div className="text-4xl font-black text-emerald-800 mb-1">ã</div>
          <div className="text-xs text-emerald-600 mb-3">maçã</div>
          <div className="mx-auto w-fit space-y-1.5 text-xs text-left">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-0.5 bg-emerald-500 rounded"></span>
              <span className="text-emerald-700">mouth: air out</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-0.5 bg-sky-500 rounded"></span>
              <span className="text-emerald-700">nose: <span className="font-bold text-sky-600">open ✓</span></span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-lg bg-stone-50 border border-stone-200 p-2.5"><span className="font-bold text-stone-900 text-sm">ão</span><br/><span className="text-stone-500">pão, não</span></div>
        <div className="rounded-lg bg-stone-50 border border-stone-200 p-2.5"><span className="font-bold text-stone-900 text-sm">ãe</span><br/><span className="text-stone-500">mãe</span></div>
        <div className="rounded-lg bg-stone-50 border border-stone-200 p-2.5"><span className="font-bold text-stone-900 text-sm">õe</span><br/><span className="text-stone-500">põe</span></div>
      </div>
    </Card>
  );
}

/* FIX #11: Number grid — tens use grid-cols-2 on mobile for even rows */
function NumberGrid() {
  const basics = NUMBER_ROWS_FULL.slice(0, 21);
  const tens = NUMBER_ROWS_FULL.slice(21);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {basics.map(([num, pt]) => (
          <div key={num} className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-center hover:bg-emerald-50 hover:border-emerald-200 transition-colors">
            <div className="text-lg font-black text-stone-900">{num}</div>
            <div className="text-xs text-stone-500 mt-0.5">{pt}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {tens.map(([num, pt]) => (
          <div key={num} className="rounded-xl bg-stone-50 border border-stone-200 p-3 text-center">
            <div className="text-base font-bold text-stone-900">{num}</div>
            <div className="text-xs text-stone-500 mt-0.5">{pt}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
        <span className="font-bold">Compound numbers:</span> 21 = vinte e um, 35 = trinta e cinco, 100 = cem (alone) but 101 = cento e um, 200 = duzentos.
      </div>
    </div>
  );
}

/* FIX #8: Conjugation card with responsive pronoun width */
function ConjugationCard({ group, tense }) {
  const rows = tense === "present" ? group.present : group.past;
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className={`rounded-full ${group.badge} px-2.5 py-0.5 text-xs font-bold uppercase`}>-{group.ending} {tense}</span>
        <span className="font-bold text-stone-900">{group.verb}</span>
      </div>
      <div className="space-y-1.5">
        {rows.map(([pronoun, form], i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg bg-stone-50 px-3 py-2 text-sm">
            <span className="text-stone-500 shrink-0 text-xs sm:text-sm" style={{ minWidth: "5rem", maxWidth: "9rem" }}>{pronoun}</span>
            <span className="font-semibold text-stone-900">{form}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
function PortugueseGuide() {
  const [track, setTrack] = useState("br");
  const [dialogueFilter, setDialogueFilter] = useState("all");
  const [vocabTab, setVocabTab] = useState("food");
  const [navOpen, setNavOpen] = useState(false);
  const currentTrack = TRACKS[track];

  const filteredDialogues = useMemo(() => {
    if (dialogueFilter === "all") return DIALOGUES;
    return DIALOGUES.filter((d) => d.level === dialogueFilter);
  }, [dialogueFilter]);

  const vocabData = { food: VOCAB_FOOD, travel: VOCAB_TRAVEL, directions: VOCAB_DIRECTIONS, colors: VOCAB_COLORS, emergency: VOCAB_EMERGENCY };

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  }, []);

  return (
    /* FIX #10: Single font-family on root, no dual override */
    <div className="min-h-screen bg-stone-50 text-stone-900" style={{ fontFamily: FONT }}>

      {/* FIX #7: Nav — level legend removed, only section links remain */}
      <nav className="sticky top-0 z-50 border-b border-stone-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-lg leading-none">🇧🇷🇵🇹</span>
              <span className="text-sm font-bold text-stone-700 hidden sm:block">Portuguese Complete Guide</span>
            </div>
            <button onClick={() => setNavOpen(!navOpen)} className="lg:hidden rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-50">
              Sections ▾
            </button>
            <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto ml-4 scrollbar-none">
              {SECTIONS.map((s) => (
                <button key={s.id} onClick={() => scrollTo(s.id)} className="px-2 py-1 rounded-lg text-xs text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors whitespace-nowrap">
                  {s.title}
                </button>
              ))}
            </div>
          </div>
          {navOpen && (
            <div className="lg:hidden pb-4 grid grid-cols-2 gap-1.5">
              {SECTIONS.map((s) => (
                <button key={s.id} onClick={() => scrollTo(s.id)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-stone-600 hover:bg-stone-100">
                  <LevelBadge level={s.level} />
                  <span>{s.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* ─── HERO ─── */}
        <div className="rounded-3xl border border-stone-200 bg-gradient-to-br from-stone-50 via-white to-emerald-50/60 p-6 sm:p-8 lg:p-10 shadow-lg shadow-stone-200/40">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.95fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700">
                <Icon name="book" className="h-3.5 w-3.5" /> Complete Course
              </div>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-stone-950 sm:text-5xl lg:text-6xl" style={{ fontFamily: FONT_DISPLAY }}>
                Learn Portuguese
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-stone-600">
                From zero to confident. Pronunciation first, then phrases, grammar, vocabulary, and real conversations. Designed for English speakers. No filler.
              </p>
              <div className="mt-6 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
                {[["a0","A0 — First Contact","Alphabet, sounds, first phrases"],["a1","A1 — Survival","Verbs, questions, dialogues"],["a2","A2 — Foundation","Conjugation, tenses, vocabulary"],["ref","Reference","PT-BR/PT, culture, practice"]].map(([lvl,t,d]) => (
                  <div key={lvl} className={`rounded-2xl border ${LEVELS[lvl].border} ${LEVELS[lvl].bg} px-4 py-3`}>
                    <div className="text-xs font-bold uppercase tracking-widest" style={{ color: LEVELS[lvl].accent }}>{t}</div>
                    <div className="mt-1 text-xs text-stone-500">{d}</div>
                  </div>
                ))}
              </div>
            </div>
            <Card className="bg-white/90">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-stone-400">Variant track</div>
                  <div className="mt-1 text-xl font-bold text-stone-900">{currentTrack.label}</div>
                </div>
                <div className="rounded-xl bg-emerald-100 px-3 py-2 text-sm font-bold text-emerald-800">{currentTrack.short}</div>
              </div>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {[["Greeting",currentTrack.greeting],["Train",currentTrack.train],["Bus",currentTrack.bus],["Phone",currentTrack.phone]].map(([k,v]) => (
                  <div key={k} className="rounded-xl bg-stone-50 p-3">
                    <div className="text-xs uppercase tracking-widest text-stone-400">{k}</div>
                    <div className="mt-1 font-semibold text-stone-900">{v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                {Object.entries(TRACKS).map(([key, item]) => (
                  <button key={key} onClick={() => setTrack(key)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${track === key ? "bg-stone-900 text-white" : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"}`}>
                    {item.short}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* ═══ A0 — ALPHABET ═══ */}
        <SectionHeader id="alphabet" level="a0" icon="book" title="The Alphabet" description="Portuguese uses 26 letters, the same as English. K, W, and Y were formally added by the 1990 Orthographic Agreement; they appear mainly in borrowed words." />
        <Card>
          <Table headers={["Letter","Name","Example","Meaning"]} rows={ALPHABET_ROWS} small />
          <p className="mt-3 text-xs text-stone-400">¹ K, W, Y appear primarily in foreign loanwords and proper names (e.g., kit, web, yoga, Kuala Lumpur).</p>
        </Card>

        {/* ═══ A0 — PRONUNCIATION ═══ */}
        <SectionHeader id="pronunciation" level="a0" icon="sound" title="Pronunciation" description="Portuguese becomes much easier once the sound patterns stop feeling random. Read these aloud before moving on." />
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-bold text-stone-900 mb-3">Core sound patterns</h3>
              <Table headers={["Pattern","Example","Approx.","Note"]} rows={SOUND_ROWS} small />
            </Card>
            <Card>
              <h3 className="text-lg font-bold text-stone-900 mb-3">Stress rules</h3>
              <Table headers={["Word","Read as","Rule"]} rows={STRESS_ROWS} small />
              <div className="mt-3 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800">
                <span className="font-bold">Quick rule:</span> If there is an accent mark (´ ˆ ˜), stress always falls there. If not, stress usually falls on the second-to-last syllable.
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <NasalDiagram />
            <Card className="p-5">
              <h3 className="text-lg font-bold text-stone-900 mb-3">Accent marks at a glance</h3>
              <div className="space-y-2">
                {[["´ (acute)","Open vowel + stress","café, avó"],["ˆ (circumflex)","Closed vowel + stress","você, avô"],["˜ (tilde)","Nasal sound","ão, ã, õe"],["` (grave)","Contraction marker","à (= a + a)"],["¸ (cedilla)","'s' before a, o, u","coração"]].map(([mark,use,ex]) => (
                  <div key={mark} className="grid grid-cols-[5rem_1fr_auto] gap-3 rounded-lg bg-stone-50 p-3 text-sm items-center">
                    <span className="font-bold text-stone-900">{mark}</span>
                    <span className="text-stone-600">{use}</span>
                    <span className="text-stone-400 italic text-xs">{ex}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* ═══ A0 — FIRST PHRASES ═══ */}
        <SectionHeader id="first-phrases" level="a0" icon="chat" title="First Phrases" description="These are the first lines you should be able to understand, say, and respond to." />
        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {FIRST_PHRASES.map(([pt,en]) => (
            <div key={pt} className="rounded-xl border border-stone-200 bg-white p-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-colors">
              <div className="text-base font-bold text-stone-900">{pt}</div>
              <div className="mt-1 text-sm text-stone-500">{en}</div>
            </div>
          ))}
        </div>

        {/* ═══ A0 — NUMBERS ═══ */}
        <SectionHeader id="numbers" level="a0" icon="hash" title="Numbers" description="0 to 20, then tens up to 100, plus 1,000 and 1,000,000. Numbers 1 and 2 have masculine and feminine forms." />
        <NumberGrid />

        {/* ═══ A1 — PRONOUNS & ARTICLES ═══ */}
        <SectionHeader id="pronouns-articles" level="a1" icon="user" title="Pronouns & Articles" description="Portuguese has gendered articles and mandatory contractions. Learn these early — they appear in every sentence." />
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <Card><h3 className="text-lg font-bold text-stone-900 mb-3">Subject pronouns</h3><Table headers={["Portuguese","English","Note"]} rows={PRONOUN_ROWS} small /></Card>
            <Card><h3 className="text-lg font-bold text-stone-900 mb-3">Definite & indefinite articles</h3><Table headers={["Article","Meaning","Gender/Number","Example"]} rows={ARTICLE_ROWS} small /></Card>
          </div>
          <Card><h3 className="text-lg font-bold text-stone-900 mb-3">Contractions (mandatory)</h3>
            <Table headers={["Combination","Meaning","Example"]} rows={CONTRACTION_ROWS} small />
            <div className="mt-3 rounded-xl bg-sky-50 border border-sky-200 p-3 text-xs text-sky-800">
              <span className="font-bold">Key rule:</span> These contractions are not optional. You cannot say "em o centro" — it must be "no centro."
            </div>
          </Card>
        </div>

        {/* ═══ A1 — ESSENTIAL VERBS ═══ */}
        <SectionHeader id="essential-verbs" level="a1" icon="zap" title="Essential Verbs" description="These 12 verbs cover the majority of beginner conversations. Present tense forms for: eu / você-ele-ela / nós / vocês-eles-elas." />
        <Card><Table headers={["Verb","Present forms","Meaning","Example"]} rows={BASIC_VERBS} small /></Card>

        {/* ═══ A1 — SER vs ESTAR ═══ */}
        <SectionHeader id="ser-estar" level="a1" icon="layers" title="Ser vs. Estar" description="Both mean 'to be.' Ser is for permanent traits, identity, origin, and time. Estar is for temporary states, location, and ongoing actions." />
        <SerEstarVisual />
        <Card><Table headers={["Use case","Portuguese","English","Verb"]} rows={SER_ESTAR_TABLE} small highlight={{ col: 3, val: "estar" }} /></Card>

        {/* ═══ A1 — QUESTION WORDS ═══ */}
        <SectionHeader id="questions" level="a1" icon="compass" title="Question Words" description="Portuguese questions often have the same word order as statements, with rising intonation." />
        <Card><Table headers={["Portuguese","English","Example"]} rows={QUESTION_ROWS} small /></Card>

        {/* ═══ A1 — DAYS, MONTHS, TIME ═══ */}
        <SectionHeader id="time-calendar" level="a1" icon="calendar" title="Days, Months & Time" description="Days of the week in Portuguese are numbered (Monday = segunda-feira, 'second day'). Only Saturday and Sunday have non-numeric names." />
        <div className="grid gap-6 xl:grid-cols-3">
          <Card><h3 className="text-lg font-bold text-stone-900 mb-3">Days of the week</h3><VocabGrid items={DAYS} /></Card>
          <Card><h3 className="text-lg font-bold text-stone-900 mb-3">Months</h3><VocabGrid items={MONTHS} /></Card>
          <Card><h3 className="text-lg font-bold text-stone-900 mb-3">Time expressions</h3><VocabGrid items={TIME_EXPRESSIONS} /></Card>
        </div>

        {/* ═══ A1 — DIALOGUES ═══ */}
        <SectionHeader id="dialogues" level="a1" icon="chat" title="Dialogues" description="Read them aloud. Then replace the nouns and locations with your own words." />
        <div className="mb-5 flex flex-wrap gap-2">
          {[["all","All"],["beginner","Beginner"],["intermediate","Intermediate"],["advanced","Advanced"]].map(([k,l]) => (
            <button key={k} onClick={() => setDialogueFilter(k)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${dialogueFilter === k ? "bg-sky-700 text-white" : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"}`}>{l}</button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDialogues.map((d) => (
            <Card key={d.key}>
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="font-bold text-stone-900">{d.title}</h3>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-widest shrink-0 ${d.level === "beginner" ? "bg-emerald-100 text-emerald-700" : d.level === "intermediate" ? "bg-sky-100 text-sky-700" : "bg-violet-100 text-violet-700"}`}>{d.level}</span>
              </div>
              <div className="space-y-2">
                {d.lines.map(([sp,line],i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl bg-stone-50 p-3 text-sm leading-relaxed text-stone-700">
                    <span className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white shrink-0 ${sp === "A" ? "bg-stone-800" : "bg-stone-500"}`}>{sp}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* ═══ A2 — CONJUGATION ═══ */}
        <SectionHeader id="conjugation" level="a2" icon="layers" title="Regular Verb Conjugation" description="Portuguese verbs split into three groups: -ar (most common), -er, and -ir. Learn the pattern, apply it to hundreds of verbs." />
        <VerbEndingVisual />
        <div className="grid gap-4 xl:grid-cols-3">
          {CONJUGATION_GROUPS.map((g) => <ConjugationCard key={g.ending+"p"} group={g} tense="present" />)}
        </div>
        <div className="mt-4 rounded-xl bg-violet-50 border border-violet-200 p-4 text-sm text-violet-800">
          <span className="font-bold">Other regular -ar verbs:</span> trabalhar (work), estudar (study), morar (live), comprar (buy), pagar (pay), ajudar (help), viajar (travel), cantar (sing), dançar (dance).
        </div>

        {/* ═══ A2 — PAST TENSE ═══ */}
        <SectionHeader id="past-tense" level="a2" icon="clock" title="Past Tense (Pretérito Perfeito)" description="The simple past for completed actions. 'I spoke,' 'I ate,' 'I left.' Same three groups, different endings." />
        <div className="grid gap-4 xl:grid-cols-3">
          {CONJUGATION_GROUPS.map((g) => <ConjugationCard key={g.ending+"past"} group={g} tense="past" />)}
        </div>

        {/* ═══ A2 — PREPOSITIONS ═══ */}
        <SectionHeader id="prepositions" level="a2" icon="map" title="Prepositions" description="The ten most common prepositions. Most contract with articles (covered in the contractions table above)." />
        <Card><Table headers={["Preposition","Meaning","Example"]} rows={PREPOSITION_ROWS} small /></Card>

        {/* ═══ A2 — VOCABULARY ═══ */}
        <SectionHeader id="vocabulary" level="a2" icon="palette" title="Vocabulary by Theme" description="Organized by real-life situations. These are the words you will use first." />
        <div className="mb-5 flex flex-wrap gap-2">
          {[["food","🍽 Food & Drink"],["travel","✈ Travel"],["directions","🧭 Directions"],["colors","🎨 Colors"],["emergency","🚨 Emergency"]].map(([k,l]) => (
            <button key={k} onClick={() => setVocabTab(k)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${vocabTab === k ? "bg-violet-700 text-white" : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"}`}>{l}</button>
          ))}
        </div>
        <VocabGrid items={vocabData[vocabTab]} cols={vocabTab === "emergency" ? 2 : 4} />

        {/* ═══ REF — PT-BR vs PT-PT ═══ */}
        <SectionHeader id="pt-br-pt" level="ref" icon="globe" title="PT-BR vs. PT-PT" description="Keep these differences visible from the start. Choosing one variant does not prevent you from understanding the other." />
        <Card>
          <Table headers={["English","PT-BR (Brazil)","PT-PT (Portugal)"]} rows={PT_DIFF_ROWS} small />
          <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
            <span className="font-bold">Biggest structural difference:</span> Brazil uses the gerund form (estou falando = I am speaking), while Portugal uses "estar a + infinitive" (estou a falar).
          </div>
        </Card>

        {/* ═══ REF — CULTURAL NOTES ═══ */}
        <SectionHeader id="cultural" level="ref" icon="heart" title="Cultural Notes" description="Language is inseparable from culture. These notes prevent common misunderstandings." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CULTURAL_NOTES.map((n) => (
            <Card key={n.title} className="p-4">
              <h3 className="font-bold text-stone-900 mb-2">{n.title}</h3>
              <p className="text-sm leading-relaxed text-stone-600">{n.text}</p>
            </Card>
          ))}
        </div>

        {/* ═══ REF — PRACTICE ═══ */}
        <SectionHeader id="practice" level="ref" icon="spark" title="Practice Exercises" description="Do not just read. Answer these out loud." />
        <div className="grid gap-4 xl:grid-cols-3">
          {PRACTICE_BLOCKS.map((b) => (
            <Card key={b.title}>
              <div className="flex items-center gap-2 mb-4">
                <Icon name={b.icon} className="h-5 w-5 text-stone-400" />
                <h3 className="font-bold text-stone-900">{b.title}</h3>
              </div>
              <div className="space-y-2">
                {b.items.map((item,i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-xl bg-stone-50 p-3 text-sm text-stone-700">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-stone-200 text-xs font-bold text-stone-600 shrink-0 mt-0.5">{i + 1}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* ─── FOOTER ─── */}
        <div className="mt-12 pb-8">
          <Card className="bg-stone-950 text-stone-50 border-stone-800 shadow-none">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-300">
                  <Icon name="flag" className="h-3.5 w-3.5" /> What's next
                </div>
                <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl" style={{ fontFamily: FONT_DISPLAY }}>Keep going</h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-stone-400">
                  This guide covers A0 through A2 with reference material. Your next steps: practice speaking with native speakers, listen to Portuguese music and podcasts, and revisit these tables until the patterns become automatic.
                </p>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {["Full 26-letter alphabet","Nasal vowel diagram","Ser vs. Estar visual","Verb ending pattern chart","Numbers 0–1,000,000","8 graded dialogues","5 vocabulary themes","6 cultural notes"].map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-stone-300">{item}</div>
                ))}
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}

export default PortugueseGuide;
