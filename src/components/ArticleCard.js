import React from 'react';

const ArticleCard = ({ article }) => {
  // Extracting relevant fields with safe access and fallback values
  const title = article?.title || article?.headline?.main || 'Untitled';
  const description = article?.description || article?.abstract || 'No description available.';
  const url = article?.url || article?.web_url || '#';
  const publishedAt = article?.publishedAt || article?.pub_date;
  const imageUrl = article?.urlToImage || (article?.multimedia?.[0]?.url ? `https://www.nytimes.com/${article.multimedia[0].url}` : '');
  const author = article?.author || article?.byline?.original || 'Unknown Author';

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover object-center"
        />
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-700 text-base mb-4">{description}</p>
        <h3 className="text-gray-700 text-sm font-medium mb-4">{author}</h3>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Read more
        </a>
        {publishedAt && (
          <p className="text-gray-500 text-xs mt-3">
            {new Date(publishedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
