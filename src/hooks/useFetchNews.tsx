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
const BASE_URL_NEWS_API = 'https://newsapi.org/v2';
export const fetchNewsFromNewsAPI = async (query: string): Promise<NewsArticle[]> => {
  try {
    const response = await axios.get(`${BASE_URL_NEWS_API}/everything`, {
      params: {
        q: query,
        apiKey: import.meta.env.NEWS_API_KEY,
      },
    });

    const articles = response.data.articles.map((article: any) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      source: article.source,
    }));

    return articles;
  } catch (error) {
    console.error('Error fetching news from NewsAPI:', error);
    throw new Error('Failed to fetch news from NewsAPI');
  }
};

const fetchNewsFromAPI = async (
  url: string,
  apiKey: string,
  source: string,
  query: string,
): Promise<NewsArticle[]> => {
  try {
    const response = await axios.get(url, {
      params: {
        apiKey,
        q: query,
      },
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
          // nyTimes: 'YOUR_NYTIMES_API_KEY',
          // bbc: 'YOUR_BBC_API_KEY',
          newsApi: import.meta.env.VITE_NEWSAPI_KEY,
        };

        const urls = {
          // nyTimes: 'https://api.nytimes.com/svc/topstories/v2/home.json',
          // bbc: 'https://bbc.api.url/endpoint',
          newsApi: 'https://newsapi.org/v2/everything',
        };

        const [newsApiNews] = await Promise.all([
          // fetchNewsFromAPI(urls.nyTimes, apiKeys.nyTimes, 'NYTimes'),
          // fetchNewsFromAPI(urls.bbc, apiKeys.bbc, 'BBC'),
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
