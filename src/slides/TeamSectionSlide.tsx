import agendaTeamImage from '../assets/agenda-team.png?url';
import { SlideDefinition } from '../types/slides';

export const TeamSectionSlide: SlideDefinition = {
  id: 'agenda-team',
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">частина друга</span>
      <span className="slide-title-meta text-muted">// ai-first team</span>
    </>
  ),
  content: (
    <div className="image-slide">
      <img src={agendaTeamImage} alt="AI-First Team" loading="lazy" />
    </div>
  ),
};
