import React, { useState, useEffect } from 'react';
import ArticleCard from './ArticleCard';
import { fetchArticles } from '../services/api';

const NewsFeed = ({ search, filters }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Ensure filters are properly defined
        const query = search || 'latest';
        const date = filters?.date || null;
        const source = filters?.source || null;
        const category = filters?.category || null;

        const data = await fetchArticles({ 
          query,
          date,
          source,
          category 
        });

        setArticles(data);

        // Save filters to local storage for personalized feed
        savePreferencesToLocalStorage(filters);

      } catch (error) {
        setError(error);
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, filters]);

  const savePreferencesToLocalStorage = (preferences) => {
    const existingPreferences = JSON.parse(localStorage.getItem('userPreferences')) || {};
    const updatedPreferences = {
      ...existingPreferences,
      ...preferences
    };
    localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));
  };

  // Conditional rendering based on component state
  if (loading) {
    return (
      <div className="p-4">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    console.log(error, "error");
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> {error.message || 'An unexpected error occurred.'}</span>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">No Results:</strong>
        <span className="block sm:inline"> No articles found for "{search}". Try adjusting your search or filters.</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {articles.map((article, index) => (
        <ArticleCard key={article.id || index} article={article} />
      ))}
    </div>
  );
};

export default NewsFeed;
