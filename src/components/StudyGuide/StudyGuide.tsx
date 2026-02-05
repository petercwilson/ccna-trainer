import React, { useState } from 'react';
import { studyGuides } from '../../data/studyGuides';
import { DomainList } from './DomainList';
import { TopicAccordion } from './TopicAccordion';

export const StudyGuide: React.FC = () => {
  const [category, setCategory] = useState('network-fundamentals');
  const [openTopic, setOpenTopic] = useState<string | null>(null);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setOpenTopic(null);
  };

  return (
    <div className="space-y-6">
      <div className="section-hdr">
        <h2>Study Guides</h2>
      </div>
      <div className="study-grid">
        <DomainList
          domains={studyGuides}
          activeCategory={category}
          onSelect={handleCategoryChange}
        />
        <div className="card">
          <div className="card-head">
            <h3>{studyGuides[category].title}</h3>
          </div>
          <div className="card-body">
            <TopicAccordion
              topics={studyGuides[category].topics}
              openTopic={openTopic}
              onToggle={setOpenTopic}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
