import { useEffect, useRef, useState } from "react";

/* ---------- Edit your details here ---------- */
const SITE = {
  groom: { name: "Sahad", parents: "Abdul Majeed & K M Fathima" },
  bride: { name: "Fathimath Thamseera", parents: "Mohammed & Zubaida" },
  date: "2026-12-31T00:00:00",
  time: "", // e.g. "11:00 AM" (shown only when filled)
  venue: "Golden Gate Santyaru",
  address: "Santyar, Panaje, near Puttur, Karnataka, India",
  mapUrl: "https://maps.app.goo.gl/TdGLy1K7eDyLE8536?g_st=iwb",
  whatsapp: "919980340288", // RSVP number with country code, e.g. "919XXXXXXXXX" (button hidden if empty)
  photo: "", // optional couple photo, e.g. "/couple.jpg"
  song: "/bg-music.mp3", // put your audio file in /public
};

const NAV = [
  ["home", "Home"], ["families", "Families"], ["event", "Event"], ["venue", "Venue"], ["join", "Join us"],
];
const PATTERN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23c9a84c' stroke-opacity='0.16'%3E%3Crect x='20' y='20' width='40' height='40'/%3E%3Crect x='20' y='20' width='40' height='40' transform='rotate(45 40 40)'/%3E%3C/g%3E%3C/svg%3E")`;
const css = `
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,500&display=swap');
html{scroll-behavior:smooth}
.f-serif{font-family:'Cormorant Garamond',Georgia,serif}
.f-ar{font-family:'Amiri','Noto Naskh Arabic',serif}
@keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.rise{animation:rise 1.2s ease-out both}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}.rise{animation:none}*{transition:none!important}}
`;
const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e6c86e]";
const btnGold = `inline-block rounded-full bg-[#c9a84c] px-8 py-3 text-lg font-semibold text-[#062419] transition hover:bg-[#e6c86e] ${focus}`;
const btnLine = `inline-block rounded-full border border-[#c9a84c] px-8 py-3 text-lg transition hover:bg-[#c9a84c] hover:text-[#062419] ${focus}`;

function useCountdown(target) {
  const calc = () => {
    const d = Math.max(0, new Date(target) - new Date());
    return { days: Math.floor(d / 864e5), hours: Math.floor(d / 36e5) % 24, minutes: Math.floor(d / 6e4) % 60, seconds: Math.floor(d / 1e3) % 60 };
  };
  const [t, setT] = useState(calc);
  useEffect(() => { const id = setInterval(() => setT(calc()), 1000); return () => clearInterval(id); }, [target]);
  return t;
}

const Heading = ({ children, light }) => (
  <div className="mb-10 text-center">
    <h2 className={`text-5xl italic ${light ? "text-[#8a6d1f]" : "text-[#e6c86e]"}`}>{children}</h2>
    <span className="mx-auto mt-3 block h-px w-24 bg-[#c9a84c]" />
  </div>
);

