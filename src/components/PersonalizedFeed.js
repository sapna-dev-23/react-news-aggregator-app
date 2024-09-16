import React, { useState, useEffect, useCallback } from 'react';
import ArticleCard from './ArticleCard';
import { fetchArticles } from '../services/api';

const getPreferencesFromLocalStorage = () => {
  const storedPreferences = localStorage.getItem('userPreferences');
  return storedPreferences ? JSON.parse(storedPreferences) : {};
};

const getFollowingFromLocalStorage = () => {
  const storedFollowing = localStorage.getItem('following');
  return storedFollowing ? JSON.parse(storedFollowing) : [];
};

const getCategoriesFromLocalStorage = () => {
  const storedCategories = localStorage.getItem('categories');
  return storedCategories ? JSON.parse(storedCategories) : [];
};

const getAuthorsFromLocalStorage = () => {
  const storedAuthors = localStorage.getItem('authors');
  return storedAuthors ? JSON.parse(storedAuthors) : [];
};

const PersonalizedFeed = ({ search }) => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferences] = useState(getPreferencesFromLocalStorage());
  const [following, setFollowing] = useState(getFollowingFromLocalStorage());
  const [categories, setCategories] = useState(getCategoriesFromLocalStorage());
  const [authors, setAuthors] = useState(getAuthorsFromLocalStorage());
  const [availableAuthors, setAvailableAuthors] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isAuthorsOpen, setIsAuthorsOpen] = useState(true);

  const handleToggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen);
  const handleToggleAuthors = () => setIsAuthorsOpen(!isAuthorsOpen);

  const sources = ['cnn', 'bbc-news', 'nytimes'];

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch articles based on user preferences and selections
        const data = await fetchArticles({
          query: search || preferences.query || 'latest',
          date: preferences.date,
          source: following.length > 0 ? following.join(',') : preferences.source || 'cnn,bbc-news,nytimes',
          category: categories.length > 0 ? categories.join(',') : preferences.category,
          author: authors.length > 0 ? authors.join(',') : preferences.author,
        });

        // Extract unique authors and categories from the articles
        const extractedAuthors = [...new Set(data.map(article => article.author || article.byline?.original || 'Unknown Author'))].filter(author => author.trim() !== '');
        const extractedCategories = [...new Set(data.map(article => article.category || article.section_name || ''))].filter(category => category.trim() !== '');

        setAvailableAuthors(extractedAuthors);
        setAvailableCategories(extractedCategories);

        // Filter articles based on selected authors and categories
        const filtered = data.filter(article => {
          const articleAuthor = article.author || article.byline?.original || 'Unknown Author';
          const articleCategory = article.section_name || '';
          const isAuthorMatch = authors.length > 0 ? authors.some(author => articleAuthor.toLowerCase() === author.toLowerCase()) : true;
          const isCategoryMatch = categories.length > 0 ? categories.some(category => articleCategory.toLowerCase() === category.toLowerCase()) : true;
        
          return isAuthorMatch && isCategoryMatch;
        });

        setArticles(data);
        setFilteredArticles(filtered);
      } catch (error) {
        setError(error);
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, preferences, following, categories, authors]);

  // Toggle source follow/unfollow state
  const toggleFollow = (source) => {
    setFollowing((prev) => {
      const updatedFollowing = prev.includes(source)
        ? prev.filter((item) => item !== source)
        : [...prev, source];
      localStorage.setItem('following', JSON.stringify(updatedFollowing));
      return updatedFollowing;
    });
  };

  // Toggle author selection
  const toggleAuthor = (author) => {
    setAuthors((prev) => {
      const updatedAuthors = prev.includes(author)
        ? prev.filter((item) => item !== author)
        : [...prev, author];
      localStorage.setItem('authors', JSON.stringify(updatedAuthors));
      return updatedAuthors;
    });
    setAvailableAuthors((prev) => {
      const updatedAvailableAuthors = prev.includes(author)
        ? prev.filter((item) => item !== author)
        : [...prev, author];
      return updatedAvailableAuthors;
    });
  };

  // Toggle category selection
  const toggleCategory = useCallback((category) => {
    setCategories((prev) => {
      const updatedCategories = prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category];
      localStorage.setItem('categories', JSON.stringify(updatedCategories));
      return updatedCategories;
    });
    setAvailableCategories((prev) => {
      const updatedAvailableCategories = prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category];
      return updatedAvailableCategories;
    });
  }, [setCategories]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen p-6">
        <p className="text-gray-800 text-lg font-semibold">Loading...</p>
      </div>
    );
  }
  if (error) return <p>Error: {error.message}</p>;
  // Determine articles to display based on filtering criteria
  const selectedAuthor = "Jeff Sommer";
  const selectedCategory = "Arts";

  const displayArticles = [
    ...new Set([
      ...filteredArticles,
      ...articles.filter(article => article.author === selectedAuthor || article.byline?.original === selectedAuthor),
      ...articles.filter(article => article.category === selectedCategory || article.section_name === selectedCategory),
    ]),
  ];

  // Check if there are categories and authors available
  const hasCategories = availableCategories.length > 0;
  const hasAuthors = availableAuthors.length > 0;

  return (
    <div className="p-6 min-h-screen">
      {/* Source Cards */}
      <h2 className="text-md font-semibold mb-4 text-gray-700">Sources</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {sources.map((source) => (
          <div key={source} className="bg-white p-3 rounded-md shadow-md hover:shadow-lg transition-shadow transform hover:scale-105 border border-gray-200 text-center">
            <h2 className="text-sm font-medium mb-2 capitalize text-gray-700">{source.replace('-', ' ')}</h2>
            <button
              onClick={() => toggleFollow(source)}
              className={`w-full py-1 text-sm rounded font-medium transition-colors duration-300 ease-in-out ${
                following.includes(source) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
              } hover:bg-green-600 hover:text-white`}
            >
              {following.includes(source) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>

      {/* No Results Message if No Categories */}
      {!hasCategories && articles.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-md shadow-md">
          <strong className="font-semibold">No Results:</strong>
          <span className="block mt-1">No articles found for the selected filters. Please adjust your selections or try different filters.</span>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {/* Categories Accordion */}
            {hasCategories && (
              <div className="bg-white border border-gray-200 rounded-md shadow-md">
                <button
                  onClick={handleToggleCategories}
                  className="w-full px-4 py-2 text-md font-semibold text-gray-700 bg-gray-300 border border-gray-200 hover:bg-gray-200 focus:outline-none rounded-md"
                >
                  Categories
                  <span className={`ml-2 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {isCategoriesOpen && (
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {availableCategories.map((category) => (
                        <div
                          key={category}
                          className="bg-white p-3 rounded-md shadow-md hover:shadow-lg transition-shadow transform hover:scale-105 border border-gray-200 text-center"
                        >
                          <h3 className="text-sm font-medium mb-2 capitalize text-gray-700">{category}</h3>
                          <button
                            onClick={() => toggleCategory(category)}
                            className={`w-full py-1 text-sm rounded font-medium transition-colors duration-300 ease-in-out ${
                              categories.includes(category)
                                ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                            } hover:bg-green-600 hover:text-white`}
                          >
                            {categories.includes(category) ? 'Following' : 'Follow'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Authors Accordion */}
            {hasAuthors && (
              <div className="bg-white border border-gray-200 rounded-md shadow-md">
                <button
                  onClick={handleToggleAuthors}
                  className="w-full px-4 py-2 text-md font-semibold text-gray-700 bg-gray-300 border border-gray-200 hover:bg-gray-200 focus:outline-none rounded-md"
                >
                  Authors
                  <span className={`ml-2 transition-transform ${isAuthorsOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {isAuthorsOpen && (
                  <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {availableAuthors.map((author) => (
                        <div
                          key={author}
                          className="bg-white p-3 rounded-md shadow-md hover:shadow-lg transition-shadow transform hover:scale-105 border border-gray-200 text-center"
                        >
                          <h3 className="text-sm font-medium mb-2 capitalize text-gray-700">{author}</h3>
                          <button
                            onClick={() => toggleAuthor(author)}
                            className={`w-full py-1 text-sm rounded font-medium transition-colors duration-300 ease-in-out ${
                              authors.includes(author)
                                ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                            } hover:bg-green-600 hover:text-white`}
                          >
                            {authors.includes(author) ? 'Following' : 'Follow'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Display Articles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
            {displayArticles.length === 0 ? (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-md shadow-md">
                <strong className="font-semibold">No Articles:</strong>
                <span className="block mt-1">No articles found for the selected filters. Please adjust your selections or try different filters.</span>
              </div>
            ) : (
              displayArticles.map((article, index) => (
                <ArticleCard key={article.id || index} article={article} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PersonalizedFeed;
