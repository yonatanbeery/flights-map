import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { SimpleMap } from './utils/map.tsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<SimpleMap />
		<ToastContainer
			position="bottom-left"
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop
			closeOnClick
			rtl
			pauseOnFocusLoss={false}
			draggable
			pauseOnHover={false}
			theme="colored"
		/>
	</React.StrictMode>
);
