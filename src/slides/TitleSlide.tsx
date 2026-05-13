import { SlideDefinition } from '../types/slides';

export const TitleSlide: SlideDefinition = {
  id: 'title',
  content: (
    <div className="title-slide">
      <h1 className="hero title-glow">AI-first розробка на практиці</h1>
      <p className="title-tagline">кейс створення code review агента</p>
      <p className="title-subtitle">Ярослав Єрмілов</p>
      <p className="title-subtitle">Principal Software Engineer @ Superhuman (formerly Grammarly)</p>
    </div>
  ),
};
