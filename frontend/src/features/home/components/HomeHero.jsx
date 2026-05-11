import { FaUserAstronaut } from "react-icons/fa6";

export function HomeHero({
  assistantLabel,
  avatarSrc,
  recording,
  speaking,
  busy,
}) {
  return (
    <div className="flex flex-col items-center text-center gap-2 mb-4">
      <div className="relative">
        <div
          className={`w-36 h-36 sm:w-44 sm:h-44 rounded-[2rem] overflow-hidden shadow-2xl ring-2 transition-all duration-300 ${
            recording
              ? "ring-red-400 shadow-red-500/20"
              : speaking
                ? "ring-sky-400 shadow-sky-500/25"
                : "ring-white/20"
          }`}
        >
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={assistantLabel}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-sky-600 to-indigo-900 flex items-center justify-center">
              <FaUserAstronaut className="w-16 h-16 text-white/90" />
            </div>
          )}
        </div>
        {(recording || speaking || busy) && (
          <span
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[11px] px-3 py-1 rounded-full bg-black/70 border border-white/15 whitespace-nowrap"
            aria-live="polite"
          >
            {recording
              ? "Đang nghe…"
              : speaking
                ? "Trợ lý đang nói…"
                : "Đang xử lý…"}
          </span>
        )}
      </div>
      <h1 className="text-xl sm:text-2xl font-semibold">{assistantLabel}</h1>
      <p className="text-white/55 text-sm max-w-md">
        Trò chuyện bằng chữ hoặc giọng nói. Hệ thống dùng API backend: chat,
        voice-chat và TTS.
      </p>
    </div>
  );
}
