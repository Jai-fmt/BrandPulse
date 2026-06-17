export default function CampaignsLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#111] animate-pulse">
      <div className="px-8 pt-8 pb-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-8 w-40 bg-white/5 rounded-lg mb-2" />
            <div className="h-4 w-64 bg-white/5 rounded-lg" />
          </div>
          <div className="h-9 w-36 bg-emerald-900/30 rounded-lg" />
        </div>
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-5 py-4 h-20" />
          ))}
        </div>
        <div className="flex gap-2 mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-white/5 rounded-lg" />
          ))}
        </div>
      </div>
      <div className="px-8 pb-8 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5 h-20" />
        ))}
      </div>
    </div>
  );
}
