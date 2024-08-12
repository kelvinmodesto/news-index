import useFetchNews from './hooks/useFetchNews';
import './App.css';

function App() {
  const { newsArticles, loading, error } = useFetchNews('technology');

  if (loading) {
    return <p>Loading news...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <ul>
      {newsArticles.map((article, index) => (
        <li key={index}>
          <h3>{article.title}</h3>
          <p>{article.description}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read more
          </a>
          <p>
            <em>Source: {article.source}</em>
          </p>
        </li>
      ))}
    </ul>
  );
}

export default App;
