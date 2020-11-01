import * as dayjs from 'dayjs'
export const initialState = {
    date: dayjs(),
    daysArr: [],
    pokemonArr: [],
    typeArr: [],
    currentType: null
}

export const reducer = (state, action) => {
    switch (action.type) {
        case "UPDATE":
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
}