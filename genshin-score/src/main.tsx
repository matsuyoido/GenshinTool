import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import ReactDOM from "react-dom/client";
import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
  theme as baseTheme,
} from "@chakra-ui/react";
import App from "./App.tsx";

// https://chakra-ui.com/docs/styled-system/customize-theme
const theme = extendTheme(
  {
    colors: {
      // https://chakra-ui.com/docs/styled-system/theme
      brand: baseTheme.colors.teal,
    },
  },
  withDefaultColorScheme({ colorScheme: "brand" }),
);
const rootElement = document.getElementById("root") as HTMLElement;
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Router>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Router>
  </React.StrictMode>,
);
