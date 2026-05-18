import agendaEngineerImage from '../assets/agenda-engineer.png?url';
import agendaTeamImage from '../assets/agenda-team.png?url';
import agendaOrgImage from '../assets/agenda-org.png?url';
import skillsInfrastructureImage from '../assets/skills-infrastructure.png?url';
import aiInnovatorCurveImage from '../assets/ai-innovator-curve-thumb.png?url';
import agentsSectionThumbImage from '../assets/agents-section-thumb.png?url';

export interface SubsectionData {
  command: string;
  image: string;
  alt: string;
  desc: string;
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
  { part: 1, image: agendaEngineerImage, alt: 'AI-First Engineer',     desc: 'декілька порад щодо персональної продуктивності',     slideId: 'agenda-engineer' },
  { part: 2, image: agendaTeamImage,     alt: 'AI-First Team',         desc: '// ai-first команда',         slideId: 'agenda-team',
    subsections: [
      { command: 'skills --infrastructure', image: skillsInfrastructureImage, alt: 'Skills Infrastructure', desc: '// distribution & marketplace', slideId: 'skills-infrastructure-section' },
      { command: 'ainnovator --curve', image: aiInnovatorCurveImage, alt: 'AI Innovator Curve', desc: '// rogers innovation adoption curve', slideId: 'ai-innovator-curve' },
      { command: 'skills --agents', image: agentsSectionThumbImage, alt: 'Agents', desc: '// autonomous and semi-autonomous workflows', slideId: 'agents-section' },
    ],
  },
  { part: 3, image: agendaOrgImage,      alt: 'AI-First Organization', desc: '// ai-first організація', slideId: 'agenda-org' },
];
