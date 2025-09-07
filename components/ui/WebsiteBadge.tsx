interface WebsiteBadgeProps {
  href: string;
  src: string;
  alt: string;
  height?: number;
  width?: number;
}

export default function WebsiteBadge({ href, src, alt, height = 54, width }: WebsiteBadgeProps) {
  const imgStyle = {
    height: height ? `${height}px` : undefined,
    width: width ? `${width}px` : undefined,
  };

  return (
    <a
      target="_blank"
      href={href}
      rel="noopener noreferrer"
      className="inline-block transition-opacity hover:opacity-80"
    >
      <img
        src={src}
        alt={alt}
        style={imgStyle}
        className="object-contain"
      />
    </a>
  );
}
