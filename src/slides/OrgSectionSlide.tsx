import agendaOrgImage from '../assets/agenda-org.png?url';
import { SlideDefinition } from '../types/slides';
import { tr } from '../context/LanguageContext';

export const OrgSectionSlide: SlideDefinition = {
  id: 'agenda-org',
  title: ({ lang }) => (
    <>
      <span className="text-dim">&gt;</span>{' '}
      {/* EN: own translation */}
      <span className="text-green">{tr(lang, 'частина третя', 'part three')}</span>
      <span className="slide-title-meta text-muted">{tr(lang, '// ai-first організація', '// ai-first organization')}</span>
    </>
  ),
  content: (
    <div className="image-slide">
      <img src={agendaOrgImage} alt="AI-First Organization" loading="lazy" />
    </div>
  ),
};
