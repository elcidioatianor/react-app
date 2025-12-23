import { useColorScheme, ThemeContext } from '../contexts/ThemeContext';

function ThemeProvider({children}) {
	const colorScheme = useColorScheme()
	const contextValue = {
		theme: colorScheme
	}

	return (
		<ThemeContext value={contextValue}>
			{children}
		</ThemeContext>
	)
}

export {
	ThemeProvider
}
