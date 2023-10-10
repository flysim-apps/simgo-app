import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { RadarComponent } from "components/radar/Radar";
import React from "react";
import { useSocket } from "transport";

let defaultTheme = createTheme({});

defaultTheme = createTheme(defaultTheme, {
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          [defaultTheme.breakpoints.up("xs")]: {
            minHeight: 50,
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          [defaultTheme.breakpoints.up("xs")]: {
            padding: 0,
          },
        },
      },
    },
  },
});

export const App = () => {
  useSocket();

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <CssBaseline />
        <Container
          component="main"
          maxWidth={false}
          sx={{ flexGrow: 1, padding: 3 }}
        >
          <RadarComponent />
        </Container>
      </Box>
    </ThemeProvider>
  );
};
