// Example state management to accumulate filters
import React, { useState } from 'react';

const FilterPanel = ({ onFilter }) => {
  const sources = ['cnn', 'bbc-news', 'nytimes'];
  const categories = [
    'India',
    'World',
    'Local',
    'Business',
    'Technology',
    'Entertainment',
    'Sports',
    'Science',
    'Health'
  ];

  const [filters, setFilters] = useState({ date: '', source: '', category: '' });

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 py-4 px-8 bg-gray-50 rounded-lg shadow-md">
      {/* Date Input */}
      <div className="flex-1">
        <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700">Date</label>
        <input
          id="date-filter"
          type="date"
          onChange={(e) => handleFilterChange('date', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        />
      </div>

      {/* Source Select */}
      <div className="flex-1">
        <label htmlFor="source-filter" className="block text-sm font-medium text-gray-700">Source</label>
        <select
          id="source-filter"
          onChange={(e) => handleFilterChange('source', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          <option value="">Filter by source</option>
          {sources.map((source) => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>
      </div>

      {/* Category Select */}
      <div className="flex-1">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category-filter"
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category || 'All Categories'}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
