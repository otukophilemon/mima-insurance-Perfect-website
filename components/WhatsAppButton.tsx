// components/WhatsAppButton.tsx
'use client';

import { MessageCircle } from 'lucide-react';
import { COMPANY } from '@/data/company';

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${COMPANY.whatsapp.replace('+', '')}?text=${encodeURIComponent(
    "Hi MIMA Insurance, I'd like to know more about your services."
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with MIMA Insurance on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 rounded-full bg-green-500 hover:bg-green-600 text-white pl-4 pr-5 py-3 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
    >
      {/* Pulse ring */}
      <span className="absolute -inset-1 rounded-full bg-green-500 opacity-30 animate-ping" />

      {/* Icon */}
      <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
        <MessageCircle size={20} strokeWidth={2.5} />
      </span>

      {/* Label */}
      <span className="relative font-semibold text-sm whitespace-nowrap">
        Chat with us
      </span>
    </a>
  );
}