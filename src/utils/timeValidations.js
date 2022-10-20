const getBeginningOfTheMatchday = () => {
    var now = new Date();
    const days = (now.getDay() + 7 - 2) % 7;
    now.setDate(now.getDate() - days);
    now.setHours(9, 0, 0, 0);
    return now;
};

const checkTodayWithinMatchday = () => {

    var dt = new Date('October 18, 2022 05:50:39');
    const day = dt.getDay();
    console.log("Today's date: ", dt)
    console.log("In check - Day: ", dt.getDay())

    if (!(day >= 2 && day <= 5))
        return false

    console.log("Within week day")

    const matchDayStart = getBeginningOfTheMatchday();
    console.log("Beginning of matchday date: ", matchDayStart)

    if(dt<matchDayStart){
        console.log("New Matchday not started")
        return false
    }

    return true
}

module.exports = checkTodayWithinMatchday;