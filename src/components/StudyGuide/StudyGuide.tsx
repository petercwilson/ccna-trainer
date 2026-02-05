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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text">Study Guides</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <DomainList
          domains={studyGuides}
          activeCategory={category}
          onSelect={handleCategoryChange}
        />
        <div className="lg:col-span-3 bg-navy-mid border border-navy rounded-lg overflow-hidden">
          <div className="bg-navy-lite border-b border-navy px-6 py-4">
            <h3 className="text-xl font-semibold text-text">{studyGuides[category].title}</h3>
          </div>
          <div className="p-6">
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
