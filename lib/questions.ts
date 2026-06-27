export type Language = 'pt' | 'en' | 'es';

export interface LocalizedQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface QuestionEntry {
  id: string;
  book: string; // Used for filtering by book (Antigo/Novo Testamento, etc)
  translations: Record<Language, LocalizedQuestion>;
}

export const questionsDB: QuestionEntry[] = [
  {
    id: "gen_1",
    book: "Gênesis",
    translations: {
      pt: {
        question: "No relato da criação, o que Deus criou no primeiro dia?",
        options: ["O sol e a lua", "A luz", "Os animais marinhos", "A terra seca"],
        answerIndex: 1,
        explanation: "Gênesis 1:3 - 'Disse Deus: Haja luz; e houve luz.'"
      },
      en: {
        question: "In the creation account, what did God create on the first day?",
        options: ["The sun and moon", "Light", "Sea creatures", "Dry land"],
        answerIndex: 1,
        explanation: "Genesis 1:3 - 'And God said, Let there be light: and there was light.'"
      },
      es: {
        question: "En el relato de la creación, ¿qué creó Dios en el primer día?",
        options: ["El sol y la luna", "La luz", "Los animales marinos", "La tierra seca"],
        answerIndex: 1,
        explanation: "Génesis 1:3 - 'Y dijo Dios: Sea la luz; y fue la luz.'"
      }
    }
  },
  {
    id: "ex_1",
    book: "Êxodo",
    translations: {
      pt: {
        question: "Qual foi a primeira praga que atingiu o Egito?",
        options: ["Rãs", "Gafanhotos", "As águas do Nilo viraram sangue", "Escuridão"],
        answerIndex: 2,
        explanation: "Êxodo 7:20 - Moisés e Arão feriram as águas do Nilo, e toda a água se transformou em sangue."
      },
      en: {
        question: "What was the first plague that struck Egypt?",
        options: ["Frogs", "Locusts", "The waters of the Nile turned to blood", "Darkness"],
        answerIndex: 2,
        explanation: "Exodus 7:20 - Moses and Aaron struck the waters of the Nile, and all the water was turned into blood."
      },
      es: {
        question: "¿Cuál fue la primera plaga que azotó a Egipto?",
        options: ["Ranas", "Langostas", "Las aguas del Nilo se convirtieron en sangre", "Oscuridad"],
        answerIndex: 2,
        explanation: "Éxodo 7:20 - Moisés y Aarón golpearon las aguas del Nilo, y toda el agua se convirtió en sangre."
      }
    }
  },
  {
    id: "sam_1",
    book: "1 Samuel",
    translations: {
      pt: {
        question: "Quem era o profeta que ungiu Davi como rei?",
        options: ["Elias", "Eliseu", "Samuel", "Natã"],
        answerIndex: 2,
        explanation: "1 Samuel 16:13 - Samuel tomou o chifre de óleo e o ungiu no meio de seus irmãos."
      },
      en: {
        question: "Who was the prophet that anointed David as king?",
        options: ["Elijah", "Elisha", "Samuel", "Nathan"],
        answerIndex: 2,
        explanation: "1 Samuel 16:13 - Then Samuel took the horn of oil, and anointed him in the midst of his brethren."
      },
      es: {
        question: "¿Quién fue el profeta que ungió a David como rey?",
        options: ["Elías", "Eliseo", "Samuel", "Natán"],
        answerIndex: 2,
        explanation: "1 Samuel 16:13 - Samuel tomó el cuerno de aceite y lo ungió en medio de sus hermanos."
      }
    }
  },
  {
    id: "mt_1",
    book: "Mateus",
    translations: {
      pt: {
        question: "Qual é a oração que Jesus ensinou no Sermão da Montanha?",
        options: ["Ave Maria", "Pai Nosso", "O Credo", "Salve Rainha"],
        answerIndex: 1,
        explanation: "Mateus 6:9-13 - Jesus ensina o 'Pai Nosso' como o modelo perfeito de oração."
      },
      en: {
        question: "What prayer did Jesus teach in the Sermon on the Mount?",
        options: ["Hail Mary", "Our Father (Lord's Prayer)", "The Creed", "Hail Holy Queen"],
        answerIndex: 1,
        explanation: "Matthew 6:9-13 - Jesus teaches the 'Our Father' as the perfect model of prayer."
      },
      es: {
        question: "¿Qué oración enseñó Jesús en el Sermón del Monte?",
        options: ["Ave María", "Padre Nuestro", "El Credo", "Salve"],
        answerIndex: 1,
        explanation: "Mateo 6:9-13 - Jesús enseña el 'Padre Nuestro' como el modelo perfecto de oración."
      }
    }
  },
  {
    id: "lc_1",
    book: "Lucas",
    translations: {
      pt: {
        question: "Quem era o cobrador de impostos de baixa estatura que subiu num sicômoro para ver Jesus?",
        options: ["Mateus", "Zaqueu", "Nicodemos", "Jairo"],
        answerIndex: 1,
        explanation: "Lucas 19:3-4 - Zaqueu, sendo de baixa estatura, correu à frente e subiu num sicômoro para ver Jesus."
      },
      en: {
        question: "Who was the short tax collector who climbed a sycamore tree to see Jesus?",
        options: ["Matthew", "Zacchaeus", "Nicodemus", "Jairus"],
        answerIndex: 1,
        explanation: "Luke 19:3-4 - Zacchaeus, being short in stature, ran ahead and climbed a sycamore-fig tree to see him."
      },
      es: {
        question: "¿Quién era el recaudador de impuestos de baja estatura que subió a un sicómoro para ver a Jesús?",
        options: ["Mateo", "Zaqueo", "Nicodemo", "Jairo"],
        answerIndex: 1,
        explanation: "Lucas 19:3-4 - Zaqueo, por ser de baja estatura, corrió delante y subió a un árbol sicómoro para ver a Jesús."
      }
    }
  },
  {
    id: "jo_1",
    book: "João",
    translations: {
      pt: {
        question: "Qual foi o primeiro milagre de Jesus registrado no Evangelho de João?",
        options: ["Multiplicação dos pães", "Caminhar sobre as águas", "Transformar água em vinho", "Curar um cego de nascença"],
        answerIndex: 2,
        explanation: "João 2:1-11 - Nas bodas de Caná, Jesus transforma a água em vinho, Seu primeiro sinal miraculoso."
      },
      en: {
        question: "What was the first miracle of Jesus recorded in the Gospel of John?",
        options: ["Multiplication of the loaves", "Walking on water", "Turning water into wine", "Healing a man born blind"],
        answerIndex: 2,
        explanation: "John 2:1-11 - At the wedding at Cana, Jesus turned water into wine, His first miraculous sign."
      },
      es: {
        question: "¿Cuál fue el primer milagro de Jesús registrado en el Evangelio de Juan?",
        options: ["Multiplicación de los panes", "Caminar sobre las aguas", "Convertir el agua en vino", "Sanar a un ciego de nacimiento"],
        answerIndex: 2,
        explanation: "Juan 2:1-11 - En las bodas de Caná, Jesús transformó el agua en vino, su primer milagro."
      }
    }
  },
  {
    id: "atos_1",
    book: "Atos dos Apóstolos",
    translations: {
      pt: {
        question: "Qual apóstolo discursou para a multidão no dia de Pentecostes?",
        options: ["João", "Tiago", "Paulo", "Pedro"],
        answerIndex: 3,
        explanation: "Atos 2:14 - Pedro levantou-se com os Onze, ergueu a voz e dirigiu-se à multidão."
      },
      en: {
        question: "Which apostle addressed the crowd on the day of Pentecost?",
        options: ["John", "James", "Paul", "Peter"],
        answerIndex: 3,
        explanation: "Acts 2:14 - Peter stood up with the Eleven, raised his voice and addressed the crowd."
      },
      es: {
        question: "¿Qué apóstol se dirigió a la multitud en el día de Pentecostés?",
        options: ["Juan", "Santiago", "Pablo", "Pedro"],
        answerIndex: 3,
        explanation: "Hechos 2:14 - Pedro se puso de pie con los once, levantó la voz y se dirigió a la multitud."
      }
    }
  },
  {
    id: "apoc_1",
    book: "Apocalipse",
    translations: {
      pt: {
        question: "A quem João foi instruído a escrever no início do Apocalipse?",
        options: ["Aos judeus em Jerusalém", "Aos gentios", "Às sete igrejas na província da Ásia", "Aos apóstolos restantes"],
        answerIndex: 2,
        explanation: "Apocalipse 1:4 - 'João, às sete igrejas que estão na província da Ásia'."
      },
      en: {
        question: "To whom was John instructed to write at the beginning of Revelation?",
        options: ["To the Jews in Jerusalem", "To the Gentiles", "To the seven churches in the province of Asia", "To the remaining apostles"],
        answerIndex: 2,
        explanation: "Revelation 1:4 - 'John, To the seven churches in the province of Asia'."
      },
      es: {
        question: "¿A quién se le instruyó a Juan que escribiera al comienzo del Apocalipsis?",
        options: ["A los judíos en Jerusalén", "A los gentiles", "A las siete iglesias en la provincia de Asia", "A los apóstoles restantes"],
        answerIndex: 2,
        explanation: "Apocalipsis 1:4 - 'Juan, a las siete iglesias que están en Asia'."
      }
    }
  }
];

// Helper functions to manage the question pool
export function getRandomQuestion(
  language: Language, 
  answeredIds: string[], 
  selectedBook?: string
): QuestionEntry | null {
  let available = questionsDB.filter(q => !answeredIds.includes(q.id));
  
  if (selectedBook) {
    available = available.filter(q => q.book === selectedBook);
  }

  if (available.length === 0) {
    // If we run out of questions for the filter, we return null so the UI can reset the pool or notify the user
    return null; 
  }

  const randomIndex = Math.floor(Math.random() * available.length);
  return available[randomIndex];
}
