import agendaTeamImage from '../assets/agenda-team.png?url';
import { SlideDefinition } from '../types/slides';
import { T } from '../context/LanguageContext';

export const TeamSectionSlide: SlideDefinition = {
  id: 'agenda-team',
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      {/* EN: own translation */}
      <span className="text-green"><T uk="частина друга" en="part two" /></span>
      <span className="slide-title-meta text-muted"><T uk="// ai-first команда" en="// ai-first team" /></span>
    </>
  ),
  content: (
    <div className="image-slide">
      <img src={agendaTeamImage} alt="AI-First Team" loading="lazy" />
    </div>
  ),
};
