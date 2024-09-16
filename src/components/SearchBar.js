import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center bg-gray-50 justify-center mb-6 p-3 rounded-lg shadow-md max-w-lg mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-1 w-full sm:w-auto px-10 py-2 border border-gray-300 rounded-md sm:rounded-l-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150 ease-in-out mb-2 sm:mb-0"
        placeholder="Search articles..."
      />
      <button
        onClick={handleSearch}
        className="w-full sm:w-auto bg-indigo-500 text-white px-4 py-2 rounded-md sm:rounded-r-md sm:rounded-l-none hover:bg-indigo-600 transition duration-150 ease-in-out"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
