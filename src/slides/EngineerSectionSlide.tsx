import agendaEngineerImage from '../assets/agenda-engineer.png?url';
import { SlideDefinition } from '../types/slides';
import { SectionTitleSlide } from '../components/SectionTitleSlide';

export const EngineerSectionSlide: SlideDefinition = {
  id: 'agenda-engineer',
  content: (
    <SectionTitleSlide
      src={agendaEngineerImage}
      alt="AI-First Engineer"
      part={1}
      desc="декілька порад щодо персональної продуктивності"
    />
  ),
};
