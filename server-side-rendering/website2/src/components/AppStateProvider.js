import React, { useContext, useReducer } from 'react'
import PropTypes from 'prop-types';

const ReduxContext = React.createContext();

export function AppStateProvider({ initState, reducers, children }) {
    const value = useReducer(reducers, initState);

    return (
        <ReduxContext.Provider value={value}>
            {children}
        </ReduxContext.Provider>
    )
}

AppStateProvider.propTypes = {
    initState: PropTypes.object,
    reducers: PropTypes.func,
}

export function useAppState() {
    return useContext(ReduxContext)
}