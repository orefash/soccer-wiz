
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

const calcGameScore =  (answers) => {

    let correct = 0;
 
    let totalScore =  answers
    .reduce( (accumulator, item) => {

        if(item.isCorrect === true){
            let points = getPointsPerSpeed(parseInt(item.timeTaken));
            
            correct++;
            return accumulator + points;
        }else{
            return accumulator + 0;
        }
        
    }, 0);

    let speedBonus = totalScore - correct;

    return { totalScore: Math.round(totalScore * 10) / 10, speedBonus: Math.round(speedBonus * 10) / 10, noOfCorrect: correct, noOfQuestions: answers.length };
}

module.exports = {
    calcGameScore: calcGameScore
}