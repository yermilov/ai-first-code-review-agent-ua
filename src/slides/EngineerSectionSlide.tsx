import agendaEngineerImage from '../assets/agenda-engineer.png?url';
import { SlideDefinition } from '../types/slides';

export const EngineerSectionSlide: SlideDefinition = {
  id: 'agenda-engineer',
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">частина перша</span>
      <span className="slide-title-meta text-muted">
        // декілька порад щодо персональної продуктивності
      </span>
    </>
  ),
  content: (
    <div className="image-slide">
      <img src={agendaEngineerImage} alt="AI-First Engineer" loading="lazy" />
    </div>
  ),
};
