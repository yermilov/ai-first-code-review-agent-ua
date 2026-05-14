import { ReactNode } from 'react';
import { SlideDefinition } from '../types/slides';
import { Code, Quote, SlideLink } from '../components/SlideElements';
import contextToolsGathering from '../assets/context-tools-gathering.png?url';

const ADVICE: ReactNode[] = [
  <>
    описуємо задачу максимально детально (<Code>/voice</Code>, або{' '}
    <SlideLink href="https://handy.computer/">handy.computer</SlideLink> чи{' '}
    <SlideLink href="https://wisprflow.ai/">wisprflow.ai</SlideLink>, якщо
    зручніше диктувати)
  </>,
  <>
    якщо задача складна — спершу обговорюємо її з <Code>Deep Research</Code>{' '}
    агентом (ChatGPT чи Gemini), а потім додаємо звіт у Claude Code
  </>,
  <>
    малюємо діаграму чи дизайн на папері, дошці або в редакторі — робимо фото
    чи скриншот і додаємо у Claude Code
  </>,
  <>
    знаходимо опен-сорс проєкти зі схожими задачами, просимо Claude{' '}
    <Quote>browse these repos via gh cli for inspiration</Quote>
  </>,
  <>
    шукаємо статті та блог-пости на тему й додаємо посилання (або{' '}
    <Code>pdf</Code>-и)
  </>,
  <>не використовуємо MCP — натомість CLI або skills</>,
];

export const ContextToolsSlide: SlideDefinition = {
  id: 'context-tools',
  maxRevealStages: ADVICE.length - 1,
  content: ({ revealStage }) => {
    const idx = Math.min(revealStage, ADVICE.length - 1);
    return (
      <div className="bg-image-slide context-advice-slide">
        <img
          src={contextToolsGathering}
          alt="Контекст: voice, PDF, research, діаграми"
          className="bg-image-slide__background"
          loading="lazy"
        />

        <div className="context-advice-card">
          <div className="context-advice-card__body" key={idx}>
            {ADVICE[idx]}
          </div>
        </div>
      </div>
    );
  },
  notes:
    'Формування контексту, по одній пораді за раз: детальний опис задачі, Deep Research, статті/PDF, опен-сорс репозиторії, діаграми/скриншоти, CLI/skills замість MCP',
};
