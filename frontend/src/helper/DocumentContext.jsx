import { createContext, useContext } from "react";

export const DocumentContext = createContext(null);

export const useDocument = () => useContext(DocumentContext);
