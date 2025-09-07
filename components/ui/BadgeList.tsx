import WebsiteBadge from './WebsiteBadge';

interface BadgeData {
  href: string;
  src: string;
  alt: string;
  height?: number;
  width?: number;
}

interface BadgeListProps {
  badges: BadgeData[];
  className?: string;
}

export default function BadgeList({ badges, className = "" }: BadgeListProps) {
  if (badges.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-4 items-center ${className}`}>
      {badges.map((badge, index) => (
        <WebsiteBadge
          key={index}
          href={badge.href}
          src={badge.src}
          alt={badge.alt}
          height={badge.height}
          width={badge.width}
        />
      ))}
    </div>
  );
}
