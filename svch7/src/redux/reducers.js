const initialState = {
    data: [],
    employeeData: [],
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_DATA':
            return { ...state, data: action.payload };
        case 'SET_EMPLOYEE_DATA':
            return { ...state, employeeData: action.payload };
        default:
            return state;
    }
};

export default rootReducer;
