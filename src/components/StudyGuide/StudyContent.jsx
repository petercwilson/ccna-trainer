import React from 'react';

export const StudyContent = ({ blocks }) => {
  return blocks.map((b, i) => {
    if (b.type === 'heading') {
      return <div key={i} className="c-heading" role="heading" aria-level="3">{b.text}</div>;
    }

    if (b.type === 'list') {
      return (
        <ul key={i} className="c-list" role="list">
          {b.items.map((it, j) => (
            <li key={j} role="listitem">{it}</li>
          ))}
        </ul>
      );
    }

    if (b.type === 'rows' || b.type === 'table') {
      return (
        <table key={i} className="c-table" role="table">
          <tbody>
            {b.rows.map((r, j) => (
              <tr key={j} role="row">
                {r.map((c, k) => (
                  <td key={k} role="cell">{c}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return null;
  });
};
