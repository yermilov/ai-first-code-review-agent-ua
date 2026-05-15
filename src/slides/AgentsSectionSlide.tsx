import agentsSmithImage from '../assets/agents-smith.png?url';
import { SlideDefinition } from '../types/slides';

export const AgentsSectionSlide: SlideDefinition = {
  id: 'agents-section',
  title: (
    <>
      <span className="text-dim">$</span>{' '}
      <span className="text-green">skills</span>{' '}
      <span className="text-orange">--agents</span>
    </>
  ),
  content: (
    <div className="image-slide">
      <img src={agentsSmithImage} alt="Agent Smiths" loading="lazy" />
    </div>
  ),
  notes: 'Transition slide into the agents subsection — autonomous and semi-autonomous agent workflows.',
};
