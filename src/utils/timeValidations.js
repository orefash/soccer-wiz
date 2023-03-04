

Date.prototype.isValid = function () {
    // An invalid date object returns NaN for getTime() and NaN is the only
    // object not strictly equal to itself.
    return this.getTime() === this.getTime();
};  

const isValidTimePeriod = ({startDate, endDate}) => {
    try{
        let startDt = new Date(startDate);
        let endDt = new Date(endDate);

        // console.log(`st: ${startDt} - end: ${endDt}`)
        // console.log(`start: ${startDate} - end: ${endDate}`)

        if(!startDt.isValid() || !endDt.isValid())  throw new Error('data is invalid');

        // console.log(`start: ${startDate} - - end: ${endDate}`);
        // console.log(`format: start: ${startDt} - - end: ${endDt}`);
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