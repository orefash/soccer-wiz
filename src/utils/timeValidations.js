const getBeginningOfTheMatchday = (now) => {

    const days = (now.getDay() + 7 - 2) % 7;
    now.setDate(now.getDate() - days);
    now.setHours(9, 0, 0, 0);
    return now;
};

const checkTodayWithinMatchday = (dt) => {

    const day = dt.getDay();

    if (!(day >= 2 && day <= 5)){
        return false
    }

    const matchDayStart = getBeginningOfTheMatchday(dt);

    if(dt<matchDayStart){
        return false
    }

    return true 
}

module.exports = checkTodayWithinMatchday;