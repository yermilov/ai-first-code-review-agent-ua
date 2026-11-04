import { SECTIONS } from '../data/sections';
import { SlideDefinition } from '../types/slides';
import { useNavigation } from '../context/NavigationContext';
import { tr, useLang } from '../context/LanguageContext';

const PART_ORDINAL_UK: Record<number, string> = {
  1: 'перша',
  2: 'друга',
  3: 'третя',
};

const PART_ORDINAL_EN: Record<number, string> = {
  1: 'one',
  2: 'two',
  3: 'three',
};

function AgendaSlideContent() {
  const { goToSlideById } = useNavigation();
  const lang = useLang();
  const subsections = SECTIONS.flatMap(s => s.subsections ?? []);

  return (
    <div className="agenda-slide">

      {/* Row 1: main sections */}
      <div className="agenda-sections-row">
        {SECTIONS.map((section) => (
          <div
            key={section.part}
            className="agenda-card"
            onClick={() => goToSlideById(section.slideId)}
          >
            <div className="agenda-card-command">
              <span className="text-dim">&gt;</span>{' '}
              <span className="text-green">
                {tr(
                  lang,
                  `частина ${PART_ORDINAL_UK[section.part] ?? section.part}`,
                  `part ${PART_ORDINAL_EN[section.part] ?? section.part}`,
                )}
              </span>
            </div>
            <div className="agenda-img-wrap">
              <img src={section.image} alt={section.alt} loading="lazy" className="agenda-card-image" />
            </div>
            <div className="agenda-card-desc text-muted">{tr(lang, section.desc, section.descEn)}</div>
          </div>
        ))}
      </div>

      {/* Connector */}
      {subsections.length > 0 && (
        <div className="agenda-connector">
          <div className="agenda-connector-line" />
          <span className="agenda-connector-label">
            {tr(lang, '// кейс створення code review агента', '// case study: building a code review agent')}
          </span>
          <div className="agenda-connector-line" />
        </div>
      )}

      {/* Row 2: subsections */}
      {subsections.length > 0 && (
        <div className="agenda-subs-row">
          {subsections.map((sub) => (
            <div
              key={sub.slideId}
              className="agenda-card agenda-subcard"
              onClick={() => goToSlideById(sub.slideId)}
            >
              {sub.previewNode ? (
                <div className="agenda-preview-wrap">{sub.previewNode}</div>
              ) : (
                <>
                  {sub.labelNode && (
                    <div className="agenda-card-command">{sub.labelNode}</div>
                  )}
                  {sub.image && (
                    <div className="agenda-img-wrap agenda-sub-img-wrap">
                      <img
                        src={sub.image}
                        alt={sub.alt ?? ''}
                        loading="lazy"
                        className="agenda-card-image"
                      />
                    </div>
                  )}
                  {sub.desc && (
                    <div className="agenda-card-desc text-muted">{sub.desc}</div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const AgendaSlide: SlideDefinition = {
  id: 'agenda',
  title: ({ lang }) => (
    <>
      <span className="text-dim">&gt;</span>{' '}
      {/* EN: own translation */}
      <span className="text-green">{tr(lang, 'про що сьогодні говоримо', "what we'll talk about today")}</span>
    </>
  ),
  content: <AgendaSlideContent />,
};
