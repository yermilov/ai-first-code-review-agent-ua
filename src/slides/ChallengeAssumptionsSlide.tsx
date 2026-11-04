import { ReactNode } from 'react';
import { SlideDefinition } from '../types/slides';
import { SlideItem, Emphasis } from '../components/SlideElements';
import { tr } from '../context/LanguageContext';

const QUESTIONS_UK: ReactNode[] = [
  <>якщо ми релізимо фічі у 10 разів швидше — чи встигатимемо ми так само швидко <Emphasis color="orange">ухвалювати рішення</Emphasis>?</>,
  <>чи потрібно тижнями писати й обговорювати дизайн-доки, якщо <Emphasis color="green">прототип</Emphasis> можна запустити швидше, ніж пишеться документ про нього?</>,
  <>чи можемо ми обміняти частину <Emphasis color="green">стандартів аптайму</Emphasis> на швидкість розробки?</>,
  <>чи варто оцінювати <Emphasis color="orange">AI-кодинг скіли</Emphasis> на технічних інтерв'ю?</>
];

// EN: own translation
const QUESTIONS_EN: ReactNode[] = [
  <>if we ship features 10x faster — can we still <Emphasis color="orange">make decisions</Emphasis> just as fast?</>,
  <>do we still need weeks of writing and debating design docs, when a <Emphasis color="green">prototype</Emphasis> ships faster than the doc about it gets written?</>,
  <>can we trade some of our <Emphasis color="green">uptime standards</Emphasis> for development speed?</>,
  <>should we assess <Emphasis color="orange">AI coding skills</Emphasis> in technical interviews?</>
];

export const ChallengeAssumptionsSlide: SlideDefinition = {
  id: 'challenge-assumptions',
  content: ({ revealStage, lang }) => (
    <>
      <h2>
        <span className="text-dim">//</span>{' '}
        <span className="text-green">{tr(lang, 'складні', 'hard')}</span>{' '}
        <span className="text-orange">{tr(lang, 'питання', 'questions')}</span>
      </h2>

      <div
        style={{
          textAlign: 'left',
          maxWidth: '1400px',
          width: '100%',
          margin: '0 auto',
        }}
      >
        {tr(lang, QUESTIONS_UK, QUESTIONS_EN).map((q, i) =>
          revealStage >= i ? (
            <SlideItem key={i} delay={i === 0 ? 0.06 : 0}>{q}</SlideItem>
          ) : null,
        )}
      </div>
    </>
  ),
  maxRevealStages: QUESTIONS_UK.length - 1,
  notes:
    "Закриваюча секція AI-first: ці питання — не риторичні. Кожне з них — командна розмова, яка чекає, коли її почнуть. Запропонуйте слухачам обрати два питання, що найбільше змінять їхню організацію, і починати з них.",
};
