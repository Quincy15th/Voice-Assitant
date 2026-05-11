export function normalizeText(text) {
  text = (text ?? "").toString().toLowerCase().trim();
  // Preserve Vietnamese diacritics reliably (some STT outputs decomposed Unicode)
  text = text.normalize("NFC");

  // REMOVE / NORMALIZE PUNCTUATION
  text = text.replace(/[“”"'`]/g, "");
  text = text.replace(/[?!.,;:]+/g, " ");
  text = text.replace(/[-_/]+/g, " ");

  // COMMON STT REPLACEMENTS
  const replacements = {
    // question
    lazi: "là gì",
    lazy: "là gì",
    "la gi": "là gì",

    // calendar
    "hỷ lịch": "hủy lịch",
    "hỉ lịch": "hủy lịch",
    "huy lich": "hủy lịch",

    // time
    "mấy dờ": "mấy giờ",
    "may gio": "mấy giờ",
    "hom nay": "hôm nay",
    "ngay mai": "ngày mai",

    // apps / brands
    "du túp": "youtube",
    "giu tu be": "youtube",
    "face book": "facebook",
    "gu gồ": "google",
    "cờ rôm": "chrome",

    // tech
    "block chain": "blockchain",
    "git hub": "github",
    "post gre": "postgres",
  };

  for (const [wrong, correct] of Object.entries(replacements)) {
    text = text.replaceAll(wrong, correct);
  }

  // REMOVE FILLER / NOISE WORDS
  const fillerPatterns = [
    // Only remove elongated interjections (avoid deleting legitimate Vietnamese tokens in noisy STT)
    /\bờ{2,}\b/g,
    /\bà{2,}\b/g,
    /\bơ{2,}\b/g,
    /\bum+\b/g,
    /\buh+\b/g,
    /\bờm{2,}\b/g,
  ];

  for (const pattern of fillerPatterns) {
    text = text.replace(pattern, " ");
  }

  // FIX DUPLICATE SPACES
  text = text.replace(/\s+/g, " ").trim();

  return text;
}
