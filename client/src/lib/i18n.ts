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
    'nav.personal': 'Personal Astrology',
    'nav.couples': 'Relationships',
    'nav.spaces': 'Homes & Business',
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
    
    // Sections
    'sections.personal': 'For Individuals',
    'sections.personalDesc': 'Personal astrology, numerology, and life guidance',
    'sections.couples': 'For Couples',
    'sections.couplesDesc': 'Relationship compatibility across all astrological systems',
    'sections.spaces': 'For Homes & Business',
    'sections.spacesDesc': 'Vastu Shastra and Feng Shui for harmonious spaces',
    
    // Personal Features
    'personal.natal.title': 'Natal Chart Analysis',
    'personal.natal.desc': 'Deep insights from Western, Vedic, Chinese astrology with authentic calculations',
    'personal.numerology.title': 'Complete Numerology',
    'personal.numerology.desc': 'Life path, destiny, soul urge, and personality number analysis',
    'personal.daily.title': 'Daily Guidance',
    'personal.daily.desc': 'Personalized daily insights with optimal timing recommendations',
    'personal.design.title': 'Human Design',
    'personal.design.desc': 'Complete Human Design chart with type, strategy, and authority',
    
    // Couples Features
    'couples.synastry.title': 'Synastry Analysis',
    'couples.synastry.desc': 'Deep compatibility analysis across Western and Vedic systems',
    'couples.composite.title': 'Composite Charts',
    'couples.composite.desc': 'Relationship chart analysis revealing partnership dynamics',
    'couples.chinese.title': 'Chinese Compatibility',
    'couples.chinese.desc': 'Chinese zodiac compatibility with element and animal analysis',
    'couples.numerology.title': 'Numerology Compatibility',
    'couples.numerology.desc': 'Life path and destiny number compatibility analysis',
    
    // Spaces Features
    'spaces.vastu.title': 'Vastu Shastra',
    'spaces.vastu.desc': 'Ancient Indian architectural principles for harmonious living spaces',
    'spaces.fengshui.title': 'Feng Shui',
    'spaces.fengshui.desc': 'Chinese geomancy for optimal energy flow in homes and offices',
    'spaces.timing.title': 'Auspicious Timing',
    'spaces.timing.desc': 'Best times for moving, renovating, or starting new ventures',
    'spaces.remedies.title': 'Space Remedies',
    'spaces.remedies.desc': 'Color, crystal, and placement recommendations for energy balance',
    
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
    'nav.personal': 'Astrología Personal',
    'nav.couples': 'Relaciones',
    'nav.spaces': 'Hogar y Negocio',
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
    
    // Sections
    'sections.personal': 'Para Individuos',
    'sections.personalDesc': 'Astrología personal, numerología y guía de vida',
    'sections.couples': 'Para Parejas',
    'sections.couplesDesc': 'Compatibilidad de relaciones en todos los sistemas astrológicos',
    'sections.spaces': 'Para Hogar y Negocio',
    'sections.spacesDesc': 'Vastu Shastra y Feng Shui para espacios armoniosos',
    
    // Personal Features
    'personal.natal.title': 'Análisis de Carta Natal',
    'personal.natal.desc': 'Perspectivas profundas de astrología Occidental, Védica, China con cálculos auténticos',
    'personal.numerology.title': 'Numerología Completa',
    'personal.numerology.desc': 'Análisis de números de camino de vida, destino, impulso del alma y personalidad',
    'personal.daily.title': 'Orientación Diaria',
    'personal.daily.desc': 'Perspectivas diarias personalizadas con recomendaciones de timing óptimo',
    'personal.design.title': 'Diseño Humano',
    'personal.design.desc': 'Carta completa de Diseño Humano con tipo, estrategia y autoridad',
    
    // Couples Features
    'couples.synastry.title': 'Análisis de Sinastría',
    'couples.synastry.desc': 'Análisis profundo de compatibilidad en sistemas Occidental y Védico',
    'couples.composite.title': 'Cartas Compuestas',
    'couples.composite.desc': 'Análisis de carta de relación revelando dinámicas de pareja',
    'couples.chinese.title': 'Compatibilidad China',
    'couples.chinese.desc': 'Compatibilidad del zodíaco chino con análisis de elemento y animal',
    'couples.numerology.title': 'Compatibilidad Numerológica',
    'couples.numerology.desc': 'Análisis de compatibilidad de números de camino de vida y destino',
    
    // Spaces Features
    'spaces.vastu.title': 'Vastu Shastra',
    'spaces.vastu.desc': 'Principios arquitectónicos indios ancestrales para espacios de vida armoniosos',
    'spaces.fengshui.title': 'Feng Shui',
    'spaces.fengshui.desc': 'Geomancia china para flujo óptimo de energía en hogar y oficinas',
    'spaces.timing.title': 'Timing Auspicioso',
    'spaces.timing.desc': 'Mejores momentos para mudarse, renovar o iniciar nuevas empresas',
    'spaces.remedies.title': 'Remedios de Espacio',
    'spaces.remedies.desc': 'Recomendaciones de color, cristal y ubicación para equilibrio energético',
    
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
    'nav.personal': 'Личная Астрология',
    'nav.couples': 'Отношения',
    'nav.spaces': 'Дом и Бизнес',
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
    
    // Sections
    'sections.personal': 'Для Людей',
    'sections.personalDesc': 'Личная астрология, нумерология и жизненное руководство',
    'sections.couples': 'Для Пар',
    'sections.couplesDesc': 'Совместимость отношений во всех астрологических системах',
    'sections.spaces': 'Для Дома и Бизнеса',
    'sections.spacesDesc': 'Васту Шастра и Фэн Шуй для гармоничных пространств',
    
    // Personal Features
    'personal.natal.title': 'Анализ Натальной Карты',
    'personal.natal.desc': 'Глубокие прозрения из Западной, Ведической, Китайской астрологии с подлинными расчётами',
    'personal.numerology.title': 'Полная Нумерология',
    'personal.numerology.desc': 'Анализ жизненного пути, судьбы, душевного порыва и чисел личности',
    'personal.daily.title': 'Ежедневное Руководство',
    'personal.daily.desc': 'Персонализированные ежедневные прозрения с рекомендациями оптимального времени',
    'personal.design.title': 'Дизайн Человека',
    'personal.design.desc': 'Полная карта Дизайна Человека с типом, стратегией и авторитетом',
    
    // Couples Features
    'couples.synastry.title': 'Анализ Синастрии',
    'couples.synastry.desc': 'Глубокий анализ совместимости в Западной и Ведической системах',
    'couples.composite.title': 'Композитные Карты',
    'couples.composite.desc': 'Анализ карты отношений, раскрывающий динамику партнёрства',
    'couples.chinese.title': 'Китайская Совместимость',
    'couples.chinese.desc': 'Совместимость китайского зодиака с анализом элементов и животных',
    'couples.numerology.title': 'Нумерологическая Совместимость',
    'couples.numerology.desc': 'Анализ совместимости чисел жизненного пути и судьбы',
    
    // Spaces Features
    'spaces.vastu.title': 'Васту Шастра',
    'spaces.vastu.desc': 'Древние индийские архитектурные принципы для гармоничных жилых пространств',
    'spaces.fengshui.title': 'Фэн Шуй',
    'spaces.fengshui.desc': 'Китайская геомантия для оптимального потока энергии в доме и офисе',
    'spaces.timing.title': 'Благоприятное Время',
    'spaces.timing.desc': 'Лучшее время для переезда, ремонта или начала новых предприятий',
    'spaces.remedies.title': 'Средства для Пространства',
    'spaces.remedies.desc': 'Рекомендации по цвету, кристаллам и размещению для энергетического баланса',
    
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
    'nav.personal': 'Astrologie Personnelle',
    'nav.couples': 'Relations',
    'nav.spaces': 'Maison et Entreprise',
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
    
    // Sections
    'sections.personal': 'Pour les Individus',
    'sections.personalDesc': 'Astrologie personnelle, numérologie et guidance de vie',
    'sections.couples': 'Pour les Couples',
    'sections.couplesDesc': 'Compatibilité relationnelle à travers tous les systèmes astrologiques',
    'sections.spaces': 'Pour Maison et Entreprise',
    'sections.spacesDesc': 'Vastu Shastra et Feng Shui pour des espaces harmonieux',
    
    // Personal Features
    'personal.natal.title': 'Analyse du Thème Natal',
    'personal.natal.desc': 'Perspectives profondes de l\'astrologie Occidentale, Védique, Chinoise avec calculs authentiques',
    'personal.numerology.title': 'Numérologie Complète',
    'personal.numerology.desc': 'Analyse du chemin de vie, destin, élan de l\'âme et nombres de personnalité',
    'personal.daily.title': 'Guidance Quotidienne',
    'personal.daily.desc': 'Perspectives quotidiennes personnalisées avec recommandations de timing optimal',
    'personal.design.title': 'Design Humain',
    'personal.design.desc': 'Carte complète de Design Humain avec type, stratégie et autorité',
    
    // Couples Features
    'couples.synastry.title': 'Analyse de Synastrie',
    'couples.synastry.desc': 'Analyse approfondie de compatibilité dans les systèmes Occidental et Védique',
    'couples.composite.title': 'Cartes Composites',
    'couples.composite.desc': 'Analyse de carte relationnelle révélant les dynamiques de partenariat',
    'couples.chinese.title': 'Compatibilité Chinoise',
    'couples.chinese.desc': 'Compatibilité du zodiaque chinois avec analyse d\'élément et d\'animal',
    'couples.numerology.title': 'Compatibilité Numérologique',
    'couples.numerology.desc': 'Analyse de compatibilité des nombres de chemin de vie et de destin',
    
    // Spaces Features
    'spaces.vastu.title': 'Vastu Shastra',
    'spaces.vastu.desc': 'Principes architecturaux indiens ancestraux pour espaces de vie harmonieux',
    'spaces.fengshui.title': 'Feng Shui',
    'spaces.fengshui.desc': 'Géomancie chinoise pour flux d\'énergie optimal dans maisons et bureaux',
    'spaces.timing.title': 'Timing Propice',
    'spaces.timing.desc': 'Meilleurs moments pour déménager, rénover ou commencer de nouvelles entreprises',
    'spaces.remedies.title': 'Remèdes d\'Espace',
    'spaces.remedies.desc': 'Recommandations de couleur, cristal et placement pour équilibre énergétique',
    
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