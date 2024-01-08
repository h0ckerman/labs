const initialState = {
    data: [],
    employeeData: [],
    user: { username: '', email: '' },
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_DATA':
        return { ...state, data: action.payload };
      case 'SET_EMPLOYEE_DATA':
        return { ...state, employeeData: action.payload };
      case 'SET_USER':
        return { ...state, user: action.payload };
      case 'CLEAR_USER':
        return { ...state, user: { username: '', email: '' } };
      default:
        return state;
    }
  };
  
  export default rootReducer;
  