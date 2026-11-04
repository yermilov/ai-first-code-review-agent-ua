import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { CodeBlockProps } from '../types/slides';

// Custom terminal theme on design tokens, so the light theme repaints it
const terminalTheme: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: 'var(--terminal-white)',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--font-size-code)',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: 'var(--line-height-relaxed)',
    tabSize: 2,
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: 'var(--terminal-white)',
    fontFamily: 'var(--font-mono)',
    fontSize: 'var(--font-size-code)',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: 'var(--line-height-relaxed)',
    tabSize: 2,
    hyphens: 'none',
    padding: 'var(--space-md)',
    margin: 0,
    overflow: 'auto',
    background: 'transparent',
  },
  // Comments
  comment: { color: 'var(--syntax-comment)', fontStyle: 'italic' },
  prolog: { color: 'var(--syntax-comment)' },
  doctype: { color: 'var(--syntax-comment)' },
  cdata: { color: 'var(--syntax-comment)' },
  // Punctuation
  punctuation: { color: 'var(--syntax-punctuation)' },
  // Namespace
  namespace: { opacity: 0.7 },
  // Properties, tags, booleans, numbers, constants, symbols
  property: { color: 'var(--terminal-green)' },
  tag: { color: 'var(--terminal-green)' },
  boolean: { color: 'var(--terminal-orange)' },
  number: { color: 'var(--terminal-orange)' },
  constant: { color: 'var(--terminal-orange)' },
  symbol: { color: 'var(--terminal-orange)' },
  deleted: { color: 'var(--terminal-red)' },
  // Selectors, strings, chars, builtins, inserted, regex, attr-value
  selector: { color: 'var(--syntax-string)' },
  string: { color: 'var(--syntax-string)' },
  char: { color: 'var(--syntax-string)' },
  builtin: { color: 'var(--terminal-blue)' },
  inserted: { color: 'var(--terminal-green)' },
  regex: { color: 'var(--syntax-string)' },
  'attr-value': { color: 'var(--syntax-string)' },
  // Operators, entities, URLs, CSS strings, style strings
  operator: { color: 'var(--terminal-blue)' },
  entity: { color: 'var(--terminal-orange)', cursor: 'help' },
  url: { color: 'var(--syntax-string)' },
  '.language-css .token.string': { color: 'var(--syntax-string)' },
  '.style .token.string': { color: 'var(--syntax-string)' },
  // At-rules, attributes, functions
  'atrule': { color: 'var(--terminal-purple)' },
  'attr-name': { color: 'var(--terminal-blue)' },
  function: { color: 'var(--terminal-purple)' },
  'class-name': { color: 'var(--syntax-attr)' },
  // Keywords
  keyword: { color: 'var(--terminal-red)' },
  // Important, bold
  important: { color: 'var(--terminal-red)', fontWeight: 'bold' },
  bold: { fontWeight: 'bold' },
  // Italic
  italic: { fontStyle: 'italic' },
  // Variable
  variable: { color: 'var(--syntax-attr)' },
};

export function CodeBlock({
  code,
  language = 'typescript',
  showLineNumbers = false,
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="code-block">
      <div className="code-block-header">
        <div className="code-block-dots">
          <span className="code-block-dot code-block-dot--red" />
          <span className="code-block-dot code-block-dot--yellow" />
          <span className="code-block-dot code-block-dot--green" />
        </div>
        {filename && <span className="code-block-filename">{filename}</span>}
        <button
          className={`code-block-copy ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy code'}
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={terminalTheme}
        showLineNumbers={showLineNumbers}
        wrapLines
        customStyle={{
          margin: 0,
          padding: 'var(--space-md)',
          background: 'transparent',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'var(--font-mono)',
          },
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}
