
const getPointsPerSpeed = (time) => {
    let point = 1;

    switch (time) {
        case 0:
        case 1:
        case 2:
        case 3:
            point = 1.5;
            break;
        case 4:
        case 5:
        case 6:
            point = 1.2;
            break;
        case 7:
        case 8:
        case 9:
        case 10:
            point = 1;
            break;
        default:
            break;
    }

    return point;
}

const calcGameScore = (answers) => {

    let results = []

    let totalScore = answers
    // .filter(
    //     (item) =>
    //     item.isCorrect === true
    // )
    .reduce((accumulator, item) => {
        let data = {
            isCorrect: item.isCorrect,
            timeTaken: item.timeTaken
        }

        if(item.isCorrect === true){
            let points =  getPointsPerSpeed(parseInt(item.timeTaken));
            data.points = points;
            results.push(data)
            return accumulator + points;
        }else{
            data.points = 0
            results.push(data)
            return accumulator + 0;
        }
        
    }, 0);

    // console.log("in score calc: ", results)

    return {totalScore, breakdown: results};
}

module.exports = {
    calcGameScore: calcGameScore
}