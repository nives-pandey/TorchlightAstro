import { getTranslationStats, useTranslation } from "@/lib/i18n";

export function TranslationDebug() {
  const { language, setLanguage } = useTranslation();
  const stats = getTranslationStats();

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg border border-purple-400/30 text-xs max-w-xs">
      <h4 className="font-bold mb-2">Translation Stats</h4>
      {Object.entries(stats).map(([lang, stat]) => (
        <div key={lang} className={`mb-1 ${language === lang ? 'text-purple-400' : ''}`}>
          <strong>{lang.toUpperCase()}:</strong> {stat.keys} keys, {stat.words} words
        </div>
      ))}
      <div className="mt-2 text-center">
        <button 
          onClick={() => setLanguage('en')} 
          className={`mx-1 px-2 py-1 rounded ${language === 'en' ? 'bg-purple-400 text-black' : 'bg-gray-600'}`}
        >
          EN
        </button>
        <button 
          onClick={() => setLanguage('es')} 
          className={`mx-1 px-2 py-1 rounded ${language === 'es' ? 'bg-purple-400 text-black' : 'bg-gray-600'}`}
        >
          ES
        </button>
        <button 
          onClick={() => setLanguage('ru')} 
          className={`mx-1 px-2 py-1 rounded ${language === 'ru' ? 'bg-purple-400 text-black' : 'bg-gray-600'}`}
        >
          RU
        </button>
        <button 
          onClick={() => setLanguage('fr')} 
          className={`mx-1 px-2 py-1 rounded ${language === 'fr' ? 'bg-purple-400 text-black' : 'bg-gray-600'}`}
        >
          FR
        </button>
      </div>
    </div>
  );
}