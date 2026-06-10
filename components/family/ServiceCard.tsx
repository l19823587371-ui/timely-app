"use client";

interface ServiceCardProps {
  type: string;
  icon: string;
  label: string;
  description: string;
  price: number;
  selected?: boolean;
  onSelect: () => void;
}

export default function ServiceCard({
  type,
  icon,
  label,
  description,
  price,
  selected,
  onSelect,
}: ServiceCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative bg-card rounded-family p-4 cursor-pointer border-2 transition-all active:scale-[0.98] ${
        selected ? "border-primary shadow-md shadow-primary/10" : "border-border hover:border-primary/30"
      }`}
    >
      {/* Checkmark */}
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-bg-warm flex items-center justify-center text-2xl flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-family-h2 text-text-primary">{label}</h3>
          <p className="mt-1 font-family-caption text-text-secondary">{description}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-family-h2 text-primary">¥{price}</span>
            <span className="font-family-caption text-text-disabled">/次</span>
          </div>
        </div>
      </div>
    </div>
  );
}
