export const countInitState = {
    count: 0
}

export function countReducer(state, action) {
    switch (action.type) {
        case 'increment': {
            return {
                ...state,
                count: state.count + (action.value || 1)
            }
        }
        case 'decrement': {
            return {
                ...state,
                count: state.count - 1
            }
        }
        default:
            return state;
    }
}