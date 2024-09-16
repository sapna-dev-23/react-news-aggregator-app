import axios from 'axios';
// we can use .env file for these keys 
// API keys and endpoints
const API_KEYS = {
  NewsAPI: '8d3df3472a3947db962d99bb611de3d9',
  BBCNews: '8d3df3472a3947db962d99bb611de3d9',
  NYTimes: 'abYCAkqJCTiqnEnvmAaHBGz5mHOLUrnN',
};

const API_ENDPOINTS = {
  NewsAPI: 'https://newsapi.org/v2/everything',
  BBCNews: 'https://newsapi.org/v2/everything',
  NYTimes: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
};

// Helper function to format date to 'YYYYMMDD' format
const getFormattedDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

// Function to fetch articles based on filters
export const fetchArticles = async (filters) => {
  try {
    let url = '';
    let params = {};

    // Default to today's date if no date is provided
    const defaultDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    switch (filters.source) {
      case 'nytimes':
        url = API_ENDPOINTS.NYTimes;
        params = {
          'api-key': API_KEYS.NYTimes,
          q: filters.query || 'latest',
          begin_date: filters.date ? filters.date.replace(/-/g, '') : getFormattedDate(), // Format date as YYYYMMDD
          fq: filters.category ? `section_name:("${filters.category}")` : '',
          author:filters.author || '',
        };
        break;

      case 'bbc-news':
        url = API_ENDPOINTS.NewsAPI;
        params = {
          apiKey: API_KEYS.NewsAPI,
          q: filters.query || 'latest',
          from: filters.date || defaultDate,
          sources: 'bbc-news',
          author:filters.author || '',
        };
        break;

      default:
        // Default to NewsAPI
        url = 'https://newsapi.org/v2/everything';
        params = {
          apiKey: API_KEYS.NewsAPI,
          q: filters.query || 'latest',
          author:filters.author || '',
        };
        break;
    }

    const response = await axios.get(url, { params });

    // Handle different response structures
    if (filters.source === 'nytimes') {
      return response.data.response.docs;
    } else {
      return response.data.articles || response.data.items; 
    }

  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const extractCategoriesFromArticles = (articles) => {
  const categories = new Set();
  articles.forEach(article => {
    // Assuming article has a 'category' field or similar
    if (article.category) {
      categories.add(article.category || article.section_name);
    }
  });
  return Array.from(categories);
};