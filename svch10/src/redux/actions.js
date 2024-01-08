export const setData = (data) => ({
    type: 'SET_DATA',
    payload: data,
});

export const setEmployeeData = (employeeData) => ({
    type: 'SET_EMPLOYEE_DATA',
    payload: employeeData,
});

export const setUser = (user) => ({
    type: 'SET_USER',
    payload: user,
});

export const clearUser = () => ({
    type: 'CLEAR_USER',
});