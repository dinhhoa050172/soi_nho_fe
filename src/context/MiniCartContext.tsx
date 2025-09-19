import { createContext, useContext } from "react";
export const MiniCartContext = createContext<{ openMiniCart: () => void }>({ openMiniCart: () => {} });
export const useMiniCart = () => useContext(MiniCartContext);