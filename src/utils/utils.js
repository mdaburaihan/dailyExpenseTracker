export const  getCurrentYear = () => {
    return new Date().getFullYear();
}

export const  getCurrentMonth = () => {
    return new Date().getMonth()+1;
}

export const getMonthlyLimitSlug = (userId) => {
    return `${userId}_${getCurrentYear()}_${getCurrentMonth()}`;
}
