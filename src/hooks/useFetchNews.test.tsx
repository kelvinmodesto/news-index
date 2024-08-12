import { renderHook } from '@testing-library/react-hooks';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import useFetchNews from './useFetchNews';
import axios from 'axios';

// Mock axios to avoid real API calls
vi.mock('axios');

describe('useFetchNews', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test to avoid interference
  });

  it('should start with loading state', async () => {
    (axios.get as vi.Mock).mockResolvedValueOnce({ data: { articles: [] } });

    const { result, waitForNextUpdate } = renderHook(() => useFetchNews());

    expect(result.current.loading).toBe(true);
    expect(result.current.newsArticles).toEqual([]);
    expect(result.current.error).toBe(null);

    await waitForNextUpdate(); // wait for the hook to finish loading
  });

  it('should fetch and return news articles successfully', async () => {
    const mockData = {
      data: {
        articles: [
          {
            title: 'News Title 1',
            description: 'Description 1',
            url: 'https://example.com/1',
            source: { name: 'NYTimes' },
          },
          {
            title: 'News Title 2',
            description: 'Description 2',
            url: 'https://example.com/2',
            source: { name: 'BBC' },
          },
        ],
      },
    };

    (axios.get as vi.Mock).mockResolvedValueOnce(mockData);
    (axios.get as vi.Mock).mockResolvedValueOnce(mockData);
    (axios.get as vi.Mock).mockResolvedValueOnce(mockData);

    const { result, waitForNextUpdate } = renderHook(() => useFetchNews());

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.newsArticles).toHaveLength(6);
    expect(result.current.error).toBe(null);
  });

  it('should handle errors during fetching', async () => {
    (axios.get as vi.Mock).mockRejectedValueOnce(new Error('API error'));

    const { result, waitForNextUpdate } = renderHook(() => useFetchNews());

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.newsArticles).toEqual([]);
    expect(result.current.error).toBe('Failed to fetch news');
  });
});
