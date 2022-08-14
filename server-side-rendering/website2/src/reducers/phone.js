export const phoneInitState = {
    phone: {
        number: ''
    }
}

export function phoneReducer(state, action) {
    switch (action.type) {
        case 'set_phone': {
            return {
                ...state,
                phone: {
                    number: action.value
                }
            }
        }
        default:
            return state;
    }
}