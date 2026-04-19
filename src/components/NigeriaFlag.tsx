import ngFlag from '@/assets/ng-flag.png';

interface NigeriaFlagProps {
  className?: string;
}

export function NigeriaFlag({ className = "w-5 h-4" }: NigeriaFlagProps) {
  return (
    <img 
      src={ngFlag} 
      alt="Nigeria flag" 
      className={`inline-block ${className}`}
      style={{ verticalAlign: 'middle' }}
    />
  );
}