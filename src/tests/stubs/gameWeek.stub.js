
module.exports = {
        valid: {
            gameWeek: 1, startDate: '01/01/2022', endDate: '08/01/2022', startTime: '02:15', endTime: '20:30'
        },
        valid2: {
            gameWeek: 2, startDate: '01/01/2022', endDate: '08/01/2022', startTime: '02:15', endTime: '10:30'
        },
        invalid: {
            gameWeek: 1, startDate: '01/01/2022'
        },
        invalidTime: {
            gameWeek: 1, startDate: '01/02/2022', endDate: '08/01/2021', startTime: '12:15', endTime: '10:30'
        }
};
