import { useLanguage } from "@/contexts/LanguageContext";
import { sectorProfiles } from "@/lib/sectorRecommendations";
import { Wallet, HeartPulse, ShoppingCart, GraduationCap, Sprout, Building2, Share2, Briefcase } from "lucide-react";

const sectorIcons: Record<string, React.ElementType> = {
  fintech: Wallet,
  healthtech: HeartPulse,
  ecommerce: ShoppingCart,
  edtech: GraduationCap,
  agritech: Sprout,
  enterprise: Building2,
  social_media: Share2,
};

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

const SectorSelector = ({ selected, onSelect }: Props) => {
  const { t } = useLanguage();

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-3">
        {t('sector.label')}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {sectorProfiles.map(s => {
          const Icon = sectorIcons[s.id] || Briefcase;
          const isSelected = selected === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                isSelected
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 border border-transparent hover:border-border"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`} />
              <span>{s.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SectorSelector;