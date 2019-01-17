// creates a date object that ends at the end of the current day
export default () => {
    const expire = new Date();

    expire.setDate(expire.getDate() + 1);
    expire.setHours(0);
    expire.setMinutes(0);
    expire.setSeconds(0);

    return expire;
};
