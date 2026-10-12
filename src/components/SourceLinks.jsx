// Shows where a recommendation comes from. Links open in a new tab so the
// reader does not lose their place in the checklist.

export default function SourceLinks({ sources }) {
  if (!sources || sources.length === 0) return null;
  const label = sources.length === 1 ? 'Source' : 'Sources';

  // Two pages from the same organization would otherwise show as two
  // identical links, so those are told apart by page title.
  const orgCounts = {};
  for (const source of sources) orgCounts[source.org] = (orgCounts[source.org] || 0) + 1;

  return (
    <p className="sources">
      {label}:{' '}
      {sources.map((source, index) => {
        const sharesOrg = orgCounts[source.org] > 1;
        return (
          <span key={source.id}>
            {index > 0 && ', '}
            <a href={source.url} target="_blank" rel="noopener noreferrer" title={source.title}>
              {source.org}
              {sharesOrg ? ` (${source.title})` : <span className="visually-hidden">: {source.title}</span>}
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </span>
        );
      })}
    </p>
  );
}
