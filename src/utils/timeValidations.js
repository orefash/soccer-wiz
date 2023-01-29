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


const isValidTime = (time) => {
    let regex = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);

	if (time == null) {
		return false;
	}

    return regex.test(time);
}

const isValidTimePeriod = ({startDate, endDate, startTime, endTime}) => {
    try{
        let startDt = new Date(startDate);
        let endDt = new Date(endDate);

        if(endDt < startDt){
            console.log('date order')

            return false;
        } 

        if(!isValidTime(startTime) || !isValidTime(endTime)){

            console.log('time invalid')
            return false;
        } 

        return true;

    }catch(error){

        console.log(error.message, ' - date order');
        return false
    }
}

module.exports = {
    checkTodayWithinMatchday,
    isValidTime,
    isValidTimePeriod
};