import { SlideDefinition } from '../types/slides';
import slackImage from '../assets/junior-engineer-slack.png?url';
import terminalImage from '../assets/junior-engineer-terminal.png?url';

export const JuniorEngineerSlide: SlideDefinition = {
  id: 'junior-engineer',
  content: (
    <div className="junior-slide">
      <p className="junior-slide__hero">
        Claude Code — це{' '}
        <span className="text-orange">дуже талановитий джун</span>,
        {' '}у якого <span className="text-orange">щодня перший робочий день</span>
      </p>

      <div className="junior-slide__board">
        <figure className="junior-slide__panel">
          <span className="junior-slide__panel-tag">з&nbsp;людиною</span>
          <div className="junior-slide__panel-frame">
            <img src={slackImage} alt="Slack chat" loading="lazy" />
          </div>
        </figure>

        <div className="junior-slide__equals" aria-hidden="true">=</div>

        <figure className="junior-slide__panel">
          <span className="junior-slide__panel-tag">з&nbsp;Claude</span>
          <div className="junior-slide__panel-frame">
            <img src={terminalImage} alt="Claude Code terminal" loading="lazy" />
          </div>
        </figure>
      </div>

      <p className="junior-slide__rule">
        ви — <em className="text-green">ментор</em>: дайте задачі, контекст,
        зробіть <em className="text-green">рев&apos;ю</em>
      </p>
    </div>
  ),
};
