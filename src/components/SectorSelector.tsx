import { sectorProfiles, SectorProfile } from "@/lib/sectorRecommendations";

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

const SectorSelector = ({ selected, onSelect }: Props) => (
  <div>
    <label className="block text-sm font-medium text-foreground mb-2">What sector is your app in?</label>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {sectorProfiles.map(s => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-[0.97] flex items-center gap-1.5 ${
            selected === s.id
              ? "bg-brand-gradient text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <span>{s.emoji}</span> {s.name}
        </button>
      ))}
    </div>
  </div>
);

export default SectorSelector;
