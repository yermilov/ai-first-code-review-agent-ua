import { SlideDefinition } from '../types/slides';

export const TitleSlide: SlideDefinition = {
  id: 'title',
  content: (
    <div className="title-slide">
      <h1 className="hero title-glow">AI-first розробка</h1>
      <p className="title-tagline">кейс створення code review агента</p>
      <p className="title-subtitle">Ярослав Єрмілов, Principal Software Engineer @ Superhuman/Grammarly</p>
    </div>
  ),
};
