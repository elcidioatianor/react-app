// babel.config.js
const reactCompilerOptions = {
    compilationMode: 'annotation', // Only compile "use memo" functions
  plugins: [
    [
      'babel-plugin-react-compiler', {
        // compiler options
      }
    ]
  ]
};

export default reactCompilerOptions;

