import { createMuiTheme } from "@material-ui/core/styles";
import { pink } from "@material-ui/core/colors";

const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        background: {
            default: '#F9F9F9',
          },
        primary: {
            main: "#212121", // NEW
            dark: "#2e355b",
            light: "#5c67a3",
            contrastText: "#fff",
        },
        secondary: {
            light: "#ff79b0",
            main: "#ff4081",
            dark: "#c60055",
            contrastText: "#000",
        },
        openTitle: "#3f4771",
        protectedTitle: pink["400"],
        type: "light",
    },
});

export default theme;
