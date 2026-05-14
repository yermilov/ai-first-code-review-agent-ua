const PART_ORDINAL_UK: Record<number, string> = {
  1: 'перша',
  2: 'друга',
  3: 'третя',
};

export function SectionTitleSlide({
  src,
  alt,
  part,
  desc,
}: {
  src: string;
  alt: string;
  part: number;
  desc: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
        width: '100%',
      }}
    >
      <div className="section-title-header" style={{ textAlign: 'center' }}>
        <h2>
          <span className="text-dim">&gt;</span>{' '}
          <span style={{ color: 'var(--terminal-green)' }}>частина {PART_ORDINAL_UK[part] ?? part}</span>
        </h2>
        <p className="text-muted">{desc}</p>
      </div>

      <img
        src={src}
        alt={alt}
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
