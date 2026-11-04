import agendaEngineerImage from '../assets/agenda-engineer.png?url';
import { SlideDefinition } from '../types/slides';
import { T } from '../context/LanguageContext';

export const EngineerSectionSlide: SlideDefinition = {
  id: 'agenda-engineer',
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green"><T uk="частина перша" en="part one" /></span>
      <span className="slide-title-meta text-muted">
        {/* EN: own translation */}
        <T uk="// декілька порад щодо персональної продуктивності" en="// a few tips on personal productivity" />
      </span>
    </>
  ),
  content: (
    <div className="image-slide">
      <img src={agendaEngineerImage} alt="AI-First Engineer" loading="lazy" />
    </div>
  ),
};
