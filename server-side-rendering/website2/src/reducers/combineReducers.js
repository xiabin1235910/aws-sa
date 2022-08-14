import { countInitState, countReducer } from './count';
import { phoneInitState, phoneReducer } from './phone';

export const initState = {
    ...countInitState,
    ...phoneInitState,
}

export const appliedReducers = combineReducers({
    count: countReducer,
    phone: phoneReducer,
})

export function combineReducers(reducers) {
    return (state, action) => {
        return Object.keys(reducers).reduce((acc, key) => {
            return {
                ...acc,
                ...reducers[key]({ [key]: acc[key] }, action)
            }
        }, state)
    }
}