import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Heart,
  ShieldCheck,
  Sparkles,
  Star,
  Gamepad2,
  Share2,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import world from "@/assets/home.png";
import diwali from "@/assets/Diwali.png";
import kids from "@/assets/kids 2.png";
import light from "@/assets/light.png";
import balloon from "@/assets/bubblewrap.png";
import luna from "@/assets/mindmate.png";
import sailor from "@/assets/crow2.0.png";
import oldSailor from "@/assets/crow 1.0 .png";
import garden from "@/assets/puzzle.png";
import bubblewrapVideo from "@/assets/bubblewrap.mp4";
import crow20Video from "@/assets/crow2.0.mp4";
import mindmateVideo from "@/assets/mindmate.mp4";
import puzzleVideo from "@/assets/puzzzle.mp4";
import feelfreeVideo from "@/assets/feelfree3.mp4";
import fellfree from "@/assets/fellfree.png";

const stories: { title: string; image: string; url: string; video?: string }[] = [
  { title: "FEELFREE", image: fellfree, url: "https://feelfree.guessme.co/", video: feelfreeVideo },
  { title: "BUBBLEWRAP", image: balloon, url: "https://bubblewrap.guessme.co/", video: bubblewrapVideo },
  { title: "MINDMATE", image: luna, url: "https://mindmate.guessme.co/", video: mindmateVideo },
  { title: "CROW 2.0", image: sailor, url: "https://crow2.guessme.co/", video: crow20Video },
  { title: "PUZZLE", image: garden, url: "https://puzzle.guessme.co/", video: puzzleVideo },
  { title: "Diwali", image: diwali, url: "https://diwali.guessme.co/" },
  { title: "Kids Golu", image: kids, url: "https://kidsgolu.guessme.co/" },
  { title: "CROW 1.0", image: oldSailor, url: "https://crow.guessme.co/" },
  { title: "Light the Way", image: light, url: "https://light.guessme.co/" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "guessme.co — Imagine. Discover. Play." },
      { name: "description", content: "A magical world where learning feels like an adventure. Explore stories, games, and creative discoveries for curious kids." },
      { property: "og:title", content: "guessme.co — Imagine. Discover. Play." },
      { property: "og:description", content: "A magical world where learning feels like an adventure. Explore stories, games, and creative discoveries for curious kids." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://guessme.co/" },
      { property: "og:site_name", content: "guessme.co" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://guessme.co/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;500;600;700;800;900&display=swap" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [storyOffset, setStoryOffset] = useState(0);
  const [showAllStories, setShowAllStories] = useState(false);
  const [activeVideo, setActiveVideo] = useState<{ title: string; url: string } | null>(null);
  const [language, setLanguage] = useState<"TA" | "EN">(() =>
    window.localStorage.getItem("guessme-language") === "TA" ? "TA" : "EN",
  );
  const [languageDialogOpen, setLanguageDialogOpen] = useState(() =>
    true,
  );
  const isTamil = language === "TA";
  const touchStartX = useRef<number | null>(null);
  const orderedStories = [...stories.slice(storyOffset), ...stories.slice(0, storyOffset)];
  const visibleStories = storyOffset === 8 ? orderedStories.slice(0, 1) : orderedStories.slice(0, 4);
  const storyPages = [0, 4, Math.min(8, stories.length - 1)];
  const storyTitle = (title: string) => {
    if (!isTamil) return title;
    const tamilTitles: Record<string, string> = {
      "Kids Golu": "குழந்தைகள் கோலு",
      "Light the Way": "வழி காட்டுதல்",
      "BUBBLEWRAP": "குமிழி போர்வு",
      "MINDMATE": "பிடித்த நண்பன்",
      "PUZZLE": "புதிர்",
      "Diwali": "தீபாவளி",
      "CROW 1.0": "காகம் 1.0",
      "CROW 2.0": "காகம் 2.0",
    };
    return tamilTitles[title] ?? title;
  };

  useEffect(() => {
    window.localStorage.setItem("guessme-language", language);
    document.documentElement.lang = language === "TA" ? "ta" : "en";
  }, [language]);

  const shareStory = async (story: (typeof stories)[number]) => {
    const videoUrl = story.video
      ? new URL(story.video, window.location.href).href
      : null;
    const title = `${story.title} video`;
    const fallbackText = videoUrl ? `${story.url}\n${videoUrl}` : story.url;

    try {
      if (navigator.share) {
        if (story.video && navigator.canShare) {
          const response = await fetch(story.video);
          if (!response.ok) {
            throw new Error(`Unable to load video for sharing: ${response.status}`);
          }

          const videoFile = new File(
            [await response.blob()],
            `${story.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.mp4`,
            { type: "video/mp4" },
          );

          if (navigator.canShare({ files: [videoFile] })) {
            await navigator.share({
              title,
              text: title,
              url: story.url,
              files: [videoFile],
            });
            return;
          }
        }

        if (!videoUrl) {
          await navigator.share({ url: story.url });
          return;
        }

        await navigator.share({
          title,
          text: `${title}\nVideo: ${videoUrl}`,
          url: story.url,
        });
        return;
      }

      await navigator.clipboard.writeText(fallbackText);
      window.alert(videoUrl
        ? "Video and story links copied. You can paste them to share."
        : "Story link copied. You can paste it to share.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;

      console.error("Unable to share video", error);
      window.alert("Unable to share this video. Please try again.");
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <header className="site-header">
        <div className="header-inner">
          <a href="#home" className="brand" aria-label="guessme.co home">
            <span className="brand-icon"><BookOpen size={27} strokeWidth={2.3} /><Sparkles size={13} /></span>
            <span className="brand-copy"><strong>guessme<span>.co</span></strong><small>{isTamil ? "கற்பனை · கண்டறி · விளையாடு" : "Imagine · Discover · Play"}</small></span>
          </a>
          <nav className="main-nav" aria-label="Main navigation" />
          <div className="header-actions">
            <button
              type="button"
              className="language-toggle"
              aria-label="Switch language"
              aria-pressed={language === "TA"}
              onClick={() => setLanguage((current) => {
                const next = current === "EN" ? "TA" : "EN";
                window.localStorage.setItem("guessme-language", next);
                return next;
              })}
            >
              <span className={language === "EN" ? "active" : ""}>EN</span>
              <span className={language === "TA" ? "active" : ""}>தமிழ்</span>
            </button>
            <Button
              className="join-button"
              onClick={() => {
                if (window.confirm("WhatsApp channel-ஐ follow செய்யுங்கள்!\n\nPlease follow our WhatsApp Channel to get updates.")) {
                  window.open("https://whatsapp.com/channel/0029Vb9jJYYC6ZvezNidmF1u", "_blank", "noopener,noreferrer");
                }
              }}
            >
              <Star size={15} fill="currentColor" /> <span className="join-label">{isTamil ? "இணைக" : "Join Now"}</span>
            </Button>
          </div>
        </div>
      </header>

      <section id="home" className="hero" style={{ backgroundImage: `url(${world})` }}>
        <div className="hero-wash" />
        <div className="hero-content">
          <p className="hero-eyebrow"><Sparkles size={15} /> {isTamil ? "தினமும் ஒரு சிறிய ஆச்சரியம்" : "A little wonder every day"}</p>
          <h1>{isTamil ? "ஆர்வத்தை" : "Let Curiosity"}<br /><span>{isTamil ? "வழிநடத்தட்டும்" : "Lead the Way"}</span></h1>
          <p className="hero-subtitle"><br className="desktop-break" /> {isTamil ? "ஒவ்வொரு பயணமும் ஒரு சாகசம்!" : "feels like an adventure!"}</p>
        
          <Button className="explore-button" onClick={() => document.getElementById("stories")?.scrollIntoView({ behavior: "smooth" })}>{isTamil ? "ஆராய தொடங்கு" : "Start Exploring"} <Sparkles size={17} /></Button>
          <a className="hero-scroll" href="#stories" aria-label="Scroll to explore"><ArrowDown size={17} /></a>
        </div>
        <div className="world-sign" aria-label={isTamil ? "கண்டு, கற்று, மகிழ" : "Discover, Learn, Have Fun"}>
          <span>{isTamil ? "கண்டு" : "Discover"}</span>
          <span>{isTamil ? "கற்று" : "Learn"}</span>
          <span>{isTamil ? "மகிழ" : "Have Fun"}</span>
        </div>
        <div className="hero-sprinkle sprinkle-one">✦</div><div className="hero-sprinkle sprinkle-two">✧</div>
      </section>

      <section className="trust-wrap" aria-label="What makes guessme special">
        <div className="trust-strip">
          <div><ShieldCheck className="trust-green" size={22} /><span>{isTamil ? "பாதுகாப்பானது · உள்நுழைவு இல்லை" : "Safe & no Login"}</span></div>
          <i />
          <div><Star className="trust-gold" size={21} fill="currentColor" /><span>{isTamil ? "நிபுணர் தேர்வு" : "Expert Curated"}</span></div>
          <i />
          
          <div><Heart className="trust-coral" size={21} fill="currentColor" /><span>{isTamil ? "அனைத்து வயதினரும்" : "All Ages"}</span></div>
        </div>
      </section>

      <section id="stories" className="stories-section">
        <div className="stories-inner">
          <div className="stories-header">
            <div className="section-heading section-heading-left">
              <span className="heading-flourish">✦</span>
              <div><p className="section-kicker">{isTamil ? "புதிய இடங்களுக்கு பக்கத்தை மாற்றுங்கள்" : "Turn the page to somewhere new"}</p><h2>{isTamil ? "Guessme கதைகள்" : "Guessme Stories"}</h2></div>
            </div>
            <Button
              variant="outline"
              className="view-all"
              onClick={() => setShowAllStories((current) => !current)}
              aria-expanded={showAllStories}
            >
              {showAllStories ? (isTamil ? "குறைவாக காட்டு" : "Show Less") : (isTamil ? "அனைத்தும்" : "View All")} <ArrowRight size={15} />
            </Button>
          </div>
          {!showAllStories && <div
            className="story-carousel"
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const touchEndX = event.changedTouches[0]?.clientX;
              if (touchStartX.current === null || touchEndX === undefined) return;

              const swipeDistance = touchStartX.current - touchEndX;
              touchStartX.current = null;
              if (Math.abs(swipeDistance) < 50) return;

              setStoryOffset((current) => {
                const pageIndex = storyPages.indexOf(current);
                if (swipeDistance > 0) return storyPages[(pageIndex + 1) % storyPages.length] ?? 0;
                return storyPages[(pageIndex - 1 + storyPages.length) % storyPages.length] ?? 0;
              });
            }}
            onTouchCancel={() => {
              touchStartX.current = null;
            }}
          >
            <Button variant="ghost" size="icon" className="carousel-arrow carousel-prev" aria-label="Previous stories" onClick={() => setStoryOffset((current) => {
              const pageIndex = storyPages.indexOf(current);
              return storyPages[(pageIndex - 1 + storyPages.length) % storyPages.length] ?? 0;
            })}><ArrowRight size={17} /></Button>
            <div className="story-grid story-grid-transition" key={storyOffset}>
              {visibleStories.map((story) => (
                <article className={`story-card${story.title === "FEELFREE" ? " new-story-card" : ""}`} key={story.title}>
                  <a href={story.url} target="_blank" rel="noopener noreferrer" className="story-image-link" aria-label={`Explore ${story.title}`}>
                    <img className={story.title === "Diwali" ? "diwali-card-image" : undefined} src={story.image} alt={story.title} width={1024} height={768} loading="lazy" />
                    {story.title === "FEELFREE" && <span className="new-story-badge">NEW</span>}
                    <span className="story-play"><BookOpen size={16} /></span>
                  </a>
                  <div className="story-info">
                    <h3>{storyTitle(story.title)}</h3>
                    <div className="story-actions">
                      <a href={story.url} target="_blank" rel="noopener noreferrer" className="story-explore" aria-label={`${isTamil ? "திற" : "Open"} ${story.title}`}>{isTamil ? "திற" : "Open"} <ArrowRight size={13} /></a>
                      {story.video && <button type="button" className="story-video" aria-label={`Play ${story.title} video`} onClick={() => {
                        if (story.video) setActiveVideo({ title: story.title, url: story.video });
                      }}><Video size={13} /></button>}
                      <button
                        type="button"
                        className="story-share"
                        aria-label={`Share ${story.title}`}
                        onClick={() => shareStory(story)}
                      >
                        <Share2 size={13} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              {storyOffset === 8 && (
                <article className="story-card coming-soon-card" key="coming-soon">
                  <div className="coming-soon-image" aria-label="Guessme coming soon">
                    <span className="coming-soon-mark"><Sparkles size={18} /> {isTamil ? "விரைவில்" : "coming soon"}</span>
                  </div>
                  <div className="story-info">
                    <h3>guessme.co</h3>
                    <div className="story-actions">
                      <span className="coming-soon-label">{isTamil ? "விரைவில்" : "Coming Soon"}</span>
                    </div>
                  </div>
                </article>
              )}
            </div>
            <Button variant="ghost" size="icon" className="carousel-arrow carousel-next" aria-label="Next stories" onClick={() => setStoryOffset((current) => {
              const pageIndex = storyPages.indexOf(current);
              return storyPages[(pageIndex + 1) % storyPages.length] ?? 0;
            })}><ArrowRight size={17} /></Button>
          </div>}
          {!showAllStories && <div className="carousel-dots" aria-label="Story page">{storyPages.map((pageOffset, index) => <span key={pageOffset} className={index === storyPages.indexOf(storyOffset) ? "active-dot" : ""} />)}</div>}
          {showAllStories && <div className="story-grid all-stories-grid">
            {stories.map((story) => (
              <article className={`story-card${story.title === "FEELFREE" ? " new-story-card" : ""}`} key={story.title}>
                <a href={story.url} target="_blank" rel="noopener noreferrer" className="story-image-link" aria-label={`Explore ${story.title}`}>
                  <img className={story.title === "Diwali" ? "diwali-card-image" : undefined} src={story.image} alt={story.title} width={1024} height={768} loading="lazy" />
                  {story.title === "FEELFREE" && <span className="new-story-badge">NEW</span>}
                  <span className="story-play"><BookOpen size={16} /></span>
                </a>
                <div className="story-info">
                  <h3>{storyTitle(story.title)}</h3>
                  <div className="story-actions">
                    <a href={story.url} target="_blank" rel="noopener noreferrer" className="story-explore" aria-label={`${isTamil ? "திற" : "Open"} ${story.title}`}>{isTamil ? "திற" : "Open"} <ArrowRight size={13} /></a>
                    {story.video && <button type="button" className="story-video" aria-label={`Play ${story.title} video`} onClick={() => {
                      if (story.video) setActiveVideo({ title: story.title, url: story.video });
                    }}><Video size={13} /></button>}
                    <button
                      type="button"
                      className="story-share"
                      aria-label={`Share ${story.title}`}
                      onClick={() => shareStory(story)}
                    >
                      <Share2 size={13} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
            <article className="story-card coming-soon-card" key="coming-soon">
              <div className="coming-soon-image" aria-label="Guessme coming soon">
                <span className="coming-soon-mark"><Sparkles size={18} /> {isTamil ? "விரைவில்" : "coming soon"}</span>
              </div>
              <div className="story-info">
                <h3>guessme.co</h3>
                <div className="story-actions">
                  <span className="coming-soon-label">{isTamil ? "விரைவில்" : "Coming Soon"}</span>
                </div>
              </div>
            </article>
          </div>}
        </div>
        <div className="garden-edge garden-left" />
        <div className="garden-edge garden-right" />
      </section>

      <div className="footer-visits" aria-label={language === "TA" ? "மொத்த வருகைகள்" : "Total Visits"}>
        <div className="footer-visits-icon" aria-hidden="true">
          <Star size={16} fill="currentColor" />
        </div>
        <div className="footer-visits-copy">
          <span>{language === "TA" ? "மொத்த வருகைகள்" : "Total Visits"}</span>
          <strong>10,692</strong>
        </div>
        <span className="footer-visits-events">
          {language === "TA" ? "ஈடுபாட்டு நிகழ்வுகள்" : "Engagement Events"}
        </span>
      </div>

      <footer className="site-footer">
        <a href="#home" className="footer-brand">guessme.co</a>
        <a className="footer-credit" href="https://dtacticsit.com/" target="_blank" rel="noopener noreferrer">Designed by D'TacticsIT</a>
        <nav className="footer-legal" aria-label="Legal">
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-use">Terms of Use</Link>
        </nav>
      </footer>
      <Dialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen}>
        <DialogContent
          className="language-dialog max-w-none w-[min(90vw,520px)]"
          overlayClassName="language-dialog-overlay"
        >
          <DialogTitle className="sr-only">Choose language</DialogTitle>
          <div className="language-dialog-inner">
            <div className="language-dialog-logo" aria-hidden="true">
              அ <span>A</span>
            </div>
            <h2>Welcome to GuessMe.co</h2>
            <p className="language-dialog-tagline">
              {language === "TA"
                ? "ஆச்சரியமும் கற்றலும் நிறைந்த ஒரு உலகம்"
                : "A magical world of learning and discovery"}
            </p>
            <div className="language-dialog-message">
              <strong>{language === "TA" ? "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்" : "Please choose your language to continue"}</strong>
              <span>{language === "TA" ? "English மற்றும் தமிழ் மாற்றங்கள் கிடைக்கும்." : "English and Tamil options are available."}</span>
            </div>
            <div className="language-dialog-actions">
              <button
                type="button"
                className={language === "EN" ? "active" : ""}
                onClick={() => {
                  setLanguage("EN");
                  window.localStorage.setItem("guessme-language", "EN");
                  setLanguageDialogOpen(false);
                }}
              >
                English
              </button>
              <button
                type="button"
                className={language === "TA" ? "active" : ""}
                onClick={() => {
                  setLanguage("TA");
                  window.localStorage.setItem("guessme-language", "TA");
                  setLanguageDialogOpen(false);
                }}
              >
                தமிழ்
              </button>
            </div>
            <div className="language-dialog-visits" aria-label={language === "TA" ? "மொத்த வருகைகள்" : "Total Visits"}>
              <div className="language-dialog-visits-icon" aria-hidden="true">
                <Star size={14} fill="currentColor" />
              </div>
              <div className="language-dialog-visits-copy">
                <span>{language === "TA" ? "மொத்த வருகைகள்" : "Total Visits"}</span>
                <strong>10,692</strong>
              </div>
              <span className="language-dialog-visits-events">
                {language === "TA" ? "ஈடுபாட்டு நிகழ்வுகள்" : "Engagement Events"}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={activeVideo !== null} onOpenChange={(open) => {
        if (!open) setActiveVideo(null);
      }}>
        <DialogContent
          className="video-dialog max-w-none w-[min(90vw,760px)] !border-0 !bg-transparent !p-0 !shadow-none"
          overlayClassName="video-dialog-overlay"
        >
          {activeVideo && (
            <>
              <DialogTitle className="sr-only">{activeVideo.title} video</DialogTitle>
              <video
                key={activeVideo.url}
                className="video-dialog-player"
                src={activeVideo.url}
                autoPlay
                controls
                playsInline
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}