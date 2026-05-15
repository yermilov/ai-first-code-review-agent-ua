import agendaOrgImage from '../assets/agenda-org.png?url';
import { SlideDefinition } from '../types/slides';

export const OrgSectionSlide: SlideDefinition = {
  id: 'agenda-org',
  title: (
    <>
      <span className="text-dim">&gt;</span>{' '}
      <span className="text-green">частина третя</span>
      <span className="slide-title-meta text-muted">// ai-first організація</span>
    </>
  ),
  content: (
    <div className="image-slide">
      <img src={agendaOrgImage} alt="AI-First Organization" loading="lazy" />
    </div>
  ),
};
