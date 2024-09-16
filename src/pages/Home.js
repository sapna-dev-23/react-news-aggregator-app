import React, { useState } from 'react';
import PersonalizedFeed from '../components/PersonalizedFeed';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import NewsFeed from '../components/NewsFeed';

const Home = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ date: '', category: '', source: '' });
  const [activeTab, setActiveTab] = useState('aggregator'); // State for managing active tab

  const handleSearch = (query) => {
    setSearch(query);
  };

  const handleFilter = (newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  return (
    <div className="container mx-auto bg-slate-100 p-6">
      {/* Heading */}
      <header className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-gray-800">News Platform</h1>

        {/* Tab Controls */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setActiveTab('aggregator')}
            className={`px-6 py-2 mx-2 rounded-lg text-md font-medium transition-colors duration-300 ${
              activeTab === 'aggregator'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            News Feed
          </button>
          <button
            onClick={() => setActiveTab('newsFeed')}
            className={`px-6 py-2 mx-2 rounded-lg text-md font-medium transition-colors duration-300 ${
              activeTab === 'newsFeed'
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Personalized News Feed
          </button>
        </div>
      </header>

      {/* Conditional Rendering Based on Active Tab */}
      <main className="flex flex-col items-center">
        {activeTab === 'aggregator' ? (
          <>
            <FilterPanel onFilter={handleFilter} />
            <SearchBar onSearch={handleSearch} />
            <NewsFeed search={search} filters={filters} />
          </>
        ) : (
          <PersonalizedFeed search={search} filters={filters} />
        )}
      </main>
    </div>
  );
};

export default Home;
