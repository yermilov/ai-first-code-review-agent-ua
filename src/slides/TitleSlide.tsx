import { SlideDefinition } from '../types/slides';
import { T } from '../context/LanguageContext';

export const TitleSlide: SlideDefinition = {
  id: 'title',
  content: (
    <div className="title-slide">
      {/* EN: own translation */}
      <h1 className="hero title-glow"><T uk="AI-first розробка на практиці" en="AI-first development in practice" /></h1>
      <p className="title-tagline"><T uk="кейс створення code review агента" en="building a code review agent" /></p>
      <p className="title-subtitle"><T uk="Ярослав Єрмілов" en="Yaroslav Yermilov" /></p>
      <p className="title-subtitle">Principal Software Engineer @ Superhuman (formerly Grammarly)</p>
    </div>
  ),
};
