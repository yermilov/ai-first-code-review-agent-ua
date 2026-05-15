import skillsInfrastructureImage from '../assets/skills-infrastructure.png?url';
import { SlideDefinition } from '../types/slides';

export const SkillsInfrastructureSectionSlide: SlideDefinition = {
  id: 'skills-infrastructure-section',
  title: (
    <>
      <span className="text-dim">$</span>{' '}
      <span className="text-green">skills</span>{' '}
      <span className="text-orange">--infrastructure</span>
    </>
  ),
  content: (
    <div className="image-slide">
      <img src={skillsInfrastructureImage} alt="Skills Infrastructure" loading="lazy" />
    </div>
  ),
  notes: 'Transition to the skills infrastructure subsection — marketplace, distribution, and meta-skills',
};
