

// const isValidTime = (time) => {
//     let regex = new RegExp(/^([01]\d|2[0-3]):?([0-5]\d)$/);

// 	if (time == null) {
// 		return false;
// 	}

//     return regex.test(time);
// }

const isValidTimePeriod = ({startDate, endDate}) => {
    try{
        let startDt = new Date(startDate);
        let endDt = new Date(endDate);

        if(endDt < startDt){

            return false;
        } 

        return true;

    }catch(error){

        console.log(error.message, ' - date order');
        return false
    }
}

module.exports = {
    isValidTimePeriod
};