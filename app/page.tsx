'use client';

import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Here you would typically send the email to your backend
      console.log('Email submitted:', email);
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1D1F21] px-4 font-mono">
      <main className="flex flex-col items-center text-center">
        <h1 className="mb-4 text-6xl font-bold text-[#C5C8C6] md:text-8xl">
          <span className="text-[#81A2BE]">&gt;</span>
          regrada
          <span className="animate-blink text-[#81A2BE]">_</span>
        </h1>

        <p className="mb-8 text-lg text-[#C5C8C6]/90 md:text-xl">
          CI for AI behavior — catch regressions before they ship.
        </p>

        <div className="mb-12">
          <p className="text-xl text-[#969896] uppercase tracking-widest md:text-2xl">
            Coming Soon
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@email.com"
              required
              className="flex-1 border border-[#373B41] bg-[#282A2E] px-4 py-3 text-[#C5C8C6] placeholder-[#707880] focus:border-[#81A2BE] focus:outline-none focus:ring-1 focus:ring-[#81A2BE]"
            />
            <button
              type="submit"
              className="border border-[#81A2BE] bg-[#81A2BE]/10 px-6 py-3 font-semibold text-[#81A2BE] transition-all hover:bg-[#81A2BE] hover:text-[#1D1F21]"
            >
              Notify Me
            </button>
          </div>
          {isSubmitted && (
            <p className="mt-4 text-sm text-[#B5BD68]">
              ✓ Thanks! We&apos;ll keep you updated.
            </p>
          )}
        </form>
      </main>
    </div>
  );
}
