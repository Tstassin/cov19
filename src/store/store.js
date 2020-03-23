import React, { createContext, useContext, useState } from 'react'

const defaultState = {
}
const StoreContext = createContext(defaultState)

export const StoreProvider = ({ children }) => {
    const [toggleLogarithmicScale, setToggleLogarithmicScale] = useState(false)
    const [normalizePopulations, setNormalizePopulations] = useState(false)
    const [commonOrigin, setCommonOrigin] = useState(false)

    return (
        <StoreContext.Provider value={{ toggleLogarithmicScale, setToggleLogarithmicScale, normalizePopulations, setNormalizePopulations, commonOrigin, setCommonOrigin }}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStore = () => useContext(StoreContext)