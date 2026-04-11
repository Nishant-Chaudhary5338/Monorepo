import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { SearchHelpProvider } from './context/SearchHelpContext';
import { BomHelpProvider } from './context/BomHelpContext';
import { GroupDataProvider } from './context/groupData';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<GroupDataProvider>
			<SearchHelpProvider>
				<BomHelpProvider>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</BomHelpProvider>
			</SearchHelpProvider>
		</GroupDataProvider>
	</React.StrictMode>,
);
