import React from 'react';
import { StudyContent } from './StudyContent';
import type { TopicAccordionProps } from '../../types';

export const TopicAccordion: React.FC<TopicAccordionProps> = ({ topics, openTopic, onToggle }) => {
  return (
    <div className="space-y-3">
      {topics.map(topic => (
        <div key={topic.id} className="bg-navy-dark rounded-lg overflow-hidden border border-navy">
          <button
            className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors ${
              openTopic === topic.id
                ? 'bg-navy-lite text-gold'
                : 'hover:bg-navy-mid text-text'
            }`}
            onClick={() => onToggle(openTopic === topic.id ? null : topic.id)}
            aria-expanded={openTopic === topic.id}
            aria-controls={`topic-${topic.id}`}
            id={`topic-btn-${topic.id}`}
          >
            <span className="font-semibold">{topic.title}</span>
            <span
              className={`text-sm transition-transform ${
                openTopic === topic.id ? 'rotate-90' : ''
              }`}
              aria-hidden="true"
            >
              &#9654;
            </span>
          </button>
          {openTopic === topic.id && (
            <div
              className="px-6 py-4 bg-navy-dark border-t border-navy"
              role="region"
              id={`topic-${topic.id}`}
              aria-labelledby={`topic-btn-${topic.id}`}
            >
              <StudyContent blocks={topic.content} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
