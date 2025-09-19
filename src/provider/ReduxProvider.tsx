// providers/ReduxProvider.tsx
"use client";

import React, { ReactNode } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";
import { Provider } from "react-redux";
import Loading from "@/components/loading";

interface ReduxProviderProps {
  children: ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
