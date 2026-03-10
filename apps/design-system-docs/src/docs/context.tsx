import React from "react";

import type { DocPage } from "./types";

const CurrentDocContext = React.createContext<DocPage | null>(null);

export function CurrentDocProvider({
  doc,
  children,
}: {
  doc: DocPage;
  children: React.ReactNode;
}) {
  return (
    <CurrentDocContext.Provider value={doc}>
      {children}
    </CurrentDocContext.Provider>
  );
}

export function useCurrentDoc() {
  return React.useContext(CurrentDocContext);
}
