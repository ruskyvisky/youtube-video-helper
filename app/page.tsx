'use client';

import dynamic from 'next/dynamic';

// Import HomeClient with SSR disabled to prevent hydration mismatch
const HomeClient = dynamic(() => import('./HomeClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Yükleniyor...</p>
      </div>
    </div>
  )
});

export default function Home() {
  return <HomeClient />;
}
