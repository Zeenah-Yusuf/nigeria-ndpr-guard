import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useLanguage } from '../../contexts/LanguageContext';
import type { Language } from '../../types';

const languageOptions: { value: Language; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'ha', label: 'Hausa', flag: '🇳🇬' },
  { value: 'ig', label: 'Igbo', flag: '🇳🇬' },
  { value: 'yo', label: 'Yorùbá', flag: '🇳🇬' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languageOptions.find(opt => opt.value === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800">
          <Languages className="w-4 h-4" />
          <span className="hidden sm:inline">{currentLanguage?.label}</span>
          <span className="sm:hidden">{currentLanguage?.flag}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languageOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setLanguage(option.value)}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">{option.flag}</span>
              <span>{option.label}</span>
            </span>
            {language === option.value && (
              <span className="text-primary-600">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}