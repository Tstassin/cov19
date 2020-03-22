import React, { createContext, useContext, useReducer, useState } from 'react'

const StoreContext = createContext()

export const StoreProvider = ({ children }) => {
    const [toggleLogarithmicScale, setToggleLogarithmicScale] = useState(false)

    return (
        <StoreContext.Provider value={{ toggleLogarithmicScale, setToggleLogarithmicScale }}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStore = () => useContext(StoreContext)