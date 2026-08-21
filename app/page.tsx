"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { competitions, type Competition, type Entry } from "./competition-data";
import musicCatalogData from "./music-catalog.json";
import { collectPoolEntries, drawCrossPoolEntries, drawHeatBiasedEntries } from "./music-draw.js";
import { planMobilePageSwitch } from "./mobile-page-scroll.js";
import { groupEntriesByGroup, groupEntriesByLabel, groupEntriesByMember } from "./roster.js";
import { drawRatingEntries, placeRatingEntry } from "./song-rating.js";
import {
  advanceCustomTournament,
  createCustomTournament,
  getCurrentMatch,
  type CustomTournamentState,
} from "./tournament.js";

const progressKey = (id: string) => `showdown-${id}-v3`;
const championKey = (id: string) => `showdown-${id}-champion-v2`;
const bracketKey = (id: string) => `showdown-${id}-bracket-v1`;
const coverPath = (competitionId: Competition["id"], entryId: string) => `/covers/${competitionId}/${entryId}.webp`;
const coverSrc = (competitionId: Competition["id"], entry: Entry) => entry.cover ?? coverPath(competitionId, entry.id);

type MusicCompetitionId = "hiphop" | "kpop";
type MusicPool = { id: string; name: string; label: string; entries: Entry[] };
type MobilePageId = "leagues" | "battle" | "path" | "rating" | "stats" | "custom";
const mobilePages: { id: MobilePageId; label: string }[] = [
  { id: "leagues", label: "赛区" },
  { id: "battle", label: "对决" },
  { id: "path", label: "签表" },
  { id: "rating", label: "锐评" },
  { id: "stats", label: "统计" },
  { id: "custom", label: "创建" },
];
const mobileViewportQuery = "(max-width: 760px)";
const musicCatalog = musicCatalogData as Record<MusicCompetitionId, MusicPool[]>;
const defaultMusicEntries = Object.fromEntries(
  (["hiphop", "kpop"] as MusicCompetitionId[]).map((id) => [
    id,
    drawCrossPoolEntries(musicCatalog[id], musicCatalog[id].map((pool) => pool.id), 64, () => 0.5),
  ]),
) as Record<MusicCompetitionId, Entry[]>;

