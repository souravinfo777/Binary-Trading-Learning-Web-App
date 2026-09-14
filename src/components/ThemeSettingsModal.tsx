import React from "react";
import { Check, Palette, Sparkles, X, RotateCcw, ShieldCheck, SunMedium } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BLACK_THEMES, BlackTheme, saveBlackTheme, applyThemeToDocument } from "../theme/themes";

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: BlackTheme;
  onSelectTheme: (theme: BlackTheme) => void;
  isBn: boolean;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  activeTheme,
  onSelectTheme,
  isBn,
}) => {
  if (!isOpen) return null;

  const handleSelect = (theme: BlackTheme) => {
    onSelectTheme(theme);
    saveBlackTheme(theme.id);
    applyThemeToDocument(theme);
  };

  const handleResetDefault = () => {
    const defaultTheme = BLACK_THEMES[0]; // oled-pure
    handleSelect(defaultTheme);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          style={{
            backgroundColor: activeTheme.bgSurface,
            borderColor: activeTheme.borderColor,
          }}
          className="relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div
            style={{
              borderColor: activeTheme.borderColor,
              background: `linear-gradient(to right, ${activeTheme.bgCard}, ${activeTheme.bgSurface})`,
            }}
            className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b shrink-0"
          >
            <div className="flex items-center gap-2.5">
              <div
                style={{
                  backgroundColor: activeTheme.badgeBg,
                  borderColor: activeTheme.borderColor,
                  color: activeTheme.accentColor,
                }}
                className="w-9 h-9 rounded-xl border flex items-center justify-center shadow-inner"
              >
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {isBn ? "থিম ও ডিসপ্লে সেটিংস" : "Theme & Display Settings"}
                  </h2>
                  <span
                    style={{
                      backgroundColor: activeTheme.badgeBg,
                      color: activeTheme.accentColor,
                      borderColor: activeTheme.borderColor,
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase"
                  >
                    10 BLACK THEMES
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {isBn
                    ? "পছন্দের ডার্ক থিম বেছে নিন — স্বয়ংক্রিয়ভাবে ডিফল্ট হিসেবে সেভ থাকবে"
                    : "Select your preferred black theme — saved automatically as your permanent default"}
                </p>
              </div>
            </div>

            <button
              type="button"
              id="close-theme-settings-modal-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title={isBn ? "বন্ধ করুন" : "Close"}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Theme Highlight Banner */}
          <div
            style={{
              backgroundColor: activeTheme.bgCard,
              borderColor: activeTheme.borderColor,
            }}
            className="px-4 sm:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-slate-400 font-mono">
                {isBn ? "বর্তমান থিম:" : "ACTIVE THEME:"}
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  style={{ backgroundColor: activeTheme.accentColor }}
                  className="w-2.5 h-2.5 rounded-full shadow-sm animate-pulse"
                />
                <span className="font-bold text-white font-mono text-xs sm:text-sm">
                  {isBn ? activeTheme.nameBn : activeTheme.nameEn}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="reset-default-theme-btn"
                onClick={handleResetDefault}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-300 hover:text-white bg-black/40 hover:bg-black/70 border border-white/10 transition-all cursor-pointer"
                title={isBn ? "ডিফল্ট ওলেড থিমে রিসেট করুন" : "Reset to Default OLED"}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isBn ? "ডিফল্ট ওলেড" : "Reset OLED"}</span>
              </button>
            </div>
          </div>

          {/* Theme List: 10 Unique Black Themes */}
          <div className="flex-1 overflow-y-auto no-scrollbar md:custom-scrollbar p-3.5 sm:p-5 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {BLACK_THEMES.map((theme) => {
                const isSelected = theme.id === activeTheme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    id={`theme-select-btn-${theme.id}`}
                    onClick={() => handleSelect(theme)}
                    style={{
                      backgroundColor: theme.bgCard,
                      borderColor: isSelected ? theme.accentColor : theme.borderColor,
                      boxShadow: isSelected ? `0 0 16px -2px ${theme.glowColor}` : "none",
                    }}
                    className={`relative flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer group hover:scale-[1.01] ${
                      isSelected
                        ? "ring-1 ring-offset-0"
                        : "hover:border-white/30 hover:bg-opacity-90"
                    }`}
                  >
                    {/* Top Row: Swatches + Theme Name */}
                    <div className="flex items-center justify-between w-full gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        {/* 3 Swatch Dots */}
                        <div
                          style={{ borderColor: theme.borderColor }}
                          className="flex items-center -space-x-1 p-1 rounded-lg bg-black/70 border shrink-0"
                        >
                          <span
                            style={{ backgroundColor: theme.previewColors.bg }}
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            title="Base BG"
                          />
                          <span
                            style={{ backgroundColor: theme.previewColors.surface }}
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            title="Card Surface"
                          />
                          <span
                            style={{ backgroundColor: theme.previewColors.accent }}
                            className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                            title="Accent"
                          />
                        </div>

                        <div className="min-w-0">
                          <h3
                            style={{
                              color: isSelected ? theme.accentColor : "#ffffff",
                            }}
                            className="text-xs sm:text-sm font-bold font-mono truncate"
                          >
                            {isBn ? theme.nameBn : theme.nameEn}
                          </h3>
                        </div>
                      </div>

                      {/* Active Status Badge */}
                      <div className="shrink-0">
                        {isSelected ? (
                          <span
                            style={{
                              backgroundColor: theme.badgeBg,
                              color: theme.badgeText,
                              borderColor: theme.borderColor,
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>{isBn ? "ডিফল্ট" : "ACTIVE"}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors px-1.5 py-0.5 rounded bg-black/40 border border-white/5">
                            {isBn ? "নির্বাচন" : "SELECT"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tagline / Subtitle */}
                    <p className="text-[11px] text-slate-400 line-clamp-1 leading-relaxed">
                      {isBn ? theme.tagBn : theme.tagEn}
                    </p>

                    {/* Color Code Bar */}
                    <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span className="truncate">HEX: {theme.bgPrimary}</span>
                      <span
                        style={{ color: theme.accentColor }}
                        className="font-semibold uppercase tracking-wider"
                      >
                        {theme.accentColor}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              borderColor: activeTheme.borderColor,
              backgroundColor: activeTheme.bgCard,
            }}
            className="px-4 sm:px-6 py-3 border-t flex items-center justify-between gap-3 shrink-0"
          >
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-[11px] sm:text-xs">
                {isBn
                  ? "নির্বাচিত থিম ব্রাউজারে স্বয়ংক্রিয়ভাবে সংরক্ষিত হয়েছে।"
                  : "Chosen theme is persisted in your browser's local storage."}
              </span>
            </div>

            <button
              type="button"
              id="confirm-theme-selection-btn"
              onClick={onClose}
              style={{
                backgroundColor: activeTheme.accentColor,
                color: "#000000",
              }}
              className="px-4 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer hover:opacity-90 shadow-md"
            >
              {isBn ? "সম্পন্ন" : "Done"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
