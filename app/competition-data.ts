export type Entry = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  year: string;
  heat: number;
  champions: number;
  group?: string;
  label?: string;
  cover?: string;
  sourceId?: string;
  member?: string;
  previewUrl?: string;
  playUrl?: string;
};

export type Competition = {
  id: "hiphop" | "kpop" | "games";
  name: string;
  shortName: string;
  eyebrow: string;
  tagline: string;
  description: string;
  theme: "redblue" | "neon" | "arcade";
  entries: Entry[];
};

export const competitions: Competition[] = [
  {
    id: "hiphop",
    name: "中国嘻哈巅峰对决",
    shortName: "中国嘻哈",
    eyebrow: "CHINESE HIP-HOP",
    tagline: "今晚，只留一首",
    description: "从多个中文说唱厂牌曲库中组建签表，抽出六十四首歌争夺最后的麦克风。",
    theme: "redblue",
    entries: [
      { id: "qilin", title: "麒麟", subtitle: "早安", meta: "南京", year: "2022", heat: 98210, champions: 12842, group: "Free-Out", label: "Free-Out" },
      { id: "jianghuliu", title: "江湖流", subtitle: "C-BLOCK", meta: "长沙", year: "2014", heat: 94680, champions: 11375, group: "C-BLOCK", label: "SUP MUSIC" },
      { id: "chabuduoxiansheng", title: "差不多先生", subtitle: "MC HotDog", meta: "台北", year: "2008", heat: 93420, champions: 10904, group: "本色音乐", label: "滚石唱片" },
      { id: "buyongqucai", title: "不用去猜", subtitle: "Jony J", meta: "南京", year: "2017", heat: 91560, champions: 9718, group: "独立音乐人", label: "独立发行" },
      { id: "jingjicang", title: "经济舱", subtitle: "KEY.L刘聪 · KAFE.HU", meta: "长沙", year: "2019", heat: 88930, champions: 8641, group: "C-BLOCK", label: "SUP MUSIC" },
      { id: "laoshan-daoshi", title: "崂山道士", subtitle: "马思唯", meta: "成都", year: "2020", heat: 86120, champions: 7906, group: "Higher Brothers", label: "88rising" },
      { id: "lanhuacao", title: "兰花草", subtitle: "GAI 周延", meta: "重庆", year: "2017", heat: 83770, champions: 7288, group: "GO$H", label: "种梦音乐D.M.G" },
      { id: "yelangdisco", title: "野狼Disco", subtitle: "宝石Gem", meta: "长春", year: "2019", heat: 81240, champions: 6554, group: "吾人文化", label: "百纳娱乐" },
      { id: "xingqiuzhuiluo", title: "星球坠落", subtitle: "艾热 AIR · 李佳隆", meta: "舞台合作", year: "2018", heat: 80410, champions: 6321, group: "M-LAB", label: "种梦音乐D.M.G" },
      { id: "mubuzhuanjing", title: "目不转睛", subtitle: "王以太", meta: "成都", year: "2018", heat: 79680, champions: 6108, group: "成都集团", label: "种梦音乐D.M.G" },
      { id: "rnb-all-night", title: "R&B All Night", subtitle: "KnowKnow · Masiwei", meta: "成都", year: "2019", heat: 78940, champions: 5982, group: "Higher Brothers", label: "88rising" },
      { id: "made-in-china", title: "Made in China", subtitle: "Higher Brothers", meta: "成都", year: "2017", heat: 78120, champions: 5734, group: "Higher Brothers", label: "88rising" },
      { id: "tianganwuzhao", title: "天干物燥", subtitle: "GAI 周延", meta: "重庆", year: "2017", heat: 77450, champions: 5519, group: "GO$H", label: "种梦音乐D.M.G" },
      { id: "zoudoufei", title: "走到飞", subtitle: "PACT派克特", meta: "西安", year: "2018", heat: 76810, champions: 5306, group: "NOUS UNDERGROUND", label: "NOUS" },
      { id: "gui", title: "归", subtitle: "龙胆紫", meta: "北京", year: "2013", heat: 75920, champions: 5147, group: "Purple Soul", label: "独立发行" },
      { id: "tou-wenzi-t", title: "头文字T", subtitle: "TizzyT", meta: "广州", year: "2017", heat: 75180, champions: 4968, group: "成都集团", label: "摩登天空MDSK" },
      { id: "lajihua", title: "垃圾话", subtitle: "C-BLOCK", meta: "长沙", year: "2017", heat: 74430, champions: 4780, group: "C-BLOCK", label: "SUP MUSIC" },
      { id: "chongqinghun", title: "重庆魂", subtitle: "GAI 周延", meta: "重庆", year: "2015", heat: 73680, champions: 4592, group: "GO$H", label: "GO$H MUSIC" },
      { id: "xiaorenda", title: "小人物", subtitle: "Bridge", meta: "重庆", year: "2017", heat: 72940, champions: 4416, group: "GO$H", label: "GO$H MUSIC" },
      { id: "qinmi-airen", title: "亲密爱人", subtitle: "法老", meta: "上海", year: "2019", heat: 72110, champions: 4268, group: "活死人", label: "独立发行" },
      { id: "henjiu-henjiu", title: "很久很久", subtitle: "杨和苏KeyNG", meta: "成都", year: "2019", heat: 71320, champions: 4105, group: "活死人", label: "种梦音乐D.M.G" },
      { id: "fresh-one", title: "Fresh One", subtitle: "万妮达", meta: "福州", year: "2016", heat: 70480, champions: 3937, group: "独立音乐人", label: "摩登天空MDSK" },
      { id: "life-struggle", title: "Life's a Struggle", subtitle: "宋岳庭", meta: "经典", year: "2003", heat: 69630, champions: 3784, group: "独立音乐人", label: "独立发行" },
      { id: "wo-xiang", title: "我想", subtitle: "MC HotDog", meta: "台北", year: "2008", heat: 68890, champions: 3618, group: "本色音乐", label: "滚石唱片" },
      { id: "wodexinyi", title: "我的新衣", subtitle: "VaVa毛衍七", meta: "成都", year: "2017", heat: 68040, champions: 3481, group: "独立音乐人", label: "摩登天空MDSK" },
      { id: "duihua", title: "对话（老师好）", subtitle: "谢帝", meta: "成都", year: "2014", heat: 67260, champions: 3319, group: "成都集团", label: "成都集团" },
      { id: "after-journey", title: "After Journey", subtitle: "艾福杰尼", meta: "乌鲁木齐", year: "2017", heat: 66510, champions: 3164, group: "DMOB", label: "独立发行" },
      { id: "manta", title: "Manta", subtitle: "刘柏辛Lexie", meta: "长沙", year: "2019", heat: 65780, champions: 3028, group: "NIX", label: "泥鞋文化NIX" },
      { id: "snow-distance", title: "雪 Distance", subtitle: "Capper", meta: "西安", year: "2021", heat: 64920, champions: 2885, group: "独立音乐人", label: "种梦音乐D.M.G" },
      { id: "pao", title: "跑", subtitle: "黄旭", meta: "乌鲁木齐", year: "2017", heat: 64170, champions: 2742, group: "DMOB", label: "独立发行" },
      { id: "payday", title: "Payday", subtitle: "李大奔BENZO", meta: "杭州", year: "2020", heat: 63380, champions: 2596, group: "独立音乐人", label: "摩登天空MDSK" },
      { id: "young-boss", title: "Young Boss 2.0", subtitle: "Lil Ghost小鬼", meta: "北京", year: "2019", heat: 62640, champions: 2461, group: "独立音乐人", label: "果然天空" },
    ],
  },
  {
    id: "kpop",
    name: "K-POP 歌曲巅峰对决",
    shortName: "K-POP",
    eyebrow: "GLOBAL K-POP",
    tagline: "谁是你的本命神曲",
    description: "自由组合偶像团体曲库，或从整个赛区抽出六十四首作品争夺最后的 C 位。",
    theme: "neon",
    entries: [
      { id: "ditto", title: "Ditto", subtitle: "NewJeans", meta: "SEOUL", year: "2022", heat: 99120, champions: 14826, group: "NewJeans", label: "ADOR · HYBE" },
      { id: "dynamite", title: "Dynamite", subtitle: "BTS", meta: "SEOUL", year: "2020", heat: 97540, champions: 13972, group: "BTS", label: "BIGHIT MUSIC · HYBE" },
      { id: "ddu", title: "DDU-DU DDU-DU", subtitle: "BLACKPINK", meta: "SEOUL", year: "2018", heat: 95780, champions: 13105, group: "BLACKPINK", label: "YG Entertainment" },
      { id: "lovedive", title: "LOVE DIVE", subtitle: "IVE", meta: "SEOUL", year: "2022", heat: 92640, champions: 11044, group: "IVE", label: "Starship Entertainment" },
      { id: "supernova", title: "Supernova", subtitle: "aespa", meta: "SEOUL", year: "2024", heat: 91480, champions: 10382, group: "aespa", label: "SM Entertainment" },
      { id: "godsmenu", title: "God's Menu", subtitle: "Stray Kids", meta: "SEOUL", year: "2020", heat: 89220, champions: 9668, group: "Stray Kids", label: "JYP Entertainment" },
      { id: "psycho", title: "Psycho", subtitle: "Red Velvet", meta: "SEOUL", year: "2019", heat: 87360, champions: 8901, group: "Red Velvet", label: "SM Entertainment" },
      { id: "whatlove", title: "What Is Love?", subtitle: "TWICE", meta: "SEOUL", year: "2018", heat: 85140, champions: 8247, group: "TWICE", label: "JYP Entertainment" },
      { id: "gangnam-style", title: "Gangnam Style", subtitle: "PSY", meta: "SEOUL", year: "2012", heat: 84380, champions: 7986, group: "Solo", label: "YG Entertainment" },
      { id: "growl", title: "Growl", subtitle: "EXO", meta: "SEOUL", year: "2013", heat: 83610, champions: 7728, group: "EXO", label: "SM Entertainment" },
      { id: "iam-best", title: "I Am the Best", subtitle: "2NE1", meta: "SEOUL", year: "2011", heat: 82840, champions: 7483, group: "2NE1", label: "YG Entertainment" },
      { id: "gee", title: "Gee", subtitle: "Girls' Generation", meta: "SEOUL", year: "2009", heat: 82070, champions: 7255, group: "Girls' Generation", label: "SM Entertainment" },
      { id: "mirotic", title: "Mirotic", subtitle: "TVXQ!", meta: "SEOUL", year: "2008", heat: 81320, champions: 7012, group: "TVXQ!", label: "SM Entertainment" },
      { id: "replay", title: "Replay", subtitle: "SHINee", meta: "SEOUL", year: "2008", heat: 80590, champions: 6794, group: "SHINee", label: "SM Entertainment" },
      { id: "super-seventeen", title: "Super", subtitle: "SEVENTEEN", meta: "SEOUL", year: "2023", heat: 79860, champions: 6587, group: "SEVENTEEN", label: "PLEDIS · HYBE" },
      { id: "kick-it", title: "Kick It", subtitle: "NCT 127", meta: "SEOUL", year: "2020", heat: 79140, champions: 6378, group: "NCT 127", label: "SM Entertainment" },
      { id: "bite-me", title: "Bite Me", subtitle: "ENHYPEN", meta: "SEOUL", year: "2023", heat: 78420, champions: 6165, group: "ENHYPEN", label: "BELIFT LAB · HYBE" },
      { id: "wannabe", title: "WANNABE", subtitle: "ITZY", meta: "SEOUL", year: "2020", heat: 77690, champions: 5962, group: "ITZY", label: "JYP Entertainment" },
      { id: "hip", title: "HIP", subtitle: "MAMAMOO", meta: "SEOUL", year: "2019", heat: 76980, champions: 5774, group: "MAMAMOO", label: "RBW" },
      { id: "bang-bang-bang", title: "BANG BANG BANG", subtitle: "BIGBANG", meta: "SEOUL", year: "2015", heat: 76270, champions: 5589, group: "BIGBANG", label: "YG Entertainment" },
      { id: "antifragile", title: "ANTIFRAGILE", subtitle: "LE SSERAFIM", meta: "SEOUL", year: "2022", heat: 75540, champions: 5407, group: "LE SSERAFIM", label: "SOURCE MUSIC · HYBE" },
      { id: "bouncy", title: "BOUNCY", subtitle: "ATEEZ", meta: "SEOUL", year: "2023", heat: 74820, champions: 5224, group: "ATEEZ", label: "KQ Entertainment" },
      { id: "sorry-sorry", title: "Sorry, Sorry", subtitle: "SUPER JUNIOR", meta: "SEOUL", year: "2009", heat: 74110, champions: 5048, group: "SUPER JUNIOR", label: "SM Entertainment" },
      { id: "magnetic", title: "Magnetic", subtitle: "ILLIT", meta: "SEOUL", year: "2024", heat: 73420, champions: 4873, group: "ILLIT", label: "BELIFT LAB · HYBE" },
      { id: "love-scenario", title: "LOVE SCENARIO", subtitle: "iKON", meta: "SEOUL", year: "2018", heat: 72750, champions: 4706, group: "iKON", label: "YG Entertainment" },
      { id: "really-really", title: "REALLY REALLY", subtitle: "WINNER", meta: "SEOUL", year: "2017", heat: 72060, champions: 4539, group: "WINNER", label: "YG Entertainment" },
      { id: "step", title: "STEP", subtitle: "KARA", meta: "SEOUL", year: "2011", heat: 71380, champions: 4372, group: "KARA", label: "DSP Media" },
      { id: "roly-poly", title: "Roly-Poly", subtitle: "T-ARA", meta: "SEOUL", year: "2011", heat: 70690, champions: 4205, group: "T-ARA", label: "MBK Entertainment" },
      { id: "tomboy", title: "TOMBOY", subtitle: "(G)I-DLE", meta: "SEOUL", year: "2022", heat: 70010, champions: 4042, group: "(G)I-DLE", label: "CUBE Entertainment" },
      { id: "asap-stayc", title: "ASAP", subtitle: "STAYC", meta: "SEOUL", year: "2021", heat: 69340, champions: 3880, group: "STAYC", label: "High Up Entertainment" },
      { id: "flower", title: "FLOWER", subtitle: "JISOO", meta: "SEOUL", year: "2023", heat: 68680, champions: 3721, group: "BLACKPINK", label: "YG Entertainment" },
      { id: "seven", title: "Seven", subtitle: "Jung Kook", meta: "SEOUL", year: "2023", heat: 68020, champions: 3566, group: "BTS", label: "BIGHIT MUSIC · HYBE" },
    ],
  },
  {
    id: "games",
    name: "游戏巅峰对决",
    shortName: "游戏对比",
    eyebrow: "ULTIMATE GAME BATTLE",
    tagline: "哪款游戏值得封神",
    description: "三十二部跨时代作品正面对决，玩法、世界与记忆只能留下一个。",
    theme: "arcade",
    entries: [
      { id: "wukong", title: "黑神话：悟空", subtitle: "Game Science", meta: "动作角色扮演", year: "2024", heat: 98840, champions: 15420 },
      { id: "eldenring", title: "Elden Ring", subtitle: "FromSoftware", meta: "开放世界", year: "2022", heat: 97180, champions: 14632 },
      { id: "zelda", title: "塞尔达传说：旷野之息", subtitle: "Nintendo", meta: "开放世界", year: "2017", heat: 95360, champions: 13888 },
      { id: "rdr2", title: "Red Dead Redemption 2", subtitle: "Rockstar Games", meta: "西部冒险", year: "2018", heat: 93940, champions: 12746 },
      { id: "minecraft", title: "Minecraft", subtitle: "Mojang", meta: "沙盒创造", year: "2011", heat: 91820, champions: 11539 },
      { id: "bg3", title: "Baldur's Gate 3", subtitle: "Larian Studios", meta: "角色扮演", year: "2023", heat: 89760, champions: 10378 },
      { id: "cyberpunk", title: "Cyberpunk 2077", subtitle: "CD PROJEKT RED", meta: "科幻角色扮演", year: "2020", heat: 87410, champions: 9114 },
      { id: "witcher3", title: "The Witcher 3", subtitle: "CD PROJEKT RED", meta: "奇幻角色扮演", year: "2015", heat: 85670, champions: 8463 },
      { id: "gtav", title: "Grand Theft Auto V", subtitle: "Rockstar Games", meta: "开放世界", year: "2013", heat: 84890, champions: 8218 },
      { id: "tlou", title: "The Last of Us", subtitle: "Naughty Dog", meta: "末日冒险", year: "2013", heat: 84120, champions: 7980 },
      { id: "god-of-war", title: "God of War", subtitle: "Santa Monica Studio", meta: "动作冒险", year: "2018", heat: 83360, champions: 7746 },
      { id: "hades", title: "Hades", subtitle: "Supergiant Games", meta: "动作肉鸽", year: "2020", heat: 82610, champions: 7518 },
      { id: "hollow-knight", title: "Hollow Knight", subtitle: "Team Cherry", meta: "银河恶魔城", year: "2017", heat: 81870, champions: 7294 },
      { id: "portal2", title: "Portal 2", subtitle: "Valve", meta: "解谜", year: "2011", heat: 81140, champions: 7073 },
      { id: "halflife2", title: "Half-Life 2", subtitle: "Valve", meta: "第一人称射击", year: "2004", heat: 80420, champions: 6856 },
      { id: "re4", title: "Resident Evil 4", subtitle: "Capcom", meta: "生存恐怖", year: "2005", heat: 79710, champions: 6643 },
      { id: "ff7", title: "Final Fantasy VII", subtitle: "Square Enix", meta: "角色扮演", year: "1997", heat: 78990, champions: 6432 },
      { id: "persona5", title: "Persona 5 Royal", subtitle: "Atlus", meta: "日式角色扮演", year: "2019", heat: 78280, champions: 6227 },
      { id: "sekiro", title: "Sekiro: Shadows Die Twice", subtitle: "FromSoftware", meta: "动作冒险", year: "2019", heat: 77570, champions: 6024 },
      { id: "darksouls", title: "Dark Souls", subtitle: "FromSoftware", meta: "动作角色扮演", year: "2011", heat: 76860, champions: 5828 },
      { id: "mass-effect2", title: "Mass Effect 2", subtitle: "BioWare", meta: "科幻角色扮演", year: "2010", heat: 76160, champions: 5634 },
      { id: "skyrim", title: "The Elder Scrolls V: Skyrim", subtitle: "Bethesda", meta: "开放世界", year: "2011", heat: 75460, champions: 5442 },
      { id: "disco-elysium", title: "Disco Elysium", subtitle: "ZA/UM", meta: "叙事角色扮演", year: "2019", heat: 74770, champions: 5254 },
      { id: "mario-odyssey", title: "Super Mario Odyssey", subtitle: "Nintendo", meta: "平台跳跃", year: "2017", heat: 74080, champions: 5068 },
      { id: "mario-kart8", title: "Mario Kart 8 Deluxe", subtitle: "Nintendo", meta: "竞速", year: "2017", heat: 73390, champions: 4885 },
      { id: "animal-crossing", title: "Animal Crossing: New Horizons", subtitle: "Nintendo", meta: "生活模拟", year: "2020", heat: 72700, champions: 4704 },
      { id: "overwatch", title: "Overwatch", subtitle: "Blizzard", meta: "团队射击", year: "2016", heat: 72020, champions: 4527 },
      { id: "lol", title: "League of Legends", subtitle: "Riot Games", meta: "多人竞技", year: "2009", heat: 71340, champions: 4352 },
      { id: "cs2", title: "Counter-Strike 2", subtitle: "Valve", meta: "战术射击", year: "2023", heat: 70660, champions: 4179 },
      { id: "fortnite", title: "Fortnite", subtitle: "Epic Games", meta: "大逃杀", year: "2017", heat: 69980, champions: 4008 },
      { id: "stardew", title: "Stardew Valley", subtitle: "ConcernedApe", meta: "农场模拟", year: "2016", heat: 69300, champions: 3839 },
      { id: "civ6", title: "Sid Meier's Civilization VI", subtitle: "Firaxis Games", meta: "回合策略", year: "2016", heat: 68620, champions: 3672 },
    ],
  },
];