export default function Home() {
  const [activeId, setActiveId] = useState<Competition["id"]>("hiphop");
  const [winners, setWinners] = useState<string[]>([]);
  const [submittedChampion, setSubmittedChampion] = useState<string | null>(null);
  const [arena, setArena] = useState<{ id: Competition["id"]; entries: Entry[] }>({ id: "hiphop", entries: defaultMusicEntries.hiphop });
  const [mobilePage, setMobilePage] = useState<MobilePageId>("leagues");
  const mobileScrollPositions = useRef<Partial<Record<MobilePageId, number>>>({});
  const pendingMobileScroll = useRef<number | null>(null);
  const baseActive = competitions.find((item) => item.id === activeId) ?? competitions[0];
  const defaultEntries = activeId === "games" ? baseActive.entries : defaultMusicEntries[activeId];
  const active = { ...baseActive, entries: arena.id === activeId ? arena.entries : defaultEntries };
  const totalMatches = active.entries.length - 1;
  const match = getCurrentMatch(active.entries.map((entry) => entry.id), winners);

  useLayoutEffect(() => {
    if (pendingMobileScroll.current === null) return;
    window.scrollTo({ top: pendingMobileScroll.current, behavior: "auto" });
    pendingMobileScroll.current = null;
  }, [mobilePage]);

  useEffect(() => {
    try {
      const available = new Map([
        ...baseActive.entries,
        ...(activeId === "games" ? [] : musicCatalog[activeId].flatMap((pool) => pool.entries)),
      ].map((entry) => [entry.id, entry]));
      const savedBracket = JSON.parse(localStorage.getItem(bracketKey(activeId)) ?? "[]");
      const restored = Array.isArray(savedBracket) ? savedBracket.map((id) => available.get(id)).filter((entry): entry is Entry => Boolean(entry)) : [];
      setArena({ id: activeId, entries: restored.length === 64 ? restored : defaultEntries });
      const saved = JSON.parse(localStorage.getItem(progressKey(activeId)) ?? "[]");
      const restoredMatches = (restored.length === 64 ? restored.length : defaultEntries.length) - 1;
      setWinners(Array.isArray(saved) ? saved.slice(0, restoredMatches) : []);
      setSubmittedChampion(localStorage.getItem(championKey(activeId)));
    } catch {
      setWinners([]);
      setSubmittedChampion(null);
    }
  }, [activeId, baseActive, defaultEntries]);

  function choose(entry: Entry) {
    const next = [...winners, entry.id].slice(0, totalMatches);
    setWinners(next);
    localStorage.setItem(progressKey(activeId), JSON.stringify(next));
    if (next.length === totalMatches && !localStorage.getItem(championKey(activeId))) {
      localStorage.setItem(championKey(activeId), entry.id);
      setSubmittedChampion(entry.id);
    }
  }

  function selectCompetition(id: Competition["id"]) {
    setActiveId(id);
    openMobilePage("battle");
    scrollToBattleOnDesktop();
  }

  function openMobilePage(pageId: MobilePageId) {
    if (!window.matchMedia(mobileViewportQuery).matches) {
      setMobilePage(pageId);
      return;
    }

    const next = planMobilePageSwitch(mobilePage, pageId, window.scrollY, mobileScrollPositions.current);
    if (!next.changed) return;

    mobileScrollPositions.current = next.positions;
    pendingMobileScroll.current = next.targetScrollY;
    setMobilePage(pageId);
  }

  function scrollToBattleOnDesktop() {
    if (window.matchMedia(mobileViewportQuery).matches) return;
    requestAnimationFrame(() => document.querySelector("#battle")?.scrollIntoView({ behavior: "smooth" }));
  }

  function resetShowdown() {
    setWinners([]);
    setSubmittedChampion(null);
    openMobilePage("battle");
    localStorage.removeItem(progressKey(activeId));
    localStorage.removeItem(championKey(activeId));
    scrollToBattleOnDesktop();
  }

  function startMusicDraw(entries: Entry[]) {
    setArena({ id: activeId, entries });
    setWinners([]);
    setSubmittedChampion(null);
    localStorage.setItem(bracketKey(activeId), JSON.stringify(entries.map((entry) => entry.id)));
    localStorage.removeItem(progressKey(activeId));
    localStorage.removeItem(championKey(activeId));
    scrollToBattleOnDesktop();
  }

  const pair = !match.finished
    ? match.pair.map((id) => active.entries.find((entry) => entry.id === id)!)
    : null;
  const champion = match.finished
    ? active.entries.find((entry) => entry.id === match.championId) ?? null
    : null;

  return (
    <main className={`site-shell theme-${active.theme}`}>
      <nav className="topbar" aria-label="主导航">
        <a className="brand" href="#arena" aria-label="万物对决首页">
          <span className="brand-mark">决</span>
          <span>SHOWDOWN<br /><strong>万物对决</strong></span>
        </a>
        <div className="nav-links">
          <a href="#leagues">官方赛区</a>
          <a href="#custom">自定义</a>
        </div>
        <div className="live-chip"><i /> 3 个赛区开放中</div>
      </nav>

      <div className={`mobile-page ${mobilePage === "leagues" ? "active" : ""}`} data-mobile-page="leagues">
        <section className="platform-hero" id="arena">
          <p className="kicker">PICK A SIDE · CROWN YOUR CHAMPION</p>
          <h1>万物皆可<br /><em>对决</em></h1>
          <div className="platform-intro">
            <p>音乐、游戏，以及所有你争论不休的选择。</p>
            <span>选择下方赛区开始 ↓</span>
          </div>
        </section>

        <section className="league-section" id="leagues">
          <div className="league-heading">
            <span>OFFICIAL LEAGUES / 03</span>
            <h2>选择你的赛场</h2>
          </div>
          <div className="league-grid">
            {competitions.map((competition, index) => (
              <button
                type="button"
                className={`league-card ${competition.theme} ${activeId === competition.id ? "active" : ""}`}
                onClick={() => selectCompetition(competition.id)}
                key={competition.id}
              >
                <span className="league-index">0{index + 1}</span>
                <p>{competition.eyebrow}</p>
                <h3>{competition.shortName}</h3>
                <small>{competition.description}</small>
                <b>进入赛区 ↗</b>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className={`mobile-page ${mobilePage === "battle" ? "active" : ""}`} data-mobile-page="battle">
        <section className="hero" id="battle">
        <div className="competition-switcher" aria-label="切换官方赛区">
          {competitions.map((competition) => (
            <button
              type="button"
              aria-pressed={activeId === competition.id}
              onClick={() => setActiveId(competition.id)}
              key={competition.id}
            >
              {competition.shortName}
            </button>
          ))}
        </div>

        <div className="hero-copy">
          <p className="kicker">{active.eyebrow}</p>
          <h1>{active.tagline}</h1>
          <p className="intro">{active.description}</p>
        </div>

        {active.id !== "games" && <MusicPoolSelector competitionId={active.id} onDraw={startMusicDraw} />}

        <div className="round-line">
          <span>{match.finished ? "赛事完成" : match.round}</span>
          <b>{Math.min(winners.length + 1, totalMatches).toString().padStart(2, "0")} / {totalMatches}</b>
          <span>{winners.length} / {totalMatches} 场已完成</span>
        </div>

        <div className="battle-stage" aria-live="polite">
          {pair && (
            <>
              <EntryCard competitionId={active.id} side="red" entry={pair[0]} onChoose={choose} />
              <div className="versus" aria-hidden="true"><span>V</span><span>S</span></div>
              <EntryCard competitionId={active.id} side="blue" entry={pair[1]} onChoose={choose} />
            </>
          )}
          {champion && (
            <div className="champion-stage">
              <small>YOUR CHAMPION</small>
              <img className="champion-artwork" src={coverSrc(active.id, champion)} alt={`${champion.title} 封面`} />
              <span className="champion-crown">♛</span>
              <strong>{champion.title}</strong>
              <p>{champion.subtitle}</p>
              <div>
                <b>{(champion.champions + (submittedChampion === champion.id ? 1 : 0)).toLocaleString("zh-CN")}</b>
                <span>位玩家也把 TA 选为冠军</span>
              </div>
              <button type="button" onClick={resetShowdown}>重新开赛 ↺</button>
            </div>
          )}
        </div>
        </section>

        <section className="score-strip" aria-label="赛事摘要">
          <div><b>{active.entries.length}</b><span>入围内容</span></div>
          <div><b>{winners.length.toString().padStart(2, "0")}</b><span>已完成选择</span></div>
          <div><b>01</b><span>最终冠军</span></div>
        </section>
      </div>

      <div className={`mobile-page ${mobilePage === "path" ? "active" : ""}`} data-mobile-page="path">
        <Bracket active={active} winners={winners} />
        {active.id !== "games" && <MusicRoster active={active} />}
      </div>

      <div className={`mobile-page ${mobilePage === "rating" ? "active" : ""}`} data-mobile-page="rating">
        {active.id !== "games"
          ? <SongRatingBoard active={active} key={`${active.id}:${active.entries.map((entry) => entry.id).join(".")}`} />
          : <section className="mobile-empty"><b>锐评</b><h2>歌曲锐评仅在音乐赛区开放</h2><button type="button" onClick={() => openMobilePage("leagues")}>返回选择音乐赛区</button></section>}
      </div>

      <div className={`mobile-page ${mobilePage === "stats" ? "active" : ""}`} data-mobile-page="stats">
        <ChampionStats active={active} submittedChampion={submittedChampion} />
      </div>

      <div className={`mobile-page ${mobilePage === "custom" ? "active" : ""}`} data-mobile-page="custom">
        <section className="custom-section" id="custom">
          <div className="custom-copy">
            <p>BUILD YOUR OWN</p>
            <h2>创建我的对决</h2>
            <span>把朋友间争论不休的话题，变成一场真正的淘汰赛。自定义赛事只保存在你的浏览器，不参与官方统计。</span>
          </div>
          <CustomBuilder />
        </section>

        <footer>
          <div><span className="brand-mark">决</span><p>SHOWDOWN ARENA · 本地 Demo<br />统计数字为模拟数据，不代表真实用户结果</p></div>
          <button type="button" onClick={resetShowdown}>重置当前赛区 ↺</button>
        </footer>
      </div>

      <nav className="mobile-page-nav" aria-label="手机页面导航">
        {mobilePages.map((page) => (
          <button
            className={`mobile-nav-button ${mobilePage === page.id ? "active" : ""}`}
            type="button"
            aria-pressed={mobilePage === page.id}
            onClick={() => openMobilePage(page.id)}
            key={page.id}
          >
            <span>{page.label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}

function MusicPoolSelector({ competitionId, onDraw }: { competitionId: MusicCompetitionId; onDraw: (entries: Entry[]) => void }) {
  const pools = musicCatalog[competitionId];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openPoolId, setOpenPoolId] = useState(pools[0].id);
  const selectedEntries = useMemo(() => collectPoolEntries(pools, selectedIds), [pools, selectedIds]);
  const allEntries = useMemo(() => collectPoolEntries(pools, pools.map((pool) => pool.id)), [pools]);
  const openPool = pools.find((pool) => pool.id === openPoolId) ?? pools[0];
  const groupWord = competitionId === "kpop" ? "团体" : "厂牌";
  const selectorDescription = `选择多个${groupWord}合并歌池进行 PK，第一赛段优先安排跨${groupWord}对决，并偏向抽取热度较高的歌曲。`;
  const missing = Math.max(0, 64 - selectedEntries.length);

  useEffect(() => {
    setSelectedIds([]);
    setOpenPoolId(pools[0].id);
  }, [competitionId, pools]);

  function togglePool(id: string) {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <section className="pool-selector" aria-labelledby="pool-selector-title">
      <header>
        <div><span>BUILD THE DRAW</span><h2 id="pool-selector-title">组建 64 强</h2></div>
        <p>{selectorDescription}</p>
      </header>
      <div className="pool-options">
        {pools.map((pool) => (
          <article className="pool-option" key={pool.id}>
            <button
              className="pool-select"
              type="button"
              aria-pressed={selectedIds.includes(pool.id)}
              onClick={() => togglePool(pool.id)}
            >
              <span>{pool.label}</span>
              <strong>{pool.name}</strong>
              <b>{pool.entries.length} 首</b>
            </button>
            <button
              className="pool-view"
              type="button"
              aria-pressed={openPool.id === pool.id}
              onClick={() => setOpenPoolId(pool.id)}
            >
              {openPool.id === pool.id ? "正在查看" : "查看歌单"} ↘
            </button>
          </article>
        ))}
      </div>
      <PoolTrackList competitionId={competitionId} pool={openPool} />
      <div className="pool-actions">
        <p aria-live="polite">
          已选 {selectedIds.length} 个{groupWord} · {selectedEntries.length} 首可用
          {missing > 0 ? ` · 还差 ${missing} 首可组成 64 强` : " · 可以开始抽签"}
        </p>
        <div>
          <button type="button" disabled={selectedEntries.length < 64} onClick={() => onDraw(drawCrossPoolEntries(pools, selectedIds, 64))}>从所选歌池抽取 64 首</button>
          <button type="button" onClick={() => onDraw(drawHeatBiasedEntries(allEntries, 64))}>全赛区热门优先 64 首</button>
        </div>
      </div>
    </section>
  );
}

function PoolTrackList({ competitionId, pool }: { competitionId: MusicCompetitionId; pool: MusicPool }) {
  const groups = competitionId === "hiphop"
    ? groupEntriesByMember(pool.entries)
    : [{ label: pool.name, entries: pool.entries }];

  return (
    <details className="pool-catalog">
      <summary>
        <div><span>完整曲库</span><h3>{pool.name}</h3></div>
        <p>{pool.name} · {pool.entries.length} 首</p>
        <b><span className="when-closed">展开歌单 ↓</span><span className="when-open">收起歌单 ↑</span></b>
      </summary>
      <div className="pool-catalog-body" aria-live="polite">
        {groups.map((group) => (
          <section className="pool-artist" key={group.label}>
            {competitionId === "hiphop" && <h4>{group.label}<span>{group.entries.length} 首</span></h4>}
            <div className="pool-track-grid">
              {group.entries.map((entry) => (
                <article className="pool-track" key={entry.id}>
                  <img loading="lazy" src={coverSrc(competitionId, entry)} alt={`${entry.title} 封面`} />
                  <div><strong>{entry.title}</strong><span>{entry.subtitle}</span></div>
                  <small>{entry.year}</small>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </details>
  );
}

function MusicRoster({ active }: { active: Competition }) {
  const groupByAct = active.id === "kpop";
  const groups = groupByAct ? groupEntriesByGroup(active.entries) : groupEntriesByLabel(active.entries);

  return (
    <section className="roster-section">
      <details className="roster-details">
        <summary className="section-heading">
          <div>
            <p>{groupByAct ? "GROUP DIRECTORY" : "LABEL & GROUP DIRECTORY"}</p>
            <h2>参赛阵容</h2>
          </div>
          <p>{groupByAct ? `按团体组合查看本次签表的 ${active.entries.length} 首歌曲。` : `按厂牌与团体查看本次签表的 ${active.entries.length} 首歌曲。`}</p>
          <span className="collapse-cue"><b className="when-closed">展开阵容 ↓</b><b className="when-open">收起阵容 ↑</b></span>
        </summary>

        <div className="roster-groups">
          {groups.map((group) => (
            <article className="roster-group" key={group.label}>
              <header>
                <div><span>{groupByAct ? "团体 / GROUP" : "厂牌 / LABEL"}</span><h3>{group.label}</h3></div>
                <b>{group.entries.length.toString().padStart(2, "0")}</b>
              </header>
              <div className="roster-list">
                {groupByAct ? group.entries.map((entry) => (
                  <RosterSong active={active} entry={entry} detail={entry.label} key={entry.id} />
                )) : groupEntriesByMember(group.entries).map((member) => (
                  <section className="roster-member" key={member.label}>
                    <header><span>个人 / ARTIST</span><strong>{member.label}</strong><b>{member.entries.length} 首</b></header>
                    {member.entries.map((entry) => <RosterSong active={active} entry={entry} detail={entry.year} key={entry.id} />)}
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      </details>
    </section>
  );
}

function RosterSong({ active, entry, detail }: { active: Competition; entry: Entry; detail?: string }) {
  return (
    <div className="roster-song">
      <img src={coverSrc(active.id, entry)} alt="" loading="lazy" />
      <div>
        <strong>{entry.title}</strong>
        <span>{entry.subtitle}</span>
      </div>
      <small>{detail}</small>
    </div>
  );
}

const ratingTiers = [
  { id: "unrated", label: "待评价", note: "把歌曲拖到下方任意档位" },
  { id: "hang", label: "夯", note: "循环到停不下来" },
  { id: "top", label: "顶级", note: "没得挑，直接进歌单" },
  { id: "human", label: "人上人", note: "好听，有点东西" },
  { id: "npc", label: "NPC", note: "能听，但记不太住" },
  { id: "lame", label: "拉完了", note: "这次真不行" },
] as const;

type RatingTierId = typeof ratingTiers[number]["id"];

function SongRatingBoard({ active }: { active: Competition }) {
  const initialSongs = () => drawRatingEntries(active.entries, 10, () => 0.5) as Entry[];
  const [songs, setSongs] = useState<Entry[]>(initialSongs);
  const [placements, setPlacements] = useState<Record<string, RatingTierId>>(
    () => Object.fromEntries(initialSongs().map((entry) => [entry.id, "unrated"])) as Record<string, RatingTierId>,
  );

  function drawSongs(random = Math.random) {
    const next = drawRatingEntries(active.entries, 10, random) as Entry[];
    setSongs(next);
    setPlacements(Object.fromEntries(next.map((entry) => [entry.id, "unrated"])) as Record<string, RatingTierId>);
  }

  function moveSong(entryId: string, tierId: RatingTierId) {
    if (!songs.some((entry) => entry.id === entryId)) return;
    setPlacements((current) => placeRatingEntry(current, entryId, tierId));
  }

  return (
    <section className="rating-section" aria-labelledby="rating-title">
      <header className="rating-heading">
        <div><p>DRAG · DROP · JUDGE</p><h2 id="rating-title">锐评：从夯到拉</h2></div>
        <div className="rating-intro">
          <p>把 10 首歌拖进你的评价区。手机端也可以用卡片里的档位选择。</p>
          <button type="button" onClick={() => drawSongs()}>换一批 10 首 ↻</button>
        </div>
      </header>

      <div className="rating-board">
        {ratingTiers.map((tier, tierIndex) => {
          const tierSongs = songs.filter((entry) => placements[entry.id] === tier.id);
          return (
            <section
              className={`rating-zone tier-${tier.id}`}
              aria-label={`${tier.label}评价区`}
              onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "move"; }}
              onDrop={(event) => {
                event.preventDefault();
                moveSong(event.dataTransfer.getData("text/plain"), tier.id);
              }}
              key={tier.id}
            >
              <header><b>{tierIndex === 0 ? "—" : tierIndex.toString().padStart(2, "0")}</b><strong>{tier.label}</strong><span>{tier.note}</span><i>{tierSongs.length}</i></header>
              <div className="rating-zone-tracks">
                {tierSongs.map((entry) => (
                  <article
                    className="rating-song"
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", entry.id);
                    }}
                    key={entry.id}
                  >
                    <img src={coverSrc(active.id, entry)} alt="" loading="lazy" />
                    <div><strong>{entry.title}</strong><span>{entry.subtitle}</span></div>
                    <label>
                      <span>移动到</span>
                      <select value={placements[entry.id]} onChange={(event) => moveSong(entry.id, event.target.value as RatingTierId)} aria-label={`将 ${entry.title} 移动到`}>
                        {ratingTiers.map((option) => <option value={option.id} key={option.id}>{option.label}</option>)}
                      </select>
                    </label>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <p className="rating-status" aria-live="polite">已评价 {songs.filter((entry) => placements[entry.id] !== "unrated").length} / 10 首</p>
    </section>
  );
}

function CustomBuilder() {
  const [title, setTitle] = useState("我的巅峰对决");
  const [draft, setDraft] = useState("");
  const [entries, setEntries] = useState<string[]>([]);
  const [tournament, setTournament] = useState<CustomTournamentState | null>(null);
  const [message, setMessage] = useState("添加 2–32 个参赛项，即刻开赛");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("showdown-custom-v2") ?? "null");
      if (saved?.title && Array.isArray(saved.entries)) {
        setTitle(saved.title);
        setEntries(saved.entries.slice(0, 32));
        if (saved.tournament?.roundNumber) setTournament(saved.tournament);
      }
    } catch {
      localStorage.removeItem("showdown-custom-v2");
    }
  }, []);

  function addEntry() {
    const value = draft.trim();
    if (!value || entries.includes(value) || entries.length >= 32) return;
    setEntries((current) => [...current, value]);
    setDraft("");
    setMessage("继续添加，或直接生成比赛");
  }

  function create(event: React.FormEvent) {
    event.preventDefault();
    if (entries.length < 2) {
      setMessage("至少添加 2 个参赛项");
      return;
    }
    const next = createCustomTournament(entries);
    setTournament(next);
    setMessage("本地赛事已生成 · 不参与官方统计");
    localStorage.setItem("showdown-custom-v2", JSON.stringify({ title, entries, tournament: next }));
  }

  function pickCustom(winner: string) {
    if (!tournament) return;
    const next = advanceCustomTournament(tournament, winner);
    setTournament(next);
    localStorage.setItem("showdown-custom-v2", JSON.stringify({ title, entries, tournament: next }));
  }

  function clearCustom() {
    setEntries([]);
    setTournament(null);
    setMessage("添加 2–32 个参赛项，即刻开赛");
    localStorage.removeItem("showdown-custom-v2");
  }

  return (
    <form className="custom-builder" id="custom-builder" onSubmit={create}>
      <label htmlFor="custom-title">赛事名称</label>
      <input id="custom-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={30} />
      <label htmlFor="custom-entry">参赛项 · {entries.length}/32</label>
      <div className="custom-entry-row">
        <input
          id="custom-entry"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="例如：电影、游戏、歌曲…"
          maxLength={36}
        />
        <button type="button" onClick={addEntry}>添加参赛项</button>
      </div>
      <div className="custom-tags">
        {entries.map((entry) => (
          <button type="button" onClick={() => setEntries((items) => items.filter((item) => item !== entry))} key={entry}>
            {entry} <span>×</span>
          </button>
        ))}
      </div>
      <p aria-live="polite">{message}</p>

      {!tournament && <button className="create-button" type="submit">生成本地对决 ↗</button>}

      {tournament?.currentPair && (
        <div className="custom-duel" aria-live="polite">
          <small>{title} · 第 {tournament.roundNumber} 轮</small>
          <button type="button" onClick={() => pickCustom(tournament.currentPair![0])}>{tournament.currentPair[0]}</button>
          <b>VS</b>
          <button type="button" onClick={() => pickCustom(tournament.currentPair![1])}>{tournament.currentPair[1]}</button>
        </div>
      )}

      {tournament?.championId && (
        <div className="custom-winner">
          <small>你的冠军</small>
          <strong>{tournament.championId}</strong>
          <span>自定义赛事不参与官方统计</span>
        </div>
      )}

      {(entries.length > 0 || tournament) && <button className="clear-custom" type="button" onClick={clearCustom}>清空自定义赛事</button>}
    </form>
  );
}

function EntryCard({ competitionId, entry, side, onChoose }: { competitionId: Competition["id"]; entry: Entry; side: "red" | "blue"; onChoose: (entry: Entry) => void }) {
  const [previewFailed, setPreviewFailed] = useState(false);

  useEffect(() => setPreviewFailed(false), [entry.id]);

  return (
    <article className={`song-card ${side}`}>
      <div className="card-topline"><span>{side === "red" ? "左方" : "右方"} · {entry.meta}</span><span>{entry.year}</span></div>
      <div className="record">
        <img src={coverSrc(competitionId, entry)} alt={`${entry.title} 封面`} />
        <span className="record-gloss" aria-hidden="true" />
      </div>
      <div className="song-copy"><p>{entry.subtitle}</p><h2>{entry.title}</h2><span>赛区热度 {entry.heat.toLocaleString("zh-CN")}</span></div>
      {competitionId !== "games" && entry.playUrl && (
        <div className="track-preview">
          <span>试听片段</span>
          {entry.previewUrl && !previewFailed
            ? <audio
                controls
                preload="none"
                data-default-volume="0.35"
                ref={(audio) => { if (audio) audio.volume = 0.35; }}
                src={entry.previewUrl}
                onError={() => setPreviewFailed(true)}
                aria-label={`${entry.title} 试听片段`}
              />
            : <small>{previewFailed ? "片段加载失败" : "暂无官方片段"}</small>}
          <a href={entry.playUrl} target="_blank" rel="noreferrer">官方页面播放 ↗</a>
        </div>
      )}
      <button type="button" onClick={() => onChoose(entry)}><span>选 TA 晋级</span><b>↗</b></button>
    </article>
  );
}

function Bracket({ active, winners }: { active: Competition; winners: string[] }) {
  const byId = (id?: string) => active.entries.find((entry) => entry.id === id);
  const rounds = [];
  let matchesInRound = active.entries.length / 2;
  let winnerOffset = 0;

  while (matchesInRound >= 1) {
    const entrants = matchesInRound * 2;
    const label = entrants === 2 ? "冠军" : entrants === 4 ? "半决赛" : entrants === 8 ? "八强赛" : `${entrants}强赛`;
    rounds.push({ label, slots: matchesInRound, winnerOffset });
    winnerOffset += matchesInRound;
    matchesInRound /= 2;
  }

  return (
    <section className="bracket-section">
      <header className="section-heading">
        <div><p>TOURNAMENT PATH</p><h2>冠军之路</h2></div>
        <p>{active.entries.length} 强到最终冠军，共 {rounds.length} 轮。横向查看每一轮的晋级结果。</p>
      </header>
      <div className="tournament-path" style={{ gridTemplateColumns: `repeat(${rounds.length}, minmax(190px, 1fr))` }}>
        {rounds.map((round, roundIndex) => (
          <div className={`path-column ${round.slots === 1 ? "final" : ""}`} key={round.label}>
            <span>{round.label} · {round.slots.toString().padStart(2, "0")}</span>
            {Array.from({ length: round.slots }, (_, index) => (
              <b key={index}>{byId(winners[round.winnerOffset + index])?.title ?? (round.slots === 1 ? "等待加冕" : `第 ${index + 1} 场待定`)}</b>
            ))}
            {roundIndex < rounds.length - 1 && <i aria-hidden="true">→</i>}
          </div>
        ))}
      </div>
    </section>
  );
}

function ChampionStats({ active, submittedChampion }: { active: Competition; submittedChampion: string | null }) {
  const ranked = useMemo(
    () => [...active.entries].sort((a, b) => b.champions - a.champions),
    [active],
  );
  const max = ranked[0].champions;
  return (
    <section className="ranking-section">
      <header className="section-heading">
        <div><p>DEMO CHAMPION PICKS</p><h2>冠军选择统计</h2></div>
        <p>Demo 模拟数据 · 展示未来匿名汇总“有多少用户把它选为冠军”的统计方式。</p>
      </header>
      <div className="ranking-list">
        {ranked.map((entry, index) => {
          const value = entry.champions + (submittedChampion === entry.id ? 1 : 0);
          return (
            <div className="rank-row" key={entry.id}>
              <span className="rank-number">{(index + 1).toString().padStart(2, "0")}</span>
              <img className="rank-cover" src={coverSrc(active.id, entry)} alt="" loading="lazy" />
              <div className="rank-copy"><b>{entry.title}</b><span>{entry.subtitle}</span></div>
              <div className="heat-bar"><i style={{ width: `${(value / max) * 100}%` }} /></div>
              <strong>{value.toLocaleString("zh-CN")} 冠军</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}
