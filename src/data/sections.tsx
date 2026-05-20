import { ReactNode } from 'react';
import agendaEngineerImage from '../assets/agenda-engineer.png?url';
import agendaTeamImage from '../assets/agenda-team.png?url';
import agendaOrgImage from '../assets/agenda-org.png?url';
import { PovSolitairePreview, SkillAstronautsPreview, MrDescriptionPreview } from '../components/AgendaPreviews';

export interface SubsectionData {
  /** Live preview component rendered as the entire card body. When set, label/image/desc are skipped. */
  previewNode?: ReactNode;
  /** Text label (lead-slide title abridged) — used when no previewNode. */
  labelNode?: ReactNode;
  /** Optional static thumbnail — used when no previewNode. */
  image?: string;
  /** Optional alt text for the thumbnail. */
  alt?: string;
  /** Optional dim description line. */
  desc?: string;
  /** Slide id to navigate to when the card is clicked. */
  slideId: string;
}

export interface SectionData {
  part: number;
  image: string;
  alt: string;
  desc: string;
  slideId: string;
  subsections?: SubsectionData[];
}

export const SECTIONS: SectionData[] = [
  {
    part: 1,
    image: agendaEngineerImage,
    alt: 'AI-First Engineer',
    desc: 'декілька порад щодо персональної продуктивності',
    slideId: 'agenda-engineer',
  },
  {
    part: 2,
    image: agendaTeamImage,
    alt: 'AI-First Team',
    desc: '// ai-first команда',
    slideId: 'agenda-team',
    subsections: [
      {
        slideId: 'pov-teammates',
        previewNode: <PovSolitairePreview />,
      },
      {
        slideId: 'what-is-skill',
        previewNode: <SkillAstronautsPreview />,
      },
      {
        slideId: 'agent-traces',
        previewNode: <MrDescriptionPreview />,
      },
    ],
  },
  {
    part: 3,
    image: agendaOrgImage,
    alt: 'AI-First Organization',
    desc: '// ai-first організація',
    slideId: 'agenda-org',
  },
];
