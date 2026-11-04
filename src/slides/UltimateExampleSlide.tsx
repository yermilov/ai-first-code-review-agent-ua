import { SlideDefinition } from '../types/slides';
import { tr } from '../context/LanguageContext';
import coworkImage from '../assets/cowork-reimbursments.png?url';

export const UltimateExampleSlide: SlideDefinition = {
  id: 'ultimate-example',
  // EN: own translation
  title: ({ lang }) => <>&gt; {tr(lang, 'доводимо до абсурду', 'taking it to the extreme')}</>,
  content: (
    <div className="image-slide">
      <img src={coworkImage} alt="Ultimate example" loading="lazy" />
    </div>
  ),
};
