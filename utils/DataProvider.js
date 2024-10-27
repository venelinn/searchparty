import React, { useContext, useState, createContext, useMemo } from "react"

const DataContext = createContext([{}, () => {}]);

export function useData() {
  return useContext(DataContext)
}
export const initState = {
	messages: [],
}
export function DataProvider({children}) {
  // Global state
  const [state, setState] = useState({
    ...initState
  });
  const providerValue = useMemo(() => ( [state, setState]), [state, setState])

  return (
    <DataContext.Provider value={providerValue}>
      {children}
    </DataContext.Provider>
  )
}