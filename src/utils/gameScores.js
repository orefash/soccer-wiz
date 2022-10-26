
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

    let totalScore = answers
    .filter(
        (item) =>
        item.isCorrect === true
    )
    .reduce((accumulator, item) => {
        return accumulator + getPointsPerSpeed(parseInt(item.timeTaken));
    }, 0);

    return totalScore;
}

module.exports = {
    calcGameScore: calcGameScore
}