export interface BadgeConfig {
  href: string;
  src: string;
  alt: string;
  height?: number;
  width?: number;
}

export const badges: BadgeConfig[] = [
  {
    href: "https://dang.ai/",
    src: "https://cdn.prod.website-files.com/63d8afd87da01fb58ea3fbcb/6487e2868c6c8f93b4828827_dang-badge.png",
    alt: "Dang.ai",
    height: 40,
    width: 100
  },
  {
    href: "https://startupfa.me/s/ai-miniature?utm_source=aiminiature.net",
    src: "https://startupfa.me/badges/featured-badge-small.webp",
    alt: "Featured on Startup Fame",
    width: 160,
    height:40
  },
  {
    href: "https://twelve.tools",
    src: "https://twelve.tools/badge0-dark.svg",
    alt: "Featured on Twelve Tools",
    width: 150,
    height: 40
  },
  {
   href: "https://fazier.com/launches/aiminiature.net",
   src:"https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&theme=dark",
   width: 120,
   height: 40,
   alt: "Fazier badge"
  },
  {
    href:"https://magicbox.tools",
    src: "https://magicbox.tools/badge-dark.svg",
    alt: "Featured on MagicBox.tools",
    width: 120,
    height: 54
  },
  {
    href: "https://turbo0.com/item/ai-miniature",
    alt: "Listed on Turbo0",
    src: "https://img.turbo0.com/badge-listed-dark.svg",
    height: 54,
    width: 120
  },
  {
    href: "https://indievoice.app",
    src: "https://1f08bbd99d1a620c734d44a7ea6c9651.cdn.bubble.io/f1732389027701x897901387835433300/find_us.png",
    alt: "IndieVoice Embed Badge",
    width: 120, 
    height: 50 
  }
];
