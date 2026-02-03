import React from 'react';
import { StudyContent } from './StudyContent';

export const TopicAccordion = ({ topics, openTopic, onToggle }) => {
  return (
    <>
      {topics.map(topic => (
        <div key={topic.id} className="accord">
          <button
            className={`accord-head${openTopic === topic.id ? ' open' : ''}`}
            onClick={() => onToggle(openTopic === topic.id ? null : topic.id)}
            aria-expanded={openTopic === topic.id}
            aria-controls={`topic-${topic.id}`}
            id={`topic-btn-${topic.id}`}
          >
            <span>{topic.title}</span>
            <span className="chevr" aria-hidden="true">&#9654;</span>
          </button>
          {openTopic === topic.id && (
            <div
              className="accord-body"
              role="region"
              id={`topic-${topic.id}`}
              aria-labelledby={`topic-btn-${topic.id}`}
            >
              <StudyContent blocks={topic.content} />
            </div>
          )}
        </div>
      ))}
    </>
  );
};
