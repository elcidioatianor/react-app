import { createContext, useContext } from "react";

const ThemeContext = createContext('light');

function useColorScheme() {//helper method to call useContext
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error('useColorSheme deve ser usado dentro de ThemeProvider');
	}

	return context
}

export {
	ThemeContext,
	useColorScheme
}