export default function NikkahWebsite() {
  const [menu, setMenu] = useState(false);
  const [playing, setPlaying] = useState(true);
  const audioRef = useRef(null);
  const left = useCountdown(SITE.date);
  const when = new Date(SITE.date);
  const dateText = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(when);
  const title = `Nikkah of ${SITE.groom.name} & ${SITE.bride.name}`;

  const toggleSong = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.7;

    // Try playing immediately when opened
    a.play()
      .then(() => setPlaying(true))
      .catch(() => {
        // If autoplay is prevented by browser policy, play on first user interaction
        setPlaying(false);

        const events = ["click", "touchstart", "scroll", "keydown", "pointerdown"];
        const handleFirstInteraction = () => {
          if (a.paused) {
            a.play().then(() => setPlaying(true)).catch(() => {});
          }
          events.forEach((evt) => {
            window.removeEventListener(evt, handleFirstInteraction, true);
          });
        };

        events.forEach((evt) => {
          window.addEventListener(evt, handleFirstInteraction, { capture: true, once: true });
        });

        console.log("touch start");
        
      });
  }, []);

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=20261231/20270101&location=${encodeURIComponent(SITE.venue + ", " + SITE.address)}`;
  const shareUrl = () => `https://wa.me/?text=${encodeURIComponent(`${title} - ${dateText}\n${window.location.href}`)}`;
  const rsvpUrl = () => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Assalamu alaikum, I would like to confirm my attendance at the nikkah of ${SITE.groom.name} & ${SITE.bride.name}.`)}`;

  return (
    <div className={`f-serif bg-[#0a3428] text-[#f4ecd8] min-h-screen`}>
      <style>{css}</style>
      <audio
        ref={audioRef}
        src={SITE.song}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* Top navigation */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#c9a84c]/30 bg-[#062419]/90 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <a href="#home" className={`text-2xl italic text-[#e6c86e] ${focus}`}>{SITE.groom.name} &amp; {SITE.bride.name.split(" ")[1]}</a>
          <ul className="hidden gap-8 text-lg md:flex">
            {NAV.map(([id, label]) => (<li key={id}><a href={`#${id}`} className={`hover:text-[#e6c86e] ${focus}`}>{label}</a></li>))}
          </ul>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSong}
              aria-label={playing ? "Pause music" : "Play music"}
              title={playing ? "Pause music" : "Play music"}
              className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a84c] text-[#e6c86e] transition hover:bg-[#c9a84c]/20 ${focus}`}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5 opacity-60" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              )}
            </button>
            <button onClick={() => setMenu(!menu)} aria-label="Menu" aria-expanded={menu} className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#c9a84c] text-[#e6c86e] md:hidden ${focus}`}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d={menu ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} /></svg>
            </button>
          </div>
        </nav>
        {menu && (
          <ul className="border-t border-[#c9a84c]/30 px-5 py-2 text-xl md:hidden">
            {NAV.map(([id, label]) => (<li key={id}><a href={`#${id}`} onClick={() => setMenu(false)} className="block py-2">{label}</a></li>))}
          </ul>
        )}
      </header>
      <div className="absolute inset-0 z-0 top-0 left-0 h-full w-full opacity-40" style={{ backgroundImage: "url(/homebg.jpeg)", backgroundPosition: "center top", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}></div>
      <main className="rise">
        {/* Home */}
        <section id="home" className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-16 pt-28 text-center" style={{ backgroundImage: PATTERN }}>
          <p lang="ar" dir="rtl" className="f-ar text-3xl leading-loose text-[#e6c86e]">{BISMILLAH}</p>
          {SITE.photo && <img src={SITE.photo} alt={`${SITE.groom.name} and ${SITE.bride.name}`} className="mt-6 h-56 w-56 rounded-t-full border-2 border-[#c9a84c] object-cover" />}
          <p className="mt-6 text-xl text-[#f4ecd8]/80">The nikkah of</p>
          <h1 className="mt-2 text-6xl italic text-[#e6c86e] sm:text-8xl">{SITE.groom.name}</h1>
          <p className="my-1 text-3xl italic text-[#c9a84c]">&amp;</p>
          <h1 className="text-5xl italic text-[#e6c86e] sm:text-7xl">{SITE.bride.name}</h1>
          <p className="mt-8 text-2xl">{dateText}</p>
          <p className="text-lg text-[#f4ecd8]/70">{SITE.venue}, Puttur</p>
          <div className="mt-8 grid w-full max-w-sm grid-cols-4 gap-3">
            {Object.entries(left).map(([label, value]) => (
              <div key={label} className="rounded-md border border-[#c9a84c]/40 bg-[#062419]/60 py-3">
                <div className="text-3xl tabular-nums">{String(value).padStart(2, "0")}</div>
                <div className="text-sm text-[#f4ecd8]/70">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#venue" className={btnGold}>View venue</a>
            <a href="#join" className={btnLine}>Join us</a>
          </div>
        </section>

        {/* Families */}
        <section id="families" className="scroll-mt-16 bg-[#f6efdc] px-6 py-20 text-[#0a3428]">
          <Heading light>The families</Heading>
          <div className="mx-auto max-w-md text-center">
            <p lang="ar" dir="rtl" className="f-ar text-2xl leading-loose">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً</p>
            <p className="mt-3 text-lg italic">Among His signs is that He created mates for you from yourselves, so that you may find tranquility in them, and He placed between you affection and mercy. (Ar-Rum 30:21)</p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
            {[["The groom", SITE.groom, "Son of"], ["The bride", SITE.bride, "Daughter of"]].map(([role, p, rel]) => (
              <div key={role} className="rounded-t-full border border-[#8a6d1f]/60 p-2">
                <div className="rounded-t-full border border-[#8a6d1f] px-6 pb-10 pt-16 text-center">
                  <p className="text-lg text-[#8a6d1f]">{role}</p>
                  <h3 className="mt-1 text-4xl italic">{p.name}</h3>
                  <p className="mt-4 text-lg">{rel}</p>
                  <p className="text-xl">{p.parents}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Event */}
        <section id="event" className="scroll-mt-16 px-6 py-20" style={{ backgroundImage: PATTERN }}>
          <Heading>The event</Heading>
          <div className="mx-auto max-w-xl rounded-lg border border-[#c9a84c]/60 bg-[#062419]/70 p-8 text-center">
            <h3 className="text-3xl italic text-[#e6c86e]">Nikkah ceremony</h3>
            <p className="mt-4 text-2xl">{dateText}</p>
            {SITE.time && <p className="mt-1 text-xl">{SITE.time}</p>}
            <p className="mt-1 text-lg text-[#f4ecd8]/75">{SITE.venue}</p>
            <a href={calendarUrl} target="_blank" rel="noreferrer" className={`mt-6 ${btnLine}`}>Add to calendar</a>
          </div>
        </section>

        {/* Venue */}
        <section id="venue" className="scroll-mt-16 bg-[#f6efdc] px-6 py-20 text-center text-[#0a3428]">
          <Heading light>Venue</Heading>
          <p className="text-3xl">{SITE.venue}</p>
          <p className="mx-auto mt-2 max-w-sm text-xl">{SITE.address}</p>
          <a href={SITE.mapUrl} target="_blank" rel="noreferrer" className={`mt-8 ${btnGold}`}>Open in Maps</a>
        </section>

        {/* Join us */}
        <section id="join" className="scroll-mt-16 px-6 py-20 text-center" style={{ backgroundImage: PATTERN }}>
          <Heading>Join us</Heading>
          <p className="mx-auto max-w-md text-xl text-[#f4ecd8]/85">Your presence and duas would honour both families.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {SITE.whatsapp && <a href={rsvpUrl()} target="_blank" rel="noreferrer" className={btnGold}>Confirm on WhatsApp</a>}
            <a href={shareUrl()} target="_blank" rel="noreferrer" className={SITE.whatsapp ? btnLine : btnGold}>Share with family</a>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#c9a84c]/30 bg-[#062419] px-6 py-12 text-center">
        <p lang="ar" dir="rtl" className="f-ar text-2xl leading-loose text-[#e6c86e]">بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ</p>
        <p className="mt-2 text-lg italic text-[#f4ecd8]/70">May Allah bless you both and unite you in goodness.</p>
        <p className="mt-6 text-[#f4ecd8]/60">{SITE.groom.name} &amp; {SITE.bride.name} · 31 December 2026</p>
      </footer>
    </div>
  );
}