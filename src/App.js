import logo from './logo.svg';
import './App.css';
import { UsePoller } from './use-poller';
import { useEffect } from 'react';

const INDEX_HTML_DEPLOYMENT_URL = "https://front-end-version-change-deploy.vercel.app/index.html";

function App() {
  const { isNewVersionAvailable } = UsePoller({ deploymentUrl: INDEX_HTML_DEPLOYMENT_URL });

  useEffect(() => {
    if (isNewVersionAvailable) {
      console.log("New version available, reloading...");
    } else {
      console.log("No new version available");
    }
  }, [isNewVersionAvailable])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
