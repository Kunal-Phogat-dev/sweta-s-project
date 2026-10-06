export default function Loading() {
  return (
    <div className="min-h-screen bg-[#fafaf9] flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 bg-pink-200 rounded-full animate-ping opacity-75"></div>
          <div className="relative w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45 animate-pulse"></div>
          </div>
        </div>
        <div className="text-gray-400 font-bold tracking-widest text-xs uppercase animate-pulse">
          Loading
        </div>
      </div>
    </div>
  );
}
