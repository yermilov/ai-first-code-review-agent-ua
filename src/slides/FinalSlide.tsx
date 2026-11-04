import { ReactNode } from 'react';
import { SlideDefinition } from '../types/slides';
import { SlideItem, Emphasis } from '../components/SlideElements';
import { tr } from '../context/LanguageContext';
import linkedinQr from '../assets/linkedin-qr.jpeg?url';

const TAKEAWAYS_UK: ReactNode[] = [
  <>почніть із пошуку власного <Emphasis color="green">vibe coding flow</Emphasis></>,
  <>далі виходьте за межі коду — використовуйте Клода для <Emphasis color="orange">всього, що робите</Emphasis>, особливо для закриття feedback loops</>,
  <>скіли — ваш мультиплікатор для команди; побудуйте <Emphasis color="green">інфраструктуру</Emphasis>, щоб ними було легко ділитися й перевикористовувати</>,
  <>напівавтономні агенти — наступний рубіж; починайте зі <Emphasis color="orange">спеціалізованих агентів</Emphasis>: тріажу тікетів, код-рев'ю, міграцій тощо</>,
  <><Emphasis color="green">люди</Emphasis> — найбільша цінність: AI підсилює команду, а не замінює її</>,
  <>пишіть мені в LinkedIn, я люблю поспілкуватися про AI</>,
];

// EN: own translation
const TAKEAWAYS_EN: ReactNode[] = [
  <>start by finding your own <Emphasis color="green">vibe coding flow</Emphasis></>,
  <>then go beyond code — use Claude for <Emphasis color="orange">everything you do</Emphasis>, especially for closing feedback loops</>,
  <>skills are your team multiplier; build the <Emphasis color="green">infrastructure</Emphasis> to share and reuse them easily</>,
  <>semi-autonomous agents are the next frontier; start with <Emphasis color="orange">specialized agents</Emphasis>: ticket triage, code review, migrations</>,
  <><Emphasis color="green">people</Emphasis> are the biggest asset: AI amplifies the team, it doesn't replace it</>,
  <>ping me on LinkedIn, I love talking about AI</>,
];

// Final stage reveals both the last takeaway (LinkedIn bullet) and the QR.
const TOTAL_STAGES = TAKEAWAYS_UK.length;

export const FinalSlide: SlideDefinition = {
  id: 'final',
  content: ({ revealStage, lang }) => (
    <>
      <h2 className="final-slide__heading">
        compacting the conversation...
      </h2>

      <div className="final-slide">
        <div className="final-slide__bullets">
          {tr(lang, TAKEAWAYS_UK, TAKEAWAYS_EN).map((bullet, i) =>
            revealStage >= i + 1 ? (
              <SlideItem key={i} delay={0}>{bullet}</SlideItem>
            ) : null,
          )}
        </div>

        {revealStage >= TOTAL_STAGES && (
          <div className="final-slide__contact">
            <img
              className="final-slide__qr final-qr-reveal"
              src={linkedinQr}
              alt="LinkedIn QR code - Yarik Yermilov"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </>
  ),
  maxRevealStages: TOTAL_STAGES,
  notes:
    "Фінальні висновки: vibe flow як фундамент, Клод поза кодом, інфраструктура для skills, спеціалізовані агенти, люди — найбільша цінність, LinkedIn-репліка. На фінальній стадії остання булет-репліка про LinkedIn з'являється в лівій колонці разом із QR-кодом справа.",
};
