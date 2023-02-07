function getGameData(category, gameWeek, user) {

    return {
        category: category,
        player: user,
        score: 10,
        gameWeek: gameWeek

    }
}

module.exports = getGameData;