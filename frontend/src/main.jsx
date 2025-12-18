import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from "./context/authContext";
import router from './router';

//Opções para toast notifications 
const toastOptions= {
	duration: 3000,
	style: {
		background: '#fff',
		color: '#333',
		borderRadius: '8px',
		padding: '10px 14px',
		border: '1px solid #ddd'
	}
}

const {render} = createRoot(document.getElementById("root"))

render(
	<StrictMode>
		<AuthProvider>
			<Toaster position="top-right" toastOptions={toastOptions}/>
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>
);
