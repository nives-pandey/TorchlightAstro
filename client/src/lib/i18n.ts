import { useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'ru' | 'fr';

export const languages = {
  en: 'English',
  es: 'Español',
  ru: 'Русский',
  fr: 'Français'
} as const;

export const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.chart': 'Chart',
    'nav.compatibility': 'Compatibility',
    'nav.daily': 'Daily',
    'nav.numerology': 'Numerology',
    'nav.ai': 'AI Assistant',
    'nav.about': 'About',
    'nav.signIn': 'Sign In',
    'nav.signOut': 'Sign Out',
    
    // Landing Page
    'landing.title': 'Your Complete Cosmic Guide',
    'landing.subtitle': 'Torchlight illuminates your path with authentic insights from Western, Vedic, Chinese, Human Design, and Numerology systems. Get comprehensive guidance while maintaining full control over your decisions.',
    'landing.startJourney': 'Start Your Journey',
    'landing.whatIs': 'What is Torchlight?',
    'landing.whatIsSubtitle': 'A comprehensive astrological guidance system combining ancient wisdom with modern precision',
    'landing.philosophy': 'Our Philosophy',
    'landing.science': 'The Science',
    'landing.guidance': 'Comprehensive Cosmic Guidance',
    'landing.guidanceSubtitle': 'Professional-grade tools for deep cosmic insights and personal growth',
    'landing.ready': 'Ready to illuminate your path?',
    'landing.readySubtitle': 'Join thousands who have discovered deeper insights into their cosmic blueprint with Torchlight\'s comprehensive astrological guidance.',
    
    // Feature Cards
    'features.natal.title': 'Natal Chart Analysis',
    'features.natal.desc': 'Deep insights from multiple astrological systems with authentic astronomical calculations',
    'features.compatibility.title': 'Compatibility Analysis',
    'features.compatibility.desc': 'Relationship insights across all astrological systems',
    'features.daily.title': 'Daily Guidance',
    'features.daily.desc': 'Personalized daily insights with optimal timing recommendations',
    'features.ai.title': 'AI Assistant & Numerology',
    'features.ai.desc': 'Interactive cosmic guidance with complete numerology calculations',
    'features.lifestyle.title': 'Lifestyle Recommendations',
    'features.lifestyle.desc': 'Comprehensive guidance for career, health, and personal growth',
    'features.education.title': 'Educational Content',
    'features.education.desc': 'Learn about astrology\'s scientific foundations and methodology',
    
    // Philosophy Points
    'philosophy.illumination': 'Illumination, not direction: The system lights your path but you choose where to walk',
    'philosophy.multiple': 'Multiple perspectives: Five ancient systems provide complete cosmic insights',
    'philosophy.authentic': 'Authentic calculations: Precise astronomical data, not generic horoscopes',
    'philosophy.responsibility': 'Personal responsibility: You maintain full control over your decisions',
    
    // Science Points
    'science.precision': 'Mathematical precision: Swiss Ephemeris calculations for accuracy',
    'science.study': '4,000+ years of study: Time-tested patterns and correlations',
    'science.validation': 'Cross-cultural validation: Consistent findings across civilizations',
    'science.openSource': 'No paid APIs: 100% open-source knowledge base for unlimited access',
    
    // Badges
    'badges.western': 'Western Astrology',
    'badges.vedic': 'Vedic Wisdom',
    'badges.chinese': 'Chinese Zodiac',
    'badges.humanDesign': 'Human Design',
    'badges.numerology': 'Numerology',
    
    // Quote
    'quote.astrology': '"Astrology is not fortune-telling, but rather the illumination of natural patterns and potential paths. Your free will remains the most powerful force in shaping your destiny."'
  },
  
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.chart': 'Carta',
    'nav.compatibility': 'Compatibilidad',
    'nav.daily': 'Diario',
    'nav.numerology': 'Numerología',
    'nav.ai': 'Asistente IA',
    'nav.about': 'Acerca de',
    'nav.signIn': 'Iniciar Sesión',
    'nav.signOut': 'Cerrar Sesión',
    
    // Landing Page
    'landing.title': 'Tu Guía Cósmica Completa',
    'landing.subtitle': 'Torchlight ilumina tu camino con perspectivas auténticas de los sistemas Occidental, Védico, Chino, Diseño Humano y Numerología. Obtén orientación integral mientras mantienes el control completo de tus decisiones.',
    'landing.startJourney': 'Comienza Tu Viaje',
    'landing.whatIs': '¿Qué es Torchlight?',
    'landing.whatIsSubtitle': 'Un sistema integral de orientación astrológica que combina sabiduría ancestral con precisión moderna',
    'landing.philosophy': 'Nuestra Filosofía',
    'landing.science': 'La Ciencia',
    'landing.guidance': 'Orientación Cósmica Integral',
    'landing.guidanceSubtitle': 'Herramientas de nivel profesional para perspectivas cósmicas profundas y crecimiento personal',
    'landing.ready': '¿Listo para iluminar tu camino?',
    'landing.readySubtitle': 'Únete a miles que han descubierto perspectivas más profundas de su diseño cósmico con la orientación astrológica integral de Torchlight.',
    
    // Feature Cards
    'features.natal.title': 'Análisis de Carta Natal',
    'features.natal.desc': 'Perspectivas profundas de múltiples sistemas astrológicos con cálculos astronómicos auténticos',
    'features.compatibility.title': 'Análisis de Compatibilidad',
    'features.compatibility.desc': 'Perspectivas de relaciones a través de todos los sistemas astrológicos',
    'features.daily.title': 'Orientación Diaria',
    'features.daily.desc': 'Perspectivas diarias personalizadas con recomendaciones de timing óptimo',
    'features.ai.title': 'Asistente IA y Numerología',
    'features.ai.desc': 'Orientación cósmica interactiva con cálculos numerológicos completos',
    'features.lifestyle.title': 'Recomendaciones de Estilo de Vida',
    'features.lifestyle.desc': 'Orientación integral para carrera, salud y crecimiento personal',
    'features.education.title': 'Contenido Educativo',
    'features.education.desc': 'Aprende sobre los fundamentos científicos y metodología de la astrología',
    
    // Philosophy Points
    'philosophy.illumination': 'Iluminación, no dirección: El sistema ilumina tu camino pero tú eliges por dónde caminar',
    'philosophy.multiple': 'Múltiples perspectivas: Cinco sistemas ancestrales proporcionan perspectivas cósmicas completas',
    'philosophy.authentic': 'Cálculos auténticos: Datos astronómicos precisos, no horóscopos genéricos',
    'philosophy.responsibility': 'Responsabilidad personal: Mantienes el control total de tus decisiones',
    
    // Science Points
    'science.precision': 'Precisión matemática: Cálculos de Efemérides Suizas para exactitud',
    'science.study': '+4,000 años de estudio: Patrones y correlaciones probados en el tiempo',
    'science.validation': 'Validación transcultural: Hallazgos consistentes a través de civilizaciones',
    'science.openSource': 'Sin APIs pagadas: Base de conocimiento 100% código abierto para acceso ilimitado',
    
    // Badges
    'badges.western': 'Astrología Occidental',
    'badges.vedic': 'Sabiduría Védica',
    'badges.chinese': 'Zodíaco Chino',
    'badges.humanDesign': 'Diseño Humano',
    'badges.numerology': 'Numerología',
    
    // Quote
    'quote.astrology': '"La astrología no es adivinación, sino la iluminación de patrones naturales y caminos potenciales. Tu libre albedrío sigue siendo la fuerza más poderosa para dar forma a tu destino."'
  },
  
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.chart': 'Карта',
    'nav.compatibility': 'Совместимость',
    'nav.daily': 'Ежедневно',
    'nav.numerology': 'Нумерология',
    'nav.ai': 'ИИ Помощник',
    'nav.about': 'О нас',
    'nav.signIn': 'Войти',
    'nav.signOut': 'Выйти',
    
    // Landing Page
    'landing.title': 'Ваш Полный Космический Путеводитель',
    'landing.subtitle': 'Torchlight освещает ваш путь подлинными знаниями из Западной, Ведической, Китайской астрологии, Дизайна Человека и Нумерологии. Получите всестороннее руководство, сохраняя полный контроль над своими решениями.',
    'landing.startJourney': 'Начать Ваше Путешествие',
    'landing.whatIs': 'Что такое Torchlight?',
    'landing.whatIsSubtitle': 'Комплексная система астрологического руководства, сочетающая древнюю мудрость с современной точностью',
    'landing.philosophy': 'Наша Философия',
    'landing.science': 'Наука',
    'landing.guidance': 'Всестороннее Космическое Руководство',
    'landing.guidanceSubtitle': 'Профессиональные инструменты для глубоких космических прозрений и личностного роста',
    'landing.ready': 'Готовы осветить свой путь?',
    'landing.readySubtitle': 'Присоединяйтесь к тысячам людей, которые открыли более глубокие прозрения в свой космический план с всесторонним астрологическим руководством Torchlight.',
    
    // Feature Cards
    'features.natal.title': 'Анализ Натальной Карты',
    'features.natal.desc': 'Глубокие прозрения из множественных астрологических систем с подлинными астрономическими расчётами',
    'features.compatibility.title': 'Анализ Совместимости',
    'features.compatibility.desc': 'Прозрения отношений через все астрологические системы',
    'features.daily.title': 'Ежедневное Руководство',
    'features.daily.desc': 'Персонализированные ежедневные прозрения с рекомендациями оптимального времени',
    'features.ai.title': 'ИИ Помощник и Нумерология',
    'features.ai.desc': 'Интерактивное космическое руководство с полными нумерологическими расчётами',
    'features.lifestyle.title': 'Рекомендации Образа Жизни',
    'features.lifestyle.desc': 'Всестороннее руководство для карьеры, здоровья и личностного роста',
    'features.education.title': 'Образовательный Контент',
    'features.education.desc': 'Изучите научные основы и методологию астрологии',
    
    // Philosophy Points
    'philosophy.illumination': 'Освещение, а не направление: Система освещает ваш путь, но вы выбираете, куда идти',
    'philosophy.multiple': 'Множественные перспективы: Пять древних систем обеспечивают полные космические прозрения',
    'philosophy.authentic': 'Подлинные расчёты: Точные астрономические данные, а не общие гороскопы',
    'philosophy.responsibility': 'Личная ответственность: Вы сохраняете полный контроль над своими решениями',
    
    // Science Points
    'science.precision': 'Математическая точность: Расчёты Швейцарских Эфемерид для точности',
    'science.study': '4000+ лет изучения: Проверенные временем паттерны и корреляции',
    'science.validation': 'Кросс-культурная валидация: Последовательные находки через цивилизации',
    'science.openSource': 'Без платных API: 100% база знаний с открытым исходным кодом для неограниченного доступа',
    
    // Badges
    'badges.western': 'Западная Астрология',
    'badges.vedic': 'Ведическая Мудрость',
    'badges.chinese': 'Китайский Зодиак',
    'badges.humanDesign': 'Дизайн Человека',
    'badges.numerology': 'Нумерология',
    
    // Quote
    'quote.astrology': '"Астрология - это не гадание, а освещение естественных паттернов и потенциальных путей. Ваша свободная воля остаётся самой мощной силой в формировании вашей судьбы."'
  },
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.chart': 'Thème',
    'nav.compatibility': 'Compatibilité',
    'nav.daily': 'Quotidien',
    'nav.numerology': 'Numérologie',
    'nav.ai': 'Assistant IA',
    'nav.about': 'À propos',
    'nav.signIn': 'Se Connecter',
    'nav.signOut': 'Se Déconnecter',
    
    // Landing Page
    'landing.title': 'Votre Guide Cosmique Complet',
    'landing.subtitle': 'Torchlight illumine votre chemin avec des perspectives authentiques des systèmes Occidental, Védique, Chinois, Design Humain et Numérologie. Obtenez des conseils complets tout en gardant le contrôle total de vos décisions.',
    'landing.startJourney': 'Commencer Votre Voyage',
    'landing.whatIs': 'Qu\'est-ce que Torchlight ?',
    'landing.whatIsSubtitle': 'Un système complet de guidance astrologique combinant sagesse ancestrale et précision moderne',
    'landing.philosophy': 'Notre Philosophie',
    'landing.science': 'La Science',
    'landing.guidance': 'Guidance Cosmique Complète',
    'landing.guidanceSubtitle': 'Outils de niveau professionnel pour des perspectives cosmiques profondes et la croissance personnelle',
    'landing.ready': 'Prêt à illuminer votre chemin ?',
    'landing.readySubtitle': 'Rejoignez des milliers de personnes qui ont découvert des perspectives plus profondes de leur plan cosmique avec la guidance astrologique complète de Torchlight.',
    
    // Feature Cards
    'features.natal.title': 'Analyse du Thème Natal',
    'features.natal.desc': 'Perspectives profondes de multiples systèmes astrologiques avec calculs astronomiques authentiques',
    'features.compatibility.title': 'Analyse de Compatibilité',
    'features.compatibility.desc': 'Perspectives relationnelles à travers tous les systèmes astrologiques',
    'features.daily.title': 'Guidance Quotidienne',
    'features.daily.desc': 'Perspectives quotidiennes personnalisées avec recommandations de timing optimal',
    'features.ai.title': 'Assistant IA et Numérologie',
    'features.ai.desc': 'Guidance cosmique interactive avec calculs numérologiques complets',
    'features.lifestyle.title': 'Recommandations de Mode de Vie',
    'features.lifestyle.desc': 'Guidance complète pour carrière, santé et croissance personnelle',
    'features.education.title': 'Contenu Éducatif',
    'features.education.desc': 'Apprenez les fondements scientifiques et la méthodologie de l\'astrologie',
    
    // Philosophy Points
    'philosophy.illumination': 'Illumination, pas direction : Le système éclaire votre chemin mais vous choisissez où marcher',
    'philosophy.multiple': 'Perspectives multiples : Cinq systèmes ancestraux fournissent des perspectives cosmiques complètes',
    'philosophy.authentic': 'Calculs authentiques : Données astronomiques précises, pas d\'horoscopes génériques',
    'philosophy.responsibility': 'Responsabilité personnelle : Vous gardez le contrôle total de vos décisions',
    
    // Science Points
    'science.precision': 'Précision mathématique : Calculs des Éphémérides Suisses pour l\'exactitude',
    'science.study': '4000+ années d\'étude : Modèles et corrélations éprouvés dans le temps',
    'science.validation': 'Validation interculturelle : Découvertes cohérentes à travers les civilisations',
    'science.openSource': 'Pas d\'API payantes : Base de connaissances 100% open source pour accès illimité',
    
    // Badges
    'badges.western': 'Astrologie Occidentale',
    'badges.vedic': 'Sagesse Védique',
    'badges.chinese': 'Zodiaque Chinois',
    'badges.humanDesign': 'Design Humain',
    'badges.numerology': 'Numérologie',
    
    // Quote
    'quote.astrology': '"L\'astrologie n\'est pas de la divination, mais plutôt l\'illumination de modèles naturels et de chemins potentiels. Votre libre arbitre reste la force la plus puissante pour façonner votre destin."'
  }
};

export function useTranslation() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem('torchlight-language');
    if (stored && stored in translations) {
      return stored as Language;
    }
    
    // Auto-detect browser language
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang in translations) {
      return browserLang as Language;
    }
    
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('torchlight-language', language);
  }, [language]);

  const t = (key: string): string => {
    const translation = translations[language];
    return translation[key as keyof typeof translation] || translations.en[key as keyof typeof translations.en] || key;
  };

  return {
    language,
    setLanguage,
    t,
    languages
  };
}

// Word count utility for translation verification
export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Translation statistics
export function getTranslationStats() {
  const stats: Record<Language, { keys: number; words: number }> = {} as any;
  
  Object.entries(translations).forEach(([lang, trans]) => {
    const keyCount = Object.keys(trans).length;
    const wordCount = Object.values(trans).reduce((total, text) => {
      return total + getWordCount(text);
    }, 0);
    
    stats[lang as Language] = {
      keys: keyCount,
      words: wordCount
    };
  });
  
  return stats;
}