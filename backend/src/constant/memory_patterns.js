export const MEMORY_RULES = [
  {
    field: "answer_length",

    patterns: [
      /trả lời ngắn gọn thôi/i,
      /nói ngắn thôi/i,
      /ngắn gọn thôi/i,
      /đừng dài dòng/i,
    ],

    value: "short",

    template: "Đã ghi nhớ bạn thích câu trả lời ngắn gọn.",
  },
  {
    field: "assistant_name",
    patterns: [
      /.*tên.*trợ lý.*là (.+)/i,
      /.*gọi.*bạn.*là (.+)/i,
      /.*đổi.*tên.*trợ lý.*thành (.+)/i,
      /.*assistant.*name.*is (.+)/i,
    ],
    template: "Đã ghi nhớ tên mà bạn đã đặt cho tôi.",
  },
  {
    field: "answer_length",

    patterns: [/giải thích kỹ hơn/i],

    value: "detailed",

    template: "Đã ghi nhớ bạn thích giải thích chi tiết.",
  },

  {
    field: "tone",

    patterns: [/nói lịch sự hơn/i],

    value: "formal",

    template: "Đã ghi nhớ phong cách trả lời lịch sự.",
  },

  {
    field: "tone",

    patterns: [/nói tự nhiên thôi/i],

    value: "casual",

    template: "Đã ghi nhớ phong cách trả lời tự nhiên.",
  },
  {
    field: "favorite_color",
    patterns: [/(?:tôi thích màu|màu yêu thích của tôi là)\s+(.+)/],
    template: "Đã ghi nhớ màu yêu thích của bạn là {}.",
  },

  {
    field: "favorite_food",
    patterns: [/(?:tôi thích ăn|món yêu thích của tôi là)\s+(.+)/],
    template: "Đã ghi nhớ món ăn yêu thích của bạn là {}.",
  },

  {
    field: "favorite_drink",
    patterns: [/(?:tôi thích uống|đồ uống yêu thích của tôi là)\s+(.+)/],
    template: "Đã ghi nhớ đồ uống yêu thích của bạn là {}.",
  },

  {
    field: "company",
    patterns: [/(?:tôi làm ở|mình làm ở|công ty của tôi là)\s+(.+)/],
    template: "Đã ghi nhớ công ty của bạn là {}.",
  },

  {
    field: "name",
    patterns: [/(?:tôi tên|mình tên|tên tôi là)\s+([^\?]+)$/],
    template: "Đã ghi nhớ tên của bạn là {}.",
  },

  {
    field: "age",
    patterns: [/(?:tôi|mình)\s+(\d+)\s+tuổi/],
    template: "Đã ghi nhớ bạn {} tuổi.",
  },

  {
    field: "hometown",
    patterns: [/(?:tôi quê ở|mình quê ở|quê tôi là|quê tôi ở)\s+(.+)/],
    template: "Đã ghi nhớ quê của bạn là {}.",
  },

  {
    field: "location",
    patterns: [/(?:tôi sống ở|mình sống ở|tôi ở|mình ở)\s+(.+)/],
    template: "Đã ghi nhớ nơi ở của bạn là {}.",
  },

  {
    field: "education",
    patterns: [/(?:tôi học ở|mình học ở|tôi học tại|mình học tại)\s+(.+)/],
    template: "Đã ghi nhớ bạn học tại {}.",
  },

  {
    field: "major",
    patterns: [/(?:tôi học ngành|mình học ngành|ngành của tôi là)\s+(.+)/],
    template: "Đã ghi nhớ ngành học của bạn là {}.",
  },

  {
    field: "occupation",
    patterns: [/(?:tôi làm nghề|mình làm nghề|nghề của tôi là)\s+(.+)/],
    template: "Đã ghi nhớ nghề nghiệp của bạn là {}.",
  },

  {
    field: "hobbies",
    patterns: [/(?:tôi thích|mình thích)\s+([a-zA-ZÀ-ỹ0-9 ]{2,30})$/],
    template: "Đã ghi nhớ sở thích của bạn là {}.",
  },

  /* Additional personalization fields */
  {
    field: "birthday",
    patterns: [
      /(?:sinh nhật(?: của)? tôi là|tôi sinh ngày|mình sinh ngày)\s+(.+)/,
    ],
    template: "Đã ghi nhớ sinh nhật của bạn là {}.",
  },

  {
    field: "relationship_status",
    patterns: [
      /(?:tôi (?:đang|hiện) )?(độc thân|có người yêu|đã có người yêu|đã kết hôn|lấy vợ|lấy chồng)/,
      /(?:mình (?:đang|hiện) )?(độc thân|có người yêu|đã có người yêu|đã kết hôn|lấy vợ|lấy chồng)/,
    ],
    template: "Đã ghi nhớ tình trạng hiện tại của bạn là {}.",
  },

  {
    field: "gender",
    patterns: [
      /(?:tôi là|mình là)\s+(nam|nữ|phi nhị nguyên|không muốn nói)/,
      /giới tính của (?:tôi|mình) là\s+(nam|nữ|phi nhị nguyên|không muốn nói)/,
    ],
    template: "Đã ghi nhớ giới tính của bạn là {}.",
  },

  {
    field: "pet",
    patterns: [
      /(?:tôi nuôi|mình nuôi|tôi có nuôi|mình có nuôi)\s+(.+)/,
      /thú cưng của (?:tôi|mình) là\s+(.+)/,
    ],
    template: "Đã ghi nhớ thú cưng của bạn là {}.",
  },

  {
    field: "goal",
    patterns: [
      /mục tiêu của (?:tôi|mình) là\s+(.+)/,
      /(?:tôi|mình)\s+muốn\s+(.+)/,
    ],
    template: "Đã ghi nhớ mục tiêu của bạn là {}.",
  },
];

export const PROFILE_QUERY_PATTERNS = [
  {
    field: "name",
    patterns: [/.*tên.*tôi.*gì.*/, /.*tôi.*tên.*gì.*/],
    template: "Bạn tên là {}.",
  },
  {
    field: "assistant_name",
    patterns: [
      /.*tên.*trợ lý.*là.*gì.*/i,
      /.*tôi.*đặt.*tên.*bạn.*là.*gì.*/i,
      /.*bạn.*tên.*gì.*/i,
    ],
    template: "Tên của tôi là {}.",
  },
  {
    field: "age",
    patterns: [/.*tôi.*bao nhiêu tuổi.*/, /.*tuổi.*tôi.*bao nhiêu.*/],
    template: "Bạn {} tuổi.",
  },

  {
    field: "hometown",
    patterns: [/.*quê.*tôi.*ở đâu.*/, /.*tôi.*quê.*ở đâu.*/],
    template: "Bạn quê ở {}.",
  },

  {
    field: "location",
    patterns: [/.*tôi.*sống.*ở đâu.*/, /.*tôi.*đang.*ở đâu.*/],
    template: "Bạn đang sống ở {}.",
  },

  {
    field: "education",
    patterns: [/.*tôi.*học.*ở đâu.*/, /.*tôi.*học.*trường.*nào.*/],
    template: "Bạn học tại {}.",
  },

  {
    field: "major",
    patterns: [/.*tôi.*học.*ngành.*gì.*/, /.*ngành.*của.*tôi.*là.*gì.*/],
    template: "Bạn học ngành {}.",
  },

  {
    field: "occupation",
    patterns: [/.*tôi.*làm.*nghề.*gì.*/, /.*nghề.*của.*tôi.*là.*gì.*/],
    template: "Bạn làm {}.",
  },

  {
    field: "company",
    patterns: [/.*tôi.*làm.*ở đâu.*/, /.*tôi.*làm.*công ty.*nào.*/],
    template: "Bạn làm tại {}.",
  },

  {
    field: "favorite_food",
    patterns: [
      /.*món.*ăn.*yêu thích.*của.*tôi.*là.*gì.*/,
      /.*tôi.*thích.*ăn.*gì.*/,
    ],
    template: "Món ăn yêu thích của bạn là {}.",
  },

  {
    field: "hobbies",
    patterns: [/.*tôi.*thích.*gì.*/, /.*sở thích.*của.*tôi.*là.*gì.*/],
    template: "Bạn thích {}.",
  },

  {
    field: "favorite_color",
    patterns: [
      /.*màu.*yêu thích.*của.*tôi.*là.*gì.*/,
      /.*tôi.*thích.*màu.*gì.*/,
    ],
    template: "Màu yêu thích của bạn là {}.",
  },

  {
    field: "favorite_drink",
    patterns: [
      /.*đồ uống.*yêu thích.*của.*tôi.*là.*gì.*/,
      /.*tôi.*thích.*uống.*gì.*/,
    ],
    template: "Đồ uống yêu thích của bạn là {}.",
  },

  {
    field: "relationship_status",
    patterns: [
      /.*tình trạng.*quan hệ.*của.*tôi.*/,
      /.*tôi.*có.*người yêu.*chưa.*/,
    ],
    template: "Bạn hiện {}.",
  },

  {
    field: "birthday",
    patterns: [/.*sinh nhật.*tôi.*khi nào.*/, /.*tôi.*sinh.*ngày.*nào.*/],
    template: "Sinh nhật của bạn là {}.",
  },

  {
    field: "gender",
    patterns: [/.*giới tính.*của.*tôi.*/, /.*tôi.*là.*nam.*hay.*nữ.*/],
    template: "Giới tính của bạn là {}.",
  },

  {
    field: "pet",
    patterns: [
      /.*tôi.*nuôi.*gì.*/,
      /.*tôi.*có.*thú cưng.*không.*/,
      /.*thú cưng.*của.*tôi.*là.*gì.*/,
    ],
    template: "Thú cưng của bạn là {}.",
  },

  {
    field: "goal",
    patterns: [/.*mục tiêu.*của.*tôi.*là.*gì.*/, /.*tôi.*muốn.*gì.*/],
    template: "Mục tiêu của bạn là {}.",
  },
];
