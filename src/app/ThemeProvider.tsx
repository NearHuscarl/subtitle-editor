import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import React, { PropsWithChildren } from "react";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          height: 56,
        },
      },
    },
  },
});

export function ThemeProvider(props: PropsWithChildren<any>) {
  return <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>;
}
