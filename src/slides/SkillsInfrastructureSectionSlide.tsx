import skillsInfrastructureImage from '../assets/skills-infrastructure.png?url';
import { SlideDefinition } from '../types/slides';

function SkillsInfrastructureSectionSlideContent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-md)', width: '100%' }}>
      <div className="section-title-header" style={{ textAlign: 'center' }}>
        <h2>
          <span className="text-dim">$</span>{' '}
          <span className="text-green">skills</span>{' '}
          <span className="text-orange">--infrastructure</span>
        </h2>
        <p className="text-muted">// distribution, marketplace, and meta-skills</p>
      </div>

      <img
        src={skillsInfrastructureImage}
        alt="Skills Infrastructure"
        loading="lazy"
        style={{
          maxWidth: '100%',
          maxHeight: 'calc(var(--vh-full) - 240px)',
          objectFit: 'contain',
          borderRadius: '8px',
          border: '1px solid var(--terminal-border)',
          boxShadow: '0 0 30px rgba(126, 231, 135, 0.1)',
        }}
      />
    </div>
  );
}

export const SkillsInfrastructureSectionSlide: SlideDefinition = {
  id: 'skills-infrastructure-section',
  content: <SkillsInfrastructureSectionSlideContent />,
  notes: 'Transition to the skills infrastructure subsection — marketplace, distribution, and meta-skills',
};
