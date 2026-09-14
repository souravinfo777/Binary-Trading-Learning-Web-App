import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations, TranslationKey } from "../i18n/translations";
import { BN_CHAPTERS, CATEGORY_TRANSLATIONS } from "../i18n/chapters";
import { BN_MATRIX_FIELDS, EN_MATRIX_FIELDS, MatrixFieldMeta } from "../i18n/matrix";
import { BN_SCENARIOS } from "../i18n/scenarios";
import { Chapter, Scenario } from "../types";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, defaultText?: string) => string;
  isBn: boolean;
  getLocalizedChapter: (chapter: Chapter) => Chapter;
  getLocalizedScenario: (scenario: Scenario) => Scenario;
  getCategoryName: (category: string) => string;
  getMatrixField: (fieldKey: string) => MatrixFieldMeta;
  getDifficultyName: (diff?: string) => string;
  getActionName: (action: string) => string;
  getTierName: (tier: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("otc_app_language");
    if (saved === "bn" || saved === "en") return saved;
    return "bn"; // Default to Bengali or saved preference
  });

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === "bn") {
      document.documentElement.classList.add("lang-bn");
    } else {
      document.documentElement.classList.remove("lang-bn");
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("otc_app_language", lang);
  };

  const toggleLanguage = () => {
    const next = language === "en" ? "bn" : "en";
    setLanguage(next);
  };

  const isBn = language === "bn";

  const t = (key: TranslationKey, defaultText?: string): string => {
    const langDict = translations[language] || translations.en;
    if (langDict[key]) return langDict[key];
    if (translations.en[key]) return translations.en[key];
    return defaultText || String(key);
  };

  const getCategoryName = (category: string): string => {
    if (category === "All") return isBn ? "সকল ক্যাটাগরি (৩০টি অধ্যায়)" : "All Categories (30 Chapters)";
    const entry = CATEGORY_TRANSLATIONS[category];
    if (!entry) return category;
    return isBn ? entry.bn : entry.en;
  };

  const getLocalizedChapter = (chapter: Chapter): Chapter => {
    if (!isBn) return chapter;
    const bnData = BN_CHAPTERS[chapter.id];
    if (!bnData) return chapter;

    return {
      ...chapter,
      title: bnData.title,
      category: bnData.category,
      coreThesis: bnData.coreThesis,
      zeroHypeRule: bnData.zeroHypeRule,
      technicalTheory: bnData.technicalTheory,
      orderFlowMechanics: bnData.orderFlowMechanics,
      strictRules: bnData.strictRules,
      invalidations: bnData.invalidations,
      diagnosticQuestions: bnData.diagnosticQuestions,
    };
  };

  const getLocalizedScenario = (scenario: Scenario): Scenario => {
    if (!isBn) return scenario;
    const bnScenario = BN_SCENARIOS[scenario.scenario_id];
    if (!bnScenario) return scenario;

    return {
      ...scenario,
      topic: bnScenario.topic,
      difficulty: bnScenario.difficulty,
      prompt_question: bnScenario.prompt_question,
      ideal_10_point_analysis: bnScenario.ideal_10_point_analysis,
      resolution_next_candle: {
        ...scenario.resolution_next_candle,
        outcome_explanation: bnScenario.resolution_outcome_explanation,
      },
    };
  };

  const getMatrixField = (fieldKey: string): MatrixFieldMeta => {
    const dict = isBn ? BN_MATRIX_FIELDS : EN_MATRIX_FIELDS;
    if (dict[fieldKey]) return dict[fieldKey];
    return EN_MATRIX_FIELDS[fieldKey] || {
      title: fieldKey,
      subtitle: "",
      placeholder: "",
    };
  };

  const getDifficultyName = (diff?: string): string => {
    if (!diff) return "";
    if (!isBn) return diff;
    switch (diff.toLowerCase()) {
      case "beginner":
        return "প্রাথমিক (Beginner)";
      case "intermediate":
        return "মধ্যবর্তী (Intermediate)";
      case "advanced":
        return "উন্নত (Advanced)";
      case "institutional":
        return "প্রাতিষ্ঠানিক (Institutional)";
      default:
        return diff;
    }
  };

  const getActionName = (action: string): string => {
    if (!isBn) return action;
    switch (action.toUpperCase().replace("_", " ")) {
      case "CALL":
        return "কল / আপ (CALL)";
      case "PUT":
        return "পুট / ডাউন (PUT)";
      case "NO TRADE":
        return "নো-ট্রেড (NO TRADE)";
      default:
        return action;
    }
  };

  const getTierName = (tier: string): string => {
    if (!isBn) return tier;
    switch (tier.toUpperCase()) {
      case "A_PLUS":
      case "A+":
        return "এ+ প্রাতিষ্ঠানিক কনফ্লুয়েন্স (A+ Tier)";
      case "A_TIER":
      case "A":
        return "এ টায়ার — উচ্চ সম্ভাবনা (A Tier)";
      case "B_TIER":
      case "B":
        return "বি টায়ার — মাঝারি এজ (B Tier)";
      case "C_TIER":
      case "C":
        return "সি টায়ার — দুর্বল এজ (C Tier)";
      case "DISQUALIFIED":
        return "ডিসকোয়ালিফাইড (নিয়ম বহির্ভূত)";
      default:
        return tier;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isBn,
        getLocalizedChapter,
        getLocalizedScenario,
        getCategoryName,
        getMatrixField,
        getDifficultyName,
        getActionName,
        getTierName,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
