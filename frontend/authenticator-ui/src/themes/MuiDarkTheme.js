export const darkThemeOptions = {
  palette: {
    type: 'dark',
    primary: {
      main: '#4f65e8',
      dark: '#1a1e68',
      light: '#7b8cfa',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#0a1929',
    },
    text: {
        primary: '#ffffff',
        secondary: 'rgba(174,174,174,0.95)',
        hint: 'rgba(102,75,75,0.5)',
        disabled: 'rgba(131,129,129,0.5)',
    },
  },
  overrides: {
    MuiInput: {
      input: {
        "&::placeholder": {
          color: "#b4bdc4"
        },
        color: "white",
      }
    }
  }
};