import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainContextProvider from "./Context/MainContextProvider";
import Router from "./Router/Router";
import { ToastContainer } from "react-toastify";
import "animate.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MainContextProvider>
        <Router></Router>
        <ToastContainer></ToastContainer>
      </MainContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
