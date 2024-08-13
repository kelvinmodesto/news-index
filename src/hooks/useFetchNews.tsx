import { useState, useEffect } from 'react';
import axios from 'axios';

type NewsArticle = {
  title: string;
  description: string;
  url: string;
  source: string;
};

type UseFetchNewsResult = {
  newsArticles: NewsArticle[];
  loading: boolean;
  error: string | null;
};
type ParamsAPI = {
  q: string;
  apiKey?: string;
  'api-key'?: string;
};
const fetchNewsFromAPI = async (
  url: string,
  apiKey: string,
  source: string,
  query: string,
): Promise<NewsArticle[]> => {
  try {
    const params: ParamsAPI = {
      q: query,
    };

    if (source === 'NewsAPI') {
      params.apiKey = apiKey;
    } else {
      params['api-key'] = apiKey;
    }
    const response = await axios.get(url, {
      params: params,
    });

    const articles = response.data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: source,
    }));

    return articles;
  } catch (error) {
    console.error(`Error fetching news from ${source}:`, error);
    return [];
  }
};

const useFetchNews = (query: string): UseFetchNewsResult => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllNews = async () => {
      try {
        setLoading(true);
        const apiKeys = {
          nyTimes: import.meta.env.VITE_NYT_KEY,
          guardian: import.meta.env.VITE_GUARDIAN_KEY,
          newsApi: import.meta.env.VITE_NEWSAPI_KEY,
        };

        const urls = {
          nyTimes: 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
          guardian: 'https://content.guardianapis.com/search',
          newsApi: 'https://newsapi.org/v2/everything',
        };

        const [newsApiNews] = await Promise.all([
          fetchNewsFromAPI(urls.nyTimes, apiKeys.nyTimes, 'NYTimes', query),
          fetchNewsFromAPI(urls.guardian, apiKeys.guardian, 'Guardian', query),
          fetchNewsFromAPI(urls.newsApi, apiKeys.newsApi, 'NewsAPI', query),
        ]);

        setNewsArticles([...newsApiNews]);
        setError(null); // Reset error if the fetch is successful
      } catch (err) {
        setError('Failed to fetch news');
      } finally {
        setLoading(false);
      }
    };

    fetchAllNews();
  }, []);

  return { newsArticles, loading, error };
};

export default useFetchNews;
