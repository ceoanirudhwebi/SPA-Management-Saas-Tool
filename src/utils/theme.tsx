import React from 'react';
import { ThemeAccent, BrandIcon } from '../types';
import {
  Sparkles,
  Flower2,
  Feather,
  Heart,
  Sun,
  Gem,
  Leaf,
  Droplet,
  Moon,
  Flame,
  CircleDot
} from 'lucide-react';

export interface ThemeColorStyles {
  name: string;
  primaryBg: string;
  primaryHover: string;
  primaryText: string;
  primaryBorder: string;
  lightBg: string;
  accentText: string;
  accentBorder: string;
  glow: string;
  badge: string;
}

export const THEME_PALETTES: Record<ThemeAccent, ThemeColorStyles> = {
  amber: {
    name: 'Gold Sanctuary (Ayurvedic & Warm Amber)',
    primaryBg: 'bg-amber-600',
    primaryHover: 'hover:bg-amber-500',
    primaryText: 'text-stone-950',
    primaryBorder: 'border-amber-500/40',
    lightBg: 'bg-amber-500/10',
    accentText: 'text-amber-300',
    accentBorder: 'border-amber-500/30',
    glow: 'shadow-amber-500/10',
    badge: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  emerald: {
    name: 'Botanical Jade (Herbal & Holistic)',
    primaryBg: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-500',
    primaryText: 'text-stone-950',
    primaryBorder: 'border-emerald-500/40',
    lightBg: 'bg-emerald-500/10',
    accentText: 'text-emerald-300',
    accentBorder: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/10',
    badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  },
  rose: {
    name: 'Blush Lotus (Luxury Salon & Aesthetics)',
    primaryBg: 'bg-rose-600',
    primaryHover: 'hover:bg-rose-500',
    primaryText: 'text-white',
    primaryBorder: 'border-rose-500/40',
    lightBg: 'bg-rose-500/10',
    accentText: 'text-rose-300',
    accentBorder: 'border-rose-500/30',
    glow: 'shadow-rose-500/10',
    badge: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  },
  sapphire: {
    name: 'Serene Indigo (Medical & Aesthetic Clinic)',
    primaryBg: 'bg-indigo-600',
    primaryHover: 'hover:bg-indigo-500',
    primaryText: 'text-white',
    primaryBorder: 'border-indigo-500/40',
    lightBg: 'bg-indigo-500/10',
    accentText: 'text-indigo-300',
    accentBorder: 'border-indigo-500/30',
    glow: 'shadow-indigo-500/10',
    badge: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
  },
  slate: {
    name: 'Obsidian Minimalist (Modern Monochrome)',
    primaryBg: 'bg-stone-200',
    primaryHover: 'hover:bg-white',
    primaryText: 'text-stone-950',
    primaryBorder: 'border-stone-400',
    lightBg: 'bg-stone-800/60',
    accentText: 'text-stone-100',
    accentBorder: 'border-stone-600',
    glow: 'shadow-stone-500/10',
    badge: 'text-stone-300 bg-stone-800 border-stone-600',
  },
  teal: {
    name: 'Ocean Mineral (Thalasso & Hydro Sanctuary)',
    primaryBg: 'bg-teal-600',
    primaryHover: 'hover:bg-teal-500',
    primaryText: 'text-stone-950',
    primaryBorder: 'border-teal-500/40',
    lightBg: 'bg-teal-500/10',
    accentText: 'text-teal-300',
    accentBorder: 'border-teal-500/30',
    glow: 'shadow-teal-500/10',
    badge: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
  },
  purple: {
    name: 'Amethyst Ritual (Aroma & Royal Rejuvenation)',
    primaryBg: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-500',
    primaryText: 'text-white',
    primaryBorder: 'border-purple-500/40',
    lightBg: 'bg-purple-500/10',
    accentText: 'text-purple-300',
    accentBorder: 'border-purple-500/30',
    glow: 'shadow-purple-500/10',
    badge: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  },
};

export const renderBrandIcon = (iconName: BrandIcon, className: string = 'h-4 w-4') => {
  switch (iconName) {
    case 'lotus':
    case 'flower':
      return <Flower2 className={className} />;
    case 'feather':
      return <Feather className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'sun':
      return <Sun className={className} />;
    case 'gem':
      return <Gem className={className} />;
    case 'leaf':
      return <Leaf className={className} />;
    case 'droplet':
      return <Droplet className={className} />;
    case 'moon':
      return <Moon className={className} />;
    case 'sparkles':
    default:
      return <Sparkles className={className} />;
  }
};
