"use strict";

const { isValidTime, isValidTimePeriod } = require('../../utils/timeValidations');

describe('Time Validations', () => {

    // describe('isValidTime', () => {
    //     it('should return true if time format is valid else return false', async () => {
    //         let str2 = "02:15";
    //         let str3 = "24:00";
    //         let str4 = "10:60";
    //         let str5 = "10:15 PM";
    //         let str6 = null;

    //         expect(isValidTime(str2)).toBeTruthy();
    //         expect(isValidTime(str3)).toBeFalsy();
    //         expect(isValidTime(str4)).toBeFalsy();
    //         expect(isValidTime(str5)).toBeFalsy();
    //         expect(isValidTime(str6)).toBeFalsy();
    //     });
    // });

    describe('isValidTimePeriod', () => {
        let timePeriod = {
            startDate: "02/01/2022",
            endDate: "07/01/2022",
        }
        let timePeriod2 = {
            startDate: "02/02/2022",
            endDate: "01/01/2022",
        }
        let timePeriod3 = {
            startDate: "02/02/2022",
            endDate: "01/01",
        }

        it('should return true if time period is valid else return false', async () => {
            
            expect(isValidTimePeriod(timePeriod)).toBeTruthy();
            expect(isValidTimePeriod(timePeriod2)).toBeFalsy();
            expect(isValidTimePeriod(timePeriod3)).toBeFalsy();
        });
    });

})