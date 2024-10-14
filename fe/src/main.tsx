import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { store, persistor } from "./redux/store.ts";
import "./index.scss";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ConfigProvider
            theme={{
              token:{
                colorPrimary: "#AC7AF7",
              },
            }}
          >
            <App />
          </ConfigProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
