import React from 'react';
import type { StudyContentProps } from '../../types';

export const StudyContent: React.FC<StudyContentProps> = ({ blocks }) => {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === 'heading') {
          return (
            <div
              key={i}
              className="text-lg font-semibold text-gold mt-4 mb-2 first:mt-0"
              role="heading"
              aria-level={3}
            >
              {b.text}
            </div>
          );
        }

        if (b.type === 'list') {
          return (
            <ul key={i} className="space-y-1 mb-4 text-text-muted" role="list">
              {b.items?.map((it, j) => (
                <li key={j} className="flex items-start" role="listitem">
                  <span className="text-gold mr-2 mt-1">•</span>
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          );
        }

        if (b.type === 'rows' || b.type === 'table') {
          return (
            <div key={i} className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse" role="table">
                <tbody>
                  {b.rows?.map((r, j) => (
                    <tr
                      key={j}
                      className="border-b border-navy last:border-0"
                      role="row"
                    >
                      {r.map((c, k) => (
                        <td
                          key={k}
                          className={`px-3 py-2 ${
                            k === 0
                              ? 'text-gold font-semibold'
                              : 'text-text-muted'
                          }`}
                          role="cell"
                        >
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return null;
      })}
    </>
  );
};
