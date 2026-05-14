import { SlideDefinition } from '../types/slides';
import coworkImage from '../assets/cowork-reimbursments.png?url';

export const UltimateExampleSlide: SlideDefinition = {
  id: 'ultimate-example',
  title: <>&gt; доводимо до абсурду</>,
  content: (
    <div className="image-slide">
      <img src={coworkImage} alt="Ultimate example" loading="lazy" />
    </div>
  ),
};
