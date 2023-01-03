


const addGameWeek = (GameWeek) => async ({ gameWeek, startDate, endDate }) => {

    if(!startDate || !endDate || !gameWeek )
        throw new Error('Incomplete parameters')

    const savedGameWeek = new GameWeek({ gameWeek, startDate, endDate })

    return savedGameWeek.save()
}


const getGameWeeks = (GameWeek) => async () => {
    const gameWeeks = await GameWeek.find();

    return gameWeeks;
}

const getGameByWeek = (GameWeek) => async (gameWeek) => {
    let game = await GameWeek.findOne({ gameWeek })

    return game;
}

const deleteGameWeek = (GameWeek) => async (_id) => {
    const data = await GameWeek.deleteOne({_id})

    if(data.deletedCount === 1) return true

    return false;
}

const updateGameWeek = (GameWeek) => async (id, updateQuery = {}) => {

    const updatedGameWeek = await GameWeek.findByIdAndUpdate(id, updateQuery, {
        new: true,
    });

    return updatedGameWeek
}


module.exports = (GameWeek) => {
    return {

        addGameWeek: addGameWeek(GameWeek),
        getGameWeeks: getGameWeeks(GameWeek),
        getGameByWeek: getGameByWeek(GameWeek),
        deleteGameWeek: deleteGameWeek(GameWeek),
        updateGameWeek: updateGameWeek(GameWeek)
    }
}