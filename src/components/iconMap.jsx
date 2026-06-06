import {
  BookOpen,
  Briefcase,
  Car,
  CircleDot,
  Gift,
  HeartPulse,
  Receipt,
  ShoppingBag,
  Store,
  Utensils,
} from 'lucide-react';

const ICONS = {
  'book-open': BookOpen,
  briefcase: Briefcase,
  car: Car,
  'circle-dot': CircleDot,
  gift: Gift,
  'heart-pulse': HeartPulse,
  receipt: Receipt,
  'shopping-bag': ShoppingBag,
  store: Store,
  utensils: Utensils,
};

export default function CategoryIcon({ icon, className = 'h-4 w-4' }) {
  const Icon = ICONS[icon] || CircleDot;
  return <Icon className={className} aria-hidden="true" />;
}
