import React, { createContext, useContext, useReducer, useState } from 'react'

const defaultState = {
}
const StoreContext = createContext(defaultState)

export const StoreProvider = ({ children }) => {
    const [toggleLogarithmicScale, setToggleLogarithmicScale] = useState(false)

    return (
        <StoreContext.Provider value={{ toggleLogarithmicScale, setToggleLogarithmicScale }}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStore = () => useContext(StoreContext)