export type WordCard = {
  word: string;
  emoji: string;
  card: string;
};

export type Mission = {
  id: number;
  chapter: number;
  chapterName: string;
  chapterIcon: string;
  name: string;
  theme: string;
  icon: string;
  hint: string;
  size: number;
  wordCards: WordCard[];
  targetTime: number;
  color: string;
  colorEnd: string;
};

export function missionWords(m: Mission): string[] {
  return m.wordCards.map((w) => w.word);
}

export const CHAPTER_COLORS: Record<number, [string, string]> = {
  1: ["#6366f1", "#818cf8"],
  2: ["#f97316", "#fb923c"],
  3: ["#0ea5e9", "#38bdf8"],
  4: ["#ec4899", "#f472b6"],
  5: ["#10b981", "#34d399"],
  6: ["#ef4444", "#f87171"],
  7: ["#fbbf24", "#fcd34d"],
  8: ["#8b5cf6", "#a78bfa"],
  9: ["#06b6d4", "#22d3ee"],
  10: ["#64748b", "#94a3b8"],
};

export const MISSIONS: Mission[] = [
  // ─── CHAPTER 1: MORNING ROUTINE ───────────────────────────────────────────
  {
    id: 1, chapter: 1, chapterName: "Morning Routine", chapterIcon: "sunny",
    name: "Wake Up!", theme: "Morning", icon: "alarm", hint: "Start your day right",
    size: 8, targetTime: 90, color: "#6366f1", colorEnd: "#818cf8",
    wordCards: [
      { word: "ALARM", emoji: "⏰", card: "An alarm wakes you up so you're never late for school or work!" },
      { word: "BED", emoji: "🛏️", card: "Your bed is where you sleep and recharge your brain every night." },
      { word: "SLEEP", emoji: "😴", card: "Sleep helps your brain grow and your body stay healthy — aim for 8 hours!" },
      { word: "DREAM", emoji: "💭", card: "Dreams happen while you sleep. Your brain processes the day's events in stories." },
      { word: "PILLOW", emoji: "🪣", card: "A pillow supports your head and neck while you sleep for a comfy rest." },
      { word: "YAWN", emoji: "🥱", card: "Yawning is your body's way of saying it needs more oxygen to wake up fully." },
    ],
  },
  {
    id: 2, chapter: 1, chapterName: "Morning Routine", chapterIcon: "sunny",
    name: "Get Ready", theme: "Hygiene", icon: "water", hint: "Clean and fresh",
    size: 8, targetTime: 90, color: "#6366f1", colorEnd: "#818cf8",
    wordCards: [
      { word: "BRUSH", emoji: "🪥", card: "Brushing your teeth twice a day keeps cavities away and your smile bright!" },
      { word: "SOAP", emoji: "🧼", card: "Soap removes germs from your hands — wash for 20 seconds every time." },
      { word: "TOWEL", emoji: "🏖️", card: "A towel dries your skin after washing. Always use your own to stay hygienic." },
      { word: "COMB", emoji: "🪮", card: "Combing your hair keeps it neat and untangled — great for starting the day." },
      { word: "MIRROR", emoji: "🪞", card: "A mirror shows your reflection so you can check if you look your best." },
      { word: "WASH", emoji: "🚿", card: "Washing your face in the morning removes oils and wakes up your skin." },
    ],
  },
  {
    id: 3, chapter: 1, chapterName: "Morning Routine", chapterIcon: "sunny",
    name: "Breakfast Time", theme: "Food", icon: "restaurant", hint: "Fuel for the day",
    size: 8, targetTime: 100, color: "#6366f1", colorEnd: "#818cf8",
    wordCards: [
      { word: "TOAST", emoji: "🍞", card: "Toast gives you carbohydrates — quick energy to power your morning brain!" },
      { word: "EGGS", emoji: "🥚", card: "Eggs are packed with protein that builds your muscles and keeps you full longer." },
      { word: "MILK", emoji: "🥛", card: "Milk has calcium that makes your bones strong. Kids need it every day!" },
      { word: "JUICE", emoji: "🍊", card: "Fruit juice gives you vitamin C which helps your body fight off colds." },
      { word: "CEREAL", emoji: "🥣", card: "Cereal with milk is a fast breakfast that gives you energy for school." },
      { word: "HONEY", emoji: "🍯", card: "Honey is nature's sweetener made by bees — it also helps soothe a sore throat." },
    ],
  },
  {
    id: 4, chapter: 1, chapterName: "Morning Routine", chapterIcon: "sunny",
    name: "Dress Up", theme: "Clothing", icon: "shirt", hint: "Look your best",
    size: 8, targetTime: 90, color: "#6366f1", colorEnd: "#818cf8",
    wordCards: [
      { word: "SHIRT", emoji: "👕", card: "A shirt covers your upper body and is one of the most common clothes worn worldwide." },
      { word: "SOCKS", emoji: "🧦", card: "Socks protect your feet from blisters and keep them warm inside your shoes." },
      { word: "SHOES", emoji: "👟", card: "Shoes protect your feet from hard ground and sharp objects outside." },
      { word: "BELT", emoji: "👗", card: "A belt goes around your waist to keep your trousers or skirt in place." },
      { word: "JACKET", emoji: "🧥", card: "A jacket keeps you warm when it's cold outside — always check the weather first!" },
      { word: "PANTS", emoji: "👖", card: "Pants cover your legs and come in many styles for different occasions." },
    ],
  },
  {
    id: 5, chapter: 1, chapterName: "Morning Routine", chapterIcon: "sunny",
    name: "Head Out", theme: "Essentials", icon: "walk", hint: "Don't forget anything",
    size: 8, targetTime: 90, color: "#6366f1", colorEnd: "#818cf8",
    wordCards: [
      { word: "BAG", emoji: "🎒", card: "Your bag carries everything you need for the day — books, lunch, and more." },
      { word: "KEYS", emoji: "🔑", card: "Keys lock and unlock doors to keep your home safe when you're away." },
      { word: "PHONE", emoji: "📱", card: "A phone lets you call family in emergencies and stay connected to the world." },
      { word: "WATCH", emoji: "⌚", card: "A watch tells you the time so you can be punctual and never miss anything." },
      { word: "WALLET", emoji: "👛", card: "A wallet keeps your money and important cards safe in one place." },
      { word: "DOOR", emoji: "🚪", card: "Always close and lock your door when leaving — it's your home's first line of security." },
    ],
  },

  // ─── CHAPTER 2: KITCHEN ───────────────────────────────────────────────────
  {
    id: 6, chapter: 2, chapterName: "Kitchen", chapterIcon: "restaurant",
    name: "Cooking Tools", theme: "Kitchen", icon: "flame", hint: "Tools of the chef",
    size: 8, targetTime: 100, color: "#f97316", colorEnd: "#fb923c",
    wordCards: [
      { word: "PAN", emoji: "🍳", card: "A pan is used on a stove to fry or sauté food using heat and oil." },
      { word: "KNIFE", emoji: "🔪", card: "A knife cuts and chops food — always be careful and ask an adult for help!" },
      { word: "SPOON", emoji: "🥄", card: "A spoon scoops liquids and soft foods — perfect for soup or cereal." },
      { word: "FORK", emoji: "🍴", card: "A fork stabs and holds food while you eat. It was invented over 1000 years ago!" },
      { word: "BOWL", emoji: "🥣", card: "A bowl holds food with liquid like soup, cereal, or salad — it has no handle." },
      { word: "WHISK", emoji: "🥚", card: "A whisk mixes ingredients fast by spinning in circles — great for eggs or cream." },
    ],
  },
  {
    id: 7, chapter: 2, chapterName: "Kitchen", chapterIcon: "restaurant",
    name: "Vegetables", theme: "Nutrition", icon: "nutrition", hint: "Eat your greens",
    size: 9, targetTime: 120, color: "#f97316", colorEnd: "#fb923c",
    wordCards: [
      { word: "ONION", emoji: "🧅", card: "Onions add flavour to meals and make your eyes water when you cut them — that's the gas they release!" },
      { word: "POTATO", emoji: "🥔", card: "Potatoes are full of energy-giving carbs. You can bake, boil, or fry them!" },
      { word: "CARROT", emoji: "🥕", card: "Carrots contain beta-carotene which helps keep your eyes healthy and sharp." },
      { word: "TOMATO", emoji: "🍅", card: "Tomatoes are fruits used as vegetables — they contain lycopene that protects your heart." },
      { word: "CORN", emoji: "🌽", card: "Corn grows on a cob and is sweet — it's also used to make popcorn!" },
      { word: "PEPPER", emoji: "🫑", card: "Peppers come in red, green, and yellow — the colour shows how ripe they are." },
    ],
  },
  {
    id: 8, chapter: 2, chapterName: "Kitchen", chapterIcon: "restaurant",
    name: "Fruits", theme: "Nutrition", icon: "nutrition", hint: "Sweet and healthy",
    size: 9, targetTime: 120, color: "#f97316", colorEnd: "#fb923c",
    wordCards: [
      { word: "APPLE", emoji: "🍎", card: "Apples contain fibre that helps your digestion — that's why they say an apple a day!" },
      { word: "MANGO", emoji: "🥭", card: "Mangoes are tropical fruits packed with vitamin A for healthy skin and eyes." },
      { word: "BANANA", emoji: "🍌", card: "Bananas give you quick energy and potassium that prevents muscle cramps." },
      { word: "GRAPE", emoji: "🍇", card: "Grapes grow in clusters and are full of antioxidants that protect your cells." },
      { word: "LEMON", emoji: "🍋", card: "Lemons are sour because of their citric acid — they're rich in vitamin C." },
      { word: "ORANGE", emoji: "🍊", card: "Oranges are juicy fruits with lots of vitamin C to boost your immune system." },
    ],
  },
  {
    id: 9, chapter: 2, chapterName: "Kitchen", chapterIcon: "restaurant",
    name: "Tastes", theme: "Senses", icon: "happy", hint: "What your tongue feels",
    size: 8, targetTime: 100, color: "#f97316", colorEnd: "#fb923c",
    wordCards: [
      { word: "SWEET", emoji: "🍬", card: "Sweet taste comes from sugar or natural sugars in fruits — it's one of 5 basic tastes." },
      { word: "SOUR", emoji: "🍋", card: "Sour foods like lemons contain acids. Your mouth puckers when you taste them!" },
      { word: "SALTY", emoji: "🧂", card: "Salt brings out the flavour of food — but too much is unhealthy for your heart." },
      { word: "BITTER", emoji: "☕", card: "Bitter taste warns your body about possibly harmful substances — like coffee or dark chocolate." },
      { word: "SPICY", emoji: "🌶️", card: "Spicy foods contain capsaicin which tricks your tongue into feeling heat — not actual temperature!" },
      { word: "TANGY", emoji: "🍊", card: "Tangy is a mix of sweet and sour — like orange juice or vinegar-based sauces." },
    ],
  },
  {
    id: 10, chapter: 2, chapterName: "Kitchen", chapterIcon: "restaurant",
    name: "Drinks", theme: "Hydration", icon: "water", hint: "Stay hydrated",
    size: 8, targetTime: 90, color: "#f97316", colorEnd: "#fb923c",
    wordCards: [
      { word: "WATER", emoji: "💧", card: "Water is essential for life — your body is 60% water, so drink 8 glasses a day!" },
      { word: "MILK", emoji: "🥛", card: "Milk builds strong bones and teeth — it's one of the best sources of calcium." },
      { word: "JUICE", emoji: "🥤", card: "Freshly squeezed juice gives vitamins but whole fruits are even healthier." },
      { word: "TEA", emoji: "🍵", card: "Tea is made from leaves soaked in hot water — green tea has health benefits." },
      { word: "COFFEE", emoji: "☕", card: "Coffee is a drink for adults — it contains caffeine that keeps people alert." },
      { word: "SODA", emoji: "🥤", card: "Soda is fizzy because of dissolved carbon dioxide gas — but it has lots of sugar!" },
    ],
  },

  // ─── CHAPTER 3: SCHOOL ────────────────────────────────────────────────────
  {
    id: 11, chapter: 3, chapterName: "School", chapterIcon: "school",
    name: "Classroom", theme: "Learning", icon: "book", hint: "Your learning space",
    size: 9, targetTime: 110, color: "#0ea5e9", colorEnd: "#38bdf8",
    wordCards: [
      { word: "DESK", emoji: "🪑", card: "A desk is where you sit and work — keep it tidy to keep your mind tidy!" },
      { word: "CHALK", emoji: "🖊️", card: "Chalk is used on blackboards — it's made from calcium carbonate, a natural mineral." },
      { word: "RULER", emoji: "📏", card: "A ruler measures length in centimetres or inches — essential for neat work." },
      { word: "BOARD", emoji: "📋", card: "The board is where teachers write lessons — always pay attention to what's on it." },
      { word: "ERASER", emoji: "✏️", card: "An eraser removes pencil marks — it's okay to make mistakes, that's how you learn!" },
      { word: "CLASS", emoji: "🏫", card: "A class is a group of students learning together — teamwork makes learning fun!" },
    ],
  },
  {
    id: 12, chapter: 3, chapterName: "School", chapterIcon: "school",
    name: "Subjects", theme: "Learning", icon: "library", hint: "What you study",
    size: 9, targetTime: 130, color: "#0ea5e9", colorEnd: "#38bdf8",
    wordCards: [
      { word: "MATH", emoji: "🔢", card: "Math teaches you numbers, patterns and problem-solving — used in everyday life." },
      { word: "ART", emoji: "🎨", card: "Art lets you express your feelings and ideas creatively through drawing and painting." },
      { word: "MUSIC", emoji: "🎵", card: "Music trains your brain's memory and focus — playing an instrument boosts intelligence!" },
      { word: "SCIENCE", emoji: "🔬", card: "Science explains how the world works through experiments and curiosity." },
      { word: "HISTORY", emoji: "📜", card: "History teaches us about the past so we can make better choices in the future." },
      { word: "ENGLISH", emoji: "📖", card: "English helps you communicate, read, and write to share your ideas with the world." },
    ],
  },
  {
    id: 13, chapter: 3, chapterName: "School", chapterIcon: "school",
    name: "Stationery", theme: "Tools", icon: "pencil", hint: "Your writing tools",
    size: 9, targetTime: 110, color: "#0ea5e9", colorEnd: "#38bdf8",
    wordCards: [
      { word: "PEN", emoji: "🖊️", card: "A pen writes with ink — invented over 150 years ago, it's still the most used writing tool." },
      { word: "BOOK", emoji: "📚", card: "Books store knowledge — reading just 15 minutes a day builds vocabulary and wisdom." },
      { word: "PAPER", emoji: "📄", card: "Paper is made from wood pulp — ancient Egyptians used papyrus leaves instead!" },
      { word: "GLUE", emoji: "🖇️", card: "Glue sticks things together using chemicals that bond surfaces tightly." },
      { word: "PENCIL", emoji: "✏️", card: "A pencil's 'lead' is actually graphite — one pencil can draw a line 56 km long!" },
      { word: "SCISSORS", emoji: "✂️", card: "Scissors cut paper and fabric — always carry them with the blades pointing down." },
    ],
  },
  {
    id: 14, chapter: 3, chapterName: "School", chapterIcon: "school",
    name: "Good Friends", theme: "Social", icon: "people", hint: "Being a great friend",
    size: 8, targetTime: 100, color: "#0ea5e9", colorEnd: "#38bdf8",
    wordCards: [
      { word: "PLAY", emoji: "🎮", card: "Play is how children learn — it builds creativity, social skills, and problem-solving." },
      { word: "SHARE", emoji: "🤝", card: "Sharing shows kindness — when you give to others, you feel happier too!" },
      { word: "HELP", emoji: "🙋", card: "Helping others strengthens friendships and makes you feel proud of yourself." },
      { word: "SMILE", emoji: "😊", card: "A smile is contagious — when you smile at someone, they almost always smile back!" },
      { word: "LAUGH", emoji: "😂", card: "Laughing releases chemicals in your brain that reduce stress and boost happiness." },
      { word: "LISTEN", emoji: "👂", card: "Good listening means focusing on what someone says — it makes people feel valued." },
    ],
  },
  {
    id: 15, chapter: 3, chapterName: "School", chapterIcon: "school",
    name: "Learning Skills", theme: "Skills", icon: "bulb", hint: "Grow your mind",
    size: 8, targetTime: 90, color: "#0ea5e9", colorEnd: "#38bdf8",
    wordCards: [
      { word: "READ", emoji: "📖", card: "Reading builds vocabulary and imagination — the more you read, the smarter you become." },
      { word: "WRITE", emoji: "✍️", card: "Writing helps you organise your thoughts and communicate your ideas clearly." },
      { word: "DRAW", emoji: "🎨", card: "Drawing is a visual language — it helps you express what words sometimes can't." },
      { word: "COUNT", emoji: "🔢", card: "Counting is the foundation of all mathematics — used from shopping to science." },
      { word: "SPELL", emoji: "🔤", card: "Good spelling helps people understand your writing — practice makes perfect!" },
      { word: "THINK", emoji: "💡", card: "Thinking critically means asking questions and not just accepting things as they are." },
    ],
  },

  // ─── CHAPTER 4: EMOTIONS ──────────────────────────────────────────────────
  {
    id: 16, chapter: 4, chapterName: "Emotions", chapterIcon: "heart",
    name: "Happy Feelings", theme: "Joy", icon: "happy", hint: "Feel the good vibes",
    size: 8, targetTime: 90, color: "#ec4899", colorEnd: "#f472b6",
    wordCards: [
      { word: "JOY", emoji: "🌟", card: "Joy is a deep feeling of happiness that glows from inside when something wonderful happens." },
      { word: "LOVE", emoji: "❤️", card: "Love is caring deeply about someone — it's one of the most powerful human emotions." },
      { word: "HOPE", emoji: "🌈", card: "Hope is believing good things will happen — it gives you strength to keep going." },
      { word: "PRIDE", emoji: "🏆", card: "Pride is the good feeling after achieving something you worked hard for." },
      { word: "CALM", emoji: "😌", card: "Being calm means feeling peaceful inside — deep breaths help you find calm quickly." },
      { word: "PEACE", emoji: "☮️", card: "Peace is when there's no conflict — it starts with being kind to yourself and others." },
    ],
  },
  {
    id: 17, chapter: 4, chapterName: "Emotions", chapterIcon: "heart",
    name: "Hard Feelings", theme: "Awareness", icon: "alert-circle", hint: "It's okay to feel",
    size: 8, targetTime: 100, color: "#ec4899", colorEnd: "#f472b6",
    wordCards: [
      { word: "FEAR", emoji: "😨", card: "Fear is a normal feeling that protects you from danger — it's okay to feel afraid sometimes." },
      { word: "ANGER", emoji: "😠", card: "Anger tells you something feels unfair — take deep breaths to manage it calmly." },
      { word: "WORRY", emoji: "😟", card: "Worry is your brain trying to prepare for problems — talk to someone you trust about it." },
      { word: "SHAME", emoji: "😔", card: "Shame is feeling bad about a mistake — remember, mistakes help you grow and improve." },
      { word: "GUILT", emoji: "😞", card: "Guilt is when you feel bad for hurting someone — it's the push to apologise and do better." },
      { word: "GRIEF", emoji: "💔", card: "Grief is the sadness when you lose something you love — it's normal and takes time to heal." },
    ],
  },
  {
    id: 18, chapter: 4, chapterName: "Emotions", chapterIcon: "heart",
    name: "Body Talk", theme: "Expression", icon: "body", hint: "How feelings show",
    size: 8, targetTime: 90, color: "#ec4899", colorEnd: "#f472b6",
    wordCards: [
      { word: "SMILE", emoji: "😊", card: "A smile uses 12 muscles in your face — and it sends a signal of warmth to others." },
      { word: "CRY", emoji: "😢", card: "Crying releases stress hormones from your body — it's healthy to cry when you're sad." },
      { word: "LAUGH", emoji: "😄", card: "Laughing is the best medicine — it boosts your immune system and reduces pain!" },
      { word: "WAVE", emoji: "👋", card: "Waving hello or goodbye is a universal gesture of greeting and farewell." },
      { word: "HUG", emoji: "🤗", card: "Hugging releases oxytocin — the 'love hormone' that makes both people feel safe." },
      { word: "SHOUT", emoji: "📢", card: "Shouting shows strong emotion — use your voice wisely, not to hurt others." },
    ],
  },
  {
    id: 19, chapter: 4, chapterName: "Emotions", chapterIcon: "heart",
    name: "Kindness", theme: "Character", icon: "heart", hint: "Be a good person",
    size: 8, targetTime: 100, color: "#ec4899", colorEnd: "#f472b6",
    wordCards: [
      { word: "KIND", emoji: "🌸", card: "Kindness is doing something nice without expecting anything back — it changes the world." },
      { word: "CARE", emoji: "💝", card: "Caring means paying attention to how others feel and wanting them to be okay." },
      { word: "GIVE", emoji: "🎁", card: "Giving to others — your time, help, or things — creates happiness for both people." },
      { word: "SHARE", emoji: "🤝", card: "Sharing means giving others a part of what you have — it builds trust and friendship." },
      { word: "FORGIVE", emoji: "🕊️", card: "Forgiving someone means letting go of anger — it's a gift you give yourself too." },
      { word: "TRUST", emoji: "🔐", card: "Trust is built slowly through honesty and kept promises — it's precious, never break it." },
    ],
  },
  {
    id: 20, chapter: 4, chapterName: "Emotions", chapterIcon: "heart",
    name: "Your Character", theme: "Values", icon: "star", hint: "Who you are inside",
    size: 9, targetTime: 120, color: "#ec4899", colorEnd: "#f472b6",
    wordCards: [
      { word: "BRAVE", emoji: "🦁", card: "Bravery is doing something scary because it's the right thing — not the absence of fear." },
      { word: "STRONG", emoji: "💪", card: "Strength isn't just physical — being mentally strong helps you handle life's challenges." },
      { word: "SMART", emoji: "🧠", card: "Being smart means thinking carefully — you grow smarter every time you learn something new." },
      { word: "HAPPY", emoji: "😊", card: "Happiness is a choice you practice — gratitude, kindness, and connection all build it." },
      { word: "HONEST", emoji: "💬", card: "Honesty builds trust — always tell the truth, even when it's hard." },
      { word: "PATIENT", emoji: "⏳", card: "Patience means waiting calmly — great things take time and effort to achieve." },
    ],
  },

  // ─── CHAPTER 5: NATURE ────────────────────────────────────────────────────
  {
    id: 21, chapter: 5, chapterName: "Nature", chapterIcon: "leaf",
    name: "Plants & Flowers", theme: "Nature", icon: "leaf", hint: "The green world",
    size: 8, targetTime: 90, color: "#10b981", colorEnd: "#34d399",
    wordCards: [
      { word: "TREE", emoji: "🌳", card: "Trees produce oxygen, provide shade, and are home to hundreds of animals and insects." },
      { word: "FLOWER", emoji: "🌸", card: "Flowers attract bees for pollination — without flowers, we'd have no fruits or seeds!" },
      { word: "LEAF", emoji: "🍃", card: "Leaves use sunlight to make food for the plant in a process called photosynthesis." },
      { word: "GRASS", emoji: "🌿", card: "Grass covers 26% of Earth's land — it prevents soil erosion and feeds many animals." },
      { word: "BUSH", emoji: "🌱", card: "Bushes are small woody plants that provide shelter for birds and small animals." },
      { word: "SEED", emoji: "🌱", card: "Seeds carry the instructions to grow an entire plant — one small seed becomes a giant tree!" },
    ],
  },
  {
    id: 22, chapter: 5, chapterName: "Nature", chapterIcon: "leaf",
    name: "Animals", theme: "Wildlife", icon: "paw", hint: "Our animal friends",
    size: 8, targetTime: 90, color: "#10b981", colorEnd: "#34d399",
    wordCards: [
      { word: "CAT", emoji: "🐱", card: "Cats sleep 12-16 hours a day to save energy — they're natural hunters even as pets." },
      { word: "DOG", emoji: "🐶", card: "Dogs have been humans' companions for 15,000 years — they sense our emotions!" },
      { word: "BIRD", emoji: "🐦", card: "Birds are the only modern animals with feathers — there are 10,000 different species." },
      { word: "FISH", emoji: "🐟", card: "Fish breathe through gills, extracting oxygen dissolved in water — amazing adaptations!" },
      { word: "RABBIT", emoji: "🐰", card: "Rabbits' teeth never stop growing — they wear them down by chewing constantly." },
      { word: "HORSE", emoji: "🐴", card: "Horses can sleep standing up and run within hours of being born — truly remarkable!" },
    ],
  },
  {
    id: 23, chapter: 5, chapterName: "Nature", chapterIcon: "leaf",
    name: "The Sky", theme: "Atmosphere", icon: "planet", hint: "Look up above",
    size: 8, targetTime: 90, color: "#10b981", colorEnd: "#34d399",
    wordCards: [
      { word: "SUN", emoji: "☀️", card: "The Sun is 150 million km away but provides all the energy for life on Earth." },
      { word: "MOON", emoji: "🌙", card: "The Moon controls Earth's ocean tides — its gravity pulls water creating high and low tides." },
      { word: "STAR", emoji: "⭐", card: "Stars are giant balls of gas like our Sun — you see 2,000–3,000 stars on a clear night!" },
      { word: "CLOUD", emoji: "☁️", card: "Clouds are made of millions of tiny water droplets floating together in the sky." },
      { word: "RAIN", emoji: "🌧️", card: "Rain is part of the water cycle — water evaporates, forms clouds, then falls again." },
      { word: "WIND", emoji: "💨", card: "Wind is moving air caused by differences in temperature and pressure around the Earth." },
    ],
  },
  {
    id: 24, chapter: 5, chapterName: "Nature", chapterIcon: "leaf",
    name: "Four Seasons", theme: "Seasons", icon: "thermometer", hint: "Nature's calendar",
    size: 9, targetTime: 120, color: "#10b981", colorEnd: "#34d399",
    wordCards: [
      { word: "SPRING", emoji: "🌷", card: "Spring brings new life — flowers bloom, animals have babies, and days grow longer." },
      { word: "SUMMER", emoji: "☀️", card: "Summer is the warmest season — Earth is tilted toward the Sun, giving us longer days." },
      { word: "AUTUMN", emoji: "🍂", card: "In autumn, trees lose leaves to save energy — the colours turn red, orange, and gold." },
      { word: "WINTER", emoji: "❄️", card: "Winter is the coldest season — some animals hibernate and others migrate to warmer places." },
      { word: "FROST", emoji: "🧊", card: "Frost forms when water vapour freezes on cold surfaces — making beautiful crystal patterns." },
      { word: "BLOOM", emoji: "🌸", card: "Bloom means plants bursting into flower — a sign of growth and new beginnings." },
    ],
  },
  {
    id: 25, chapter: 5, chapterName: "Nature", chapterIcon: "leaf",
    name: "Planet Earth", theme: "Geography", icon: "earth", hint: "Our amazing world",
    size: 9, targetTime: 130, color: "#10b981", colorEnd: "#34d399",
    wordCards: [
      { word: "RIVER", emoji: "🏞️", card: "Rivers carry fresh water from mountains to the sea — they shaped civilizations throughout history." },
      { word: "OCEAN", emoji: "🌊", card: "Oceans cover 71% of Earth and contain 97% of all water — they regulate our climate." },
      { word: "MOUNTAIN", emoji: "⛰️", card: "Mountains are formed by tectonic plates pushing together — it takes millions of years!" },
      { word: "FOREST", emoji: "🌲", card: "Forests are the lungs of the Earth — they absorb CO₂ and produce the oxygen we breathe." },
      { word: "DESERT", emoji: "🏜️", card: "Deserts get less than 25cm of rain a year — many animals adapted to live with almost no water." },
      { word: "VALLEY", emoji: "🏔️", card: "Valleys are low areas between hills formed by rivers carving through rock over thousands of years." },
    ],
  },

  // ─── CHAPTER 6: SPORTS & PLAY ─────────────────────────────────────────────
  {
    id: 26, chapter: 6, chapterName: "Sports & Play", chapterIcon: "football",
    name: "Ball Sports", theme: "Sports", icon: "football", hint: "Game on!",
    size: 9, targetTime: 120, color: "#ef4444", colorEnd: "#f87171",
    wordCards: [
      { word: "SOCCER", emoji: "⚽", card: "Soccer is the world's most popular sport — 4 billion people around the globe love it!" },
      { word: "TENNIS", emoji: "🎾", card: "Tennis players run an average of 3 miles per match — it's a great workout!" },
      { word: "CRICKET", emoji: "🏏", card: "Cricket matches can last 5 days — it's one of the oldest sports dating back to 1597." },
      { word: "RUGBY", emoji: "🏉", card: "Rugby was invented when a player picked up a soccer ball and ran with it — by accident!" },
      { word: "GOLF", emoji: "⛳", card: "Golf challenges you to hit a small ball into a hole with as few shots as possible." },
      { word: "HOCKEY", emoji: "🏒", card: "Hockey is one of the fastest team sports — players skate at speeds up to 45 km/h!" },
    ],
  },
  {
    id: 27, chapter: 6, chapterName: "Sports & Play", chapterIcon: "football",
    name: "Water Sports", theme: "Swimming", icon: "water", hint: "Make a splash",
    size: 8, targetTime: 90, color: "#ef4444", colorEnd: "#f87171",
    wordCards: [
      { word: "SWIM", emoji: "🏊", card: "Swimming works every muscle in your body at once — it's the perfect full-body exercise." },
      { word: "SURF", emoji: "🏄", card: "Surfing uses ocean waves — you ride the energy created by wind thousands of miles away." },
      { word: "DIVE", emoji: "🤿", card: "Diving lets you explore underwater worlds full of colourful fish and coral reefs." },
      { word: "ROW", emoji: "🚣", card: "Rowing uses your arms, back, and legs simultaneously — teamwork in a rowing boat is key." },
      { word: "SAIL", emoji: "⛵", card: "Sailing uses wind power — you control the boat by adjusting the sails' angle to the wind." },
      { word: "KAYAK", emoji: "🛶", card: "A kayak is a small boat you paddle with a double-bladed paddle — great for rivers and seas." },
    ],
  },
  {
    id: 28, chapter: 6, chapterName: "Sports & Play", chapterIcon: "football",
    name: "Playground", theme: "Play", icon: "game-controller", hint: "Let's have fun",
    size: 8, targetTime: 90, color: "#ef4444", colorEnd: "#f87171",
    wordCards: [
      { word: "SWING", emoji: "🎠", card: "Swinging builds balance and coordination — it also gives you a feeling of flying!" },
      { word: "SLIDE", emoji: "🛝", card: "Sliding teaches cause and effect — gravity pulls you down as you enjoy the ride." },
      { word: "CLIMB", emoji: "🧗", card: "Climbing builds strength, problem-solving, and courage — every step is a small victory." },
      { word: "JUMP", emoji: "🦘", card: "Jumping strengthens your leg muscles and bones — even astronauts jump to stay fit!" },
      { word: "RUN", emoji: "🏃", card: "Running releases endorphins — the 'happy chemicals' that make you feel amazing." },
      { word: "SKIP", emoji: "🎵", card: "Skipping coordinates your arms, legs, and timing — it's more exercise than it looks!" },
    ],
  },
  {
    id: 29, chapter: 6, chapterName: "Sports & Play", chapterIcon: "football",
    name: "Team Play", theme: "Teamwork", icon: "people", hint: "Better together",
    size: 9, targetTime: 120, color: "#ef4444", colorEnd: "#f87171",
    wordCards: [
      { word: "PASS", emoji: "🤾", card: "Passing is sharing the ball to create better opportunities — teamwork beats talent alone." },
      { word: "SHOOT", emoji: "🎯", card: "Shooting requires focus, timing, and precision — practice builds the perfect shot." },
      { word: "SCORE", emoji: "⚽", card: "Scoring means your team achieved their goal — celebration is part of the joy of sport!" },
      { word: "BLOCK", emoji: "🛡️", card: "Blocking stops the opponent — a great defence can win games just as much as scoring." },
      { word: "TACKLE", emoji: "🏈", card: "A tackle uses your body to stop or take the ball — done safely, it's part of many sports." },
      { word: "DRIBBLE", emoji: "⚽", card: "Dribbling means moving with the ball under control — it takes thousands of hours to master." },
    ],
  },
  {
    id: 30, chapter: 6, chapterName: "Sports & Play", chapterIcon: "football",
    name: "Victory!", theme: "Achievement", icon: "trophy", hint: "You're a champion",
    size: 9, targetTime: 110, color: "#ef4444", colorEnd: "#f87171",
    wordCards: [
      { word: "GOLD", emoji: "🥇", card: "Gold medals represent first place — even reaching a final is a massive achievement." },
      { word: "SILVER", emoji: "🥈", card: "Silver means second place — finishing second in the world is an incredible feat!" },
      { word: "TROPHY", emoji: "🏆", card: "Trophies symbolise achievement — but the journey to earn them builds character most." },
      { word: "MEDAL", emoji: "🏅", card: "Medals are awarded for excellence — wearing one represents years of dedication." },
      { word: "CHAMPION", emoji: "👑", card: "A champion isn't just a winner — it's someone who gives their best every single time." },
      { word: "WIN", emoji: "🎉", card: "Winning feels amazing, but the lessons from losing make champions even stronger." },
    ],
  },

  // ─── CHAPTER 7: HOME & FAMILY ─────────────────────────────────────────────
  {
    id: 31, chapter: 7, chapterName: "Home & Family", chapterIcon: "home",
    name: "My Family", theme: "Family", icon: "people", hint: "People who love you",
    size: 9, targetTime: 120, color: "#fbbf24", colorEnd: "#fcd34d",
    wordCards: [
      { word: "MOM", emoji: "👩", card: "Mothers carry, birth, and nurture children — their love is one of life's greatest gifts." },
      { word: "DAD", emoji: "👨", card: "Fathers provide guidance, protection, and fun — their role shapes who you become." },
      { word: "SISTER", emoji: "👧", card: "Sisters are your first best friends — they teach you sharing, patience, and loyalty." },
      { word: "BROTHER", emoji: "👦", card: "Brothers protect and challenge you — sibling bonds often last your entire lifetime." },
      { word: "GRANDMA", emoji: "👵", card: "Grandmothers carry family history and wisdom — listen to their stories carefully." },
      { word: "UNCLE", emoji: "👨‍👦", card: "Uncles bring different perspectives and fun — extended family enriches your life." },
    ],
  },
  {
    id: 32, chapter: 7, chapterName: "Home & Family", chapterIcon: "home",
    name: "Rooms at Home", theme: "Home", icon: "home", hint: "Every room matters",
    size: 9, targetTime: 130, color: "#fbbf24", colorEnd: "#fcd34d",
    wordCards: [
      { word: "BEDROOM", emoji: "🛏️", card: "Your bedroom is your personal space — keeping it tidy helps keep your mind clear." },
      { word: "KITCHEN", emoji: "🍳", card: "The kitchen is the heart of the home — where meals and memories are made together." },
      { word: "BATHROOM", emoji: "🚿", card: "Bathrooms are for hygiene — cleanliness here prevents the spread of germs and illness." },
      { word: "LOUNGE", emoji: "🛋️", card: "The lounge is where families relax and connect — quality time here builds strong bonds." },
      { word: "GARDEN", emoji: "🌿", card: "A garden is nature at home — growing plants teaches patience and responsibility." },
      { word: "GARAGE", emoji: "🚗", card: "Garages store vehicles and tools — a well-organised garage shows good planning." },
    ],
  },
  {
    id: 33, chapter: 7, chapterName: "Home & Family", chapterIcon: "home",
    name: "Home Chores", theme: "Responsibility", icon: "construct", hint: "Help around the house",
    size: 8, targetTime: 100, color: "#fbbf24", colorEnd: "#fcd34d",
    wordCards: [
      { word: "COOK", emoji: "👨‍🍳", card: "Cooking your own meals saves money and helps you understand nutrition better." },
      { word: "CLEAN", emoji: "🧹", card: "A clean home reduces stress and the spread of germs — everyone should help!" },
      { word: "WASH", emoji: "🧺", card: "Washing clothes removes bacteria and sweat — clean clothes keep you healthy." },
      { word: "SWEEP", emoji: "🧹", card: "Sweeping removes dust and dirt from floors — dust can cause allergies if left too long." },
      { word: "DUST", emoji: "🪣", card: "Dusting removes particles that irritate lungs — do it weekly for a healthy home." },
      { word: "IRON", emoji: "👕", card: "Ironing removes wrinkles from clothes — the steam kills bacteria too!" },
    ],
  },
  {
    id: 34, chapter: 7, chapterName: "Home & Family", chapterIcon: "home",
    name: "Furniture", theme: "Home", icon: "bed", hint: "What fills your home",
    size: 9, targetTime: 110, color: "#fbbf24", colorEnd: "#fcd34d",
    wordCards: [
      { word: "BED", emoji: "🛏️", card: "A good bed improves sleep quality — we spend a third of our lives sleeping in one!" },
      { word: "SOFA", emoji: "🛋️", card: "Sofas are for relaxing together — the word comes from Arabic 'suffah' meaning bench." },
      { word: "TABLE", emoji: "🪑", card: "Dining tables bring families together — eating together improves communication and bonding." },
      { word: "CHAIR", emoji: "🪑", card: "Chairs support your posture — sitting correctly prevents back pain as you grow." },
      { word: "SHELF", emoji: "📚", card: "Shelves organise books and belongings — an organised space creates an organised mind." },
      { word: "WARDROBE", emoji: "🚪", card: "A wardrobe stores and organises your clothes — knowing what you own saves time each morning." },
    ],
  },
  {
    id: 35, chapter: 7, chapterName: "Home & Family", chapterIcon: "home",
    name: "Love & Care", theme: "Relationships", icon: "heart", hint: "Show you care",
    size: 9, targetTime: 110, color: "#fbbf24", colorEnd: "#fcd34d",
    wordCards: [
      { word: "HUG", emoji: "🤗", card: "A 20-second hug releases oxytocin that lowers stress and strengthens relationships." },
      { word: "KISS", emoji: "😘", card: "A kiss on the cheek is a universal greeting of affection across many cultures." },
      { word: "CUDDLE", emoji: "🫂", card: "Cuddling releases serotonin and dopamine — the chemicals that make you feel safe and loved." },
      { word: "CARE", emoji: "💝", card: "Caring means noticing and responding to someone's needs without being asked." },
      { word: "LOVE", emoji: "❤️", card: "Love is the most powerful human bond — it grows stronger with time, effort, and kindness." },
      { word: "PROTECT", emoji: "🛡️", card: "Protecting your family means keeping them safe from harm — both physical and emotional." },
    ],
  },

  // ─── CHAPTER 8: TRANSPORT ─────────────────────────────────────────────────
  {
    id: 36, chapter: 8, chapterName: "Transport", chapterIcon: "car",
    name: "Vehicles", theme: "Transport", icon: "car", hint: "Getting around",
    size: 8, targetTime: 90, color: "#8b5cf6", colorEnd: "#a78bfa",
    wordCards: [
      { word: "CAR", emoji: "🚗", card: "Cars transformed modern life — there are over 1.4 billion cars on Earth's roads today." },
      { word: "BUS", emoji: "🚌", card: "Buses carry many passengers at once, reducing traffic and pollution compared to cars." },
      { word: "TRAIN", emoji: "🚂", card: "Trains are the most energy-efficient land transport — they carry more per litre of fuel." },
      { word: "PLANE", emoji: "✈️", card: "Planes travel at 900 km/h and changed the world by making far distances quick to cross." },
      { word: "BOAT", emoji: "⛵", card: "Before planes, boats were the only way to cross oceans — they connected the whole world." },
      { word: "BIKE", emoji: "🚲", card: "Bikes produce zero emissions — cycling is one of the healthiest and greenest ways to travel." },
    ],
  },
  {
    id: 37, chapter: 8, chapterName: "Transport", chapterIcon: "car",
    name: "On the Road", theme: "Safety", icon: "navigate", hint: "Road rules matter",
    size: 8, targetTime: 100, color: "#8b5cf6", colorEnd: "#a78bfa",
    wordCards: [
      { word: "ROAD", emoji: "🛣️", card: "Roads connect cities and communities — the Roman Empire built 85,000 km of roads!" },
      { word: "SIGNAL", emoji: "🚦", card: "Traffic signals control the flow of vehicles — always obey them for everyone's safety." },
      { word: "SPEED", emoji: "💨", card: "Speed limits protect lives — stopping distance doubles when you double your speed." },
      { word: "LANE", emoji: "🛣️", card: "Road lanes organise traffic — staying in your lane prevents accidents and confusion." },
      { word: "BRIDGE", emoji: "🌉", card: "Bridges allow roads to cross rivers and valleys — they're marvels of engineering." },
      { word: "MAP", emoji: "🗺️", card: "Maps show you where to go — understanding a map is a life skill everyone should have." },
    ],
  },
  {
    id: 38, chapter: 8, chapterName: "Transport", chapterIcon: "car",
    name: "Travel", theme: "Adventure", icon: "airplane", hint: "Explore the world",
    size: 9, targetTime: 130, color: "#8b5cf6", colorEnd: "#a78bfa",
    wordCards: [
      { word: "TICKET", emoji: "🎫", card: "Tickets prove you've paid for your journey — always keep them safe until your destination." },
      { word: "PASSPORT", emoji: "🛂", card: "A passport proves who you are and allows you to travel to other countries legally." },
      { word: "HOTEL", emoji: "🏨", card: "Hotels provide temporary accommodation — they originated in ancient Greece and Rome." },
      { word: "LUGGAGE", emoji: "🧳", card: "Luggage carries your belongings — pack light to make travel easier and faster." },
      { word: "FLIGHT", emoji: "✈️", card: "The first powered flight lasted 12 seconds in 1903 — now we cross oceans in hours!" },
      { word: "CRUISE", emoji: "🛳️", card: "Cruise ships are floating cities — they carry thousands of passengers across oceans." },
    ],
  },
  {
    id: 39, chapter: 8, chapterName: "Transport", chapterIcon: "car",
    name: "City Transport", theme: "Urban", icon: "train", hint: "Move around the city",
    size: 8, targetTime: 100, color: "#8b5cf6", colorEnd: "#a78bfa",
    wordCards: [
      { word: "TAXI", emoji: "🚕", card: "Taxis take you door to door — they're convenient but cost more than public transport." },
      { word: "METRO", emoji: "🚇", card: "Metro trains run underground, avoiding traffic — they carry millions of people daily in cities." },
      { word: "TRAM", emoji: "🚃", card: "Trams run on rails in city streets — they're electric and have less pollution than buses." },
      { word: "FERRY", emoji: "⛴️", card: "Ferries carry people across water — they're vital in cities with rivers, bays, and islands." },
      { word: "CABLE", emoji: "🚡", card: "Cable cars climb steep hills using cables — San Francisco's are over 150 years old!" },
      { word: "CYCLE", emoji: "🚲", card: "Cycling in cities reduces pollution, keeps you fit, and often beats cars in traffic!" },
    ],
  },
  {
    id: 40, chapter: 8, chapterName: "Transport", chapterIcon: "car",
    name: "Future Rides", theme: "Innovation", icon: "rocket", hint: "Tomorrow's transport",
    size: 9, targetTime: 120, color: "#8b5cf6", colorEnd: "#a78bfa",
    wordCards: [
      { word: "ROCKET", emoji: "🚀", card: "Rockets are the only vehicles that can escape Earth's gravity — they reach 28,000 km/h!" },
      { word: "DRONE", emoji: "🚁", card: "Drones fly without a pilot — they're already delivering medical supplies in remote areas." },
      { word: "SOLAR", emoji: "☀️", card: "Solar-powered vehicles use the sun's energy — producing zero emissions on the road." },
      { word: "ELECTRIC", emoji: "⚡", card: "Electric vehicles have zero exhaust emissions — they're the future of clean transport." },
      { word: "HYBRID", emoji: "🔋", card: "Hybrid cars use both petrol and electric power — using less fuel and producing less pollution." },
      { word: "HOVER", emoji: "🛸", card: "Hovercrafts float on a cushion of air — they can travel on both land and water!" },
    ],
  },

  // ─── CHAPTER 9: WEATHER ───────────────────────────────────────────────────
  {
    id: 41, chapter: 9, chapterName: "Weather", chapterIcon: "partly-sunny",
    name: "Rainy Days", theme: "Weather", icon: "rainy", hint: "When clouds cry",
    size: 9, targetTime: 120, color: "#06b6d4", colorEnd: "#22d3ee",
    wordCards: [
      { word: "RAIN", emoji: "🌧️", card: "Rain is part of Earth's water cycle — without rain, all life on land would die." },
      { word: "THUNDER", emoji: "⛈️", card: "Thunder is the sound of lightning superheating air so fast it creates a shockwave." },
      { word: "LIGHTNING", emoji: "⚡", card: "Lightning reaches 30,000°C — 5 times hotter than the surface of the Sun!" },
      { word: "FLOOD", emoji: "🌊", card: "Floods happen when rain exceeds what the ground can absorb — they reshape landscapes." },
      { word: "STORM", emoji: "🌩️", card: "Storms bring lightning, rain, and strong winds — they transfer heat around the planet." },
      { word: "CLOUD", emoji: "☁️", card: "Clouds can weigh over 500 tonnes — yet they float because tiny water droplets are so light." },
    ],
  },
  {
    id: 42, chapter: 9, chapterName: "Weather", chapterIcon: "partly-sunny",
    name: "Sunshine", theme: "Summer", icon: "sunny", hint: "Bright and warm",
    size: 8, targetTime: 90, color: "#06b6d4", colorEnd: "#22d3ee",
    wordCards: [
      { word: "SUN", emoji: "☀️", card: "Sunlight takes 8 minutes to reach Earth — and provides all the energy for life." },
      { word: "WARM", emoji: "🌡️", card: "Warmth is created by the Sun's radiation heating Earth's surface — it sustains all life." },
      { word: "BRIGHT", emoji: "✨", card: "Bright sunlight triggers vitamin D production in your skin — essential for bone health." },
      { word: "HOT", emoji: "🥵", card: "Extreme heat can be dangerous — always drink water and find shade on very hot days." },
      { word: "DRY", emoji: "🏜️", card: "Dry air has low humidity — deserts are dry because rain clouds rarely reach them." },
      { word: "SHINE", emoji: "🌟", card: "Sunshine improves mood by boosting serotonin — that's why people feel happier in summer!" },
    ],
  },
  {
    id: 43, chapter: 9, chapterName: "Weather", chapterIcon: "partly-sunny",
    name: "Cold Weather", theme: "Winter", icon: "snow", hint: "Brrr, it's cold!",
    size: 9, targetTime: 120, color: "#06b6d4", colorEnd: "#22d3ee",
    wordCards: [
      { word: "SNOW", emoji: "❄️", card: "No two snowflakes are identical — each one has a unique six-sided crystal structure." },
      { word: "ICE", emoji: "🧊", card: "Ice is less dense than water, which is why it floats — this protects fish under frozen lakes." },
      { word: "FROST", emoji: "🌡️", card: "Frost forms when temperatures drop below 0°C — water vapour crystallises on surfaces." },
      { word: "FREEZE", emoji: "🥶", card: "Water freezes at 0°C — and expands as it freezes, which is why pipes can burst in winter." },
      { word: "BLIZZARD", emoji: "🌨️", card: "A blizzard is a severe snowstorm with strong winds — visibility can drop to near zero." },
      { word: "SLEET", emoji: "🌧️", card: "Sleet is frozen raindrops — it forms when rain falls through a layer of freezing air." },
    ],
  },
  {
    id: 44, chapter: 9, chapterName: "Weather", chapterIcon: "partly-sunny",
    name: "Windy World", theme: "Wind", icon: "flag", hint: "Feel the breeze",
    size: 9, targetTime: 130, color: "#06b6d4", colorEnd: "#22d3ee",
    wordCards: [
      { word: "BREEZE", emoji: "💨", card: "A gentle breeze cools you down by evaporating sweat from your skin — natural AC!" },
      { word: "GUST", emoji: "🌬️", card: "Gusts are sudden bursts of strong wind — they can knock over trees and damage buildings." },
      { word: "TORNADO", emoji: "🌪️", card: "Tornadoes spin at 500 km/h — they're the most violent windstorms on Earth." },
      { word: "HURRICANE", emoji: "🌀", card: "Hurricanes are massive spinning storms — they form over warm ocean water and can be 800 km wide." },
      { word: "DRAFT", emoji: "💨", card: "A draft is a cool flow of air — it enters through gaps in windows and doors." },
      { word: "WHIRL", emoji: "🌀", card: "A whirlpool or whirl is circular motion — it happens when water or air spins rapidly." },
    ],
  },
  {
    id: 45, chapter: 9, chapterName: "Weather", chapterIcon: "partly-sunny",
    name: "Seasons Change", theme: "Cycles", icon: "refresh-circle", hint: "Nature's rhythm",
    size: 9, targetTime: 120, color: "#06b6d4", colorEnd: "#22d3ee",
    wordCards: [
      { word: "SPRING", emoji: "🌷", card: "Spring means new beginnings — temperature rises, days lengthen, and nature awakens." },
      { word: "SUMMER", emoji: "🏖️", card: "Summer is peak growing season — plants use longer daylight to produce food and fruit." },
      { word: "WINTER", emoji: "🌨️", card: "Winter slows nature down — many plants and animals rest or hibernate to save energy." },
      { word: "AUTUMN", emoji: "🍁", card: "Autumn triggers trees to drop leaves — they pull nutrients back in before winter begins." },
      { word: "SEASON", emoji: "📅", card: "Seasons are caused by Earth's tilt — not its distance from the Sun as many people think!" },
      { word: "HARVEST", emoji: "🌾", card: "Harvest time is when crops are collected — it's one of the most important events in farming." },
    ],
  },

  // ─── CHAPTER 10: TECHNOLOGY ───────────────────────────────────────────────
  {
    id: 46, chapter: 10, chapterName: "Technology", chapterIcon: "hardware-chip",
    name: "My Devices", theme: "Tech", icon: "phone-portrait", hint: "Smart tools",
    size: 9, targetTime: 120, color: "#64748b", colorEnd: "#94a3b8",
    wordCards: [
      { word: "PHONE", emoji: "📱", card: "Smartphones today are more powerful than the computers that sent humans to the Moon!" },
      { word: "TABLET", emoji: "📱", card: "Tablets are portable computers — great for reading, learning, and creating content." },
      { word: "LAPTOP", emoji: "💻", card: "Laptops brought computing everywhere — you carry a machine more powerful than 1970s supercomputers." },
      { word: "CAMERA", emoji: "📷", card: "Cameras capture moments in time — digital cameras store thousands of photos instantly." },
      { word: "SPEAKER", emoji: "🔊", card: "Speakers convert electrical signals into sound waves — letting you hear music anywhere." },
      { word: "PRINTER", emoji: "🖨️", card: "Printers turn digital files into physical documents — 3D printers even print physical objects!" },
    ],
  },
  {
    id: 47, chapter: 10, chapterName: "Technology", chapterIcon: "hardware-chip",
    name: "The Internet", theme: "Digital", icon: "wifi", hint: "Connected world",
    size: 9, targetTime: 130, color: "#64748b", colorEnd: "#94a3b8",
    wordCards: [
      { word: "EMAIL", emoji: "📧", card: "Email replaced physical letters — over 300 billion emails are sent every single day." },
      { word: "WIFI", emoji: "📶", card: "WiFi transmits data using radio waves — it was invented in 1997 and changed everything." },
      { word: "BROWSER", emoji: "🌐", card: "Browsers display websites — they translate code into the beautiful pages you see." },
      { word: "DOWNLOAD", emoji: "⬇️", card: "Downloading moves data from a remote server to your device — like getting a digital copy." },
      { word: "UPLOAD", emoji: "⬆️", card: "Uploading sends your data to the internet — like sharing a photo to the cloud." },
      { word: "STREAM", emoji: "▶️", card: "Streaming plays content without downloading it fully — data arrives just in time to play." },
    ],
  },
  {
    id: 48, chapter: 10, chapterName: "Technology", chapterIcon: "hardware-chip",
    name: "Social Media", theme: "Online", icon: "share-social", hint: "Stay connected",
    size: 8, targetTime: 100, color: "#64748b", colorEnd: "#94a3b8",
    wordCards: [
      { word: "CHAT", emoji: "💬", card: "Online chat lets you message friends instantly — always be kind and think before you type." },
      { word: "POST", emoji: "📝", card: "Posts share your thoughts online — once posted, content can be very hard to remove." },
      { word: "LIKE", emoji: "👍", card: "Likes provide feedback on content — but real-world validation matters much more than online likes." },
      { word: "SHARE", emoji: "↗️", card: "Sharing content spreads information — always check if something is true before you share it!" },
      { word: "FOLLOW", emoji: "👥", card: "Following someone means seeing their updates — choose accounts that inspire and educate you." },
      { word: "COMMENT", emoji: "💭", card: "Comments allow conversation online — always be respectful, as words can hurt even through screens." },
    ],
  },
  {
    id: 49, chapter: 10, chapterName: "Technology", chapterIcon: "hardware-chip",
    name: "Gaming World", theme: "Gaming", icon: "game-controller", hint: "Play and learn",
    size: 8, targetTime: 100, color: "#64748b", colorEnd: "#94a3b8",
    wordCards: [
      { word: "GAME", emoji: "🎮", card: "Games teach strategy, problem-solving, and hand-eye coordination — they're not just fun!" },
      { word: "PLAYER", emoji: "🕹️", card: "A player engages with a game — good players also know when it's time to take a break." },
      { word: "LEVEL", emoji: "⬆️", card: "Levels in games represent progression — each one teaches new skills and challenges." },
      { word: "SCORE", emoji: "🏆", card: "Scores track progress in a game — improving your score shows learning and practice." },
      { word: "QUEST", emoji: "⚔️", card: "A quest is a mission with a goal — just like real life, completing quests builds skills." },
      { word: "AVATAR", emoji: "🧑‍💻", card: "An avatar represents you in a game or online — choose one that reflects your values." },
    ],
  },
  {
    id: 50, chapter: 10, chapterName: "Technology", chapterIcon: "hardware-chip",
    name: "Future Tech", theme: "Innovation", icon: "hardware-chip", hint: "What's coming next",
    size: 9, targetTime: 130, color: "#64748b", colorEnd: "#94a3b8",
    wordCards: [
      { word: "ROBOT", emoji: "🤖", card: "Robots are already performing surgery, exploring Mars, and building our cars — the future is here!" },
      { word: "DATA", emoji: "📊", card: "Data is information — the world generates 2.5 quintillion bytes of data every single day." },
      { word: "CLOUD", emoji: "☁️", card: "Cloud storage keeps your files on remote servers — accessible from any device, anywhere." },
      { word: "DIGITAL", emoji: "💡", card: "Digital means information stored as numbers (0s and 1s) — everything online is digital." },
      { word: "SMART", emoji: "🧠", card: "Smart devices learn your habits — your phone predicts what you need before you ask!" },
      { word: "VIRTUAL", emoji: "🥽", card: "Virtual reality creates immersive digital worlds — VR is already used in medicine and education." },
    ],
  },
];

export const FOUND_COLORS = [
  "#6366f1", "#10b981", "#f97316", "#ec4899",
  "#06b6d4", "#8b5cf6", "#fbbf24", "#ef4444",
];

export function colorForIndex(i: number): string {
  return FOUND_COLORS[i % FOUND_COLORS.length];
}
