"use strict";

const saveOrUpdateSettings = (GameSetting) => async (data) => {

    const existing = await GameSetting.find()

    // console.log("in create: ", existing)

    if (existing.length > 0) {
        let setting = existing[existing.length - 1];
        // console.log("Setting last: ", setting);

        return await updateSetting(GameSetting)(setting._id, data)


    } else {
        const newSetting = new GameSetting(data)

        return newSetting.save()
    }

}


const setCurrentGameWeek = (GameSetting) => async (gameweek) => {

    const existing = await GameSetting.find()

    // console.log("in create: ", existing)

    if (existing.length > 0) {
        let setting = existing[existing.length - 1];
        // console.log("Setting last: ", setting);

        return await updateSetting(GameSetting)(setting._id, {currentGameWeek: gameweek})


    } else {
        const newSetting = new GameSetting({ currentGameWeek: gameweek })

        return newSetting.save()
    }

}

// const deleteQuestion = (Question) => async (id) => {
//     const question = await Question.findByIdAndDelete(id)

//     return question;
// }


const updateSetting = (GameSetting) => async (id, data) => {

    const updatedSetting = await GameSetting.findByIdAndUpdate(id, data, {
        new: true,
    });

    return updatedSetting

}


const getSettings = (GameSetting) => async () => {
    const settings = await GameSetting.find();

    if(settings.length > 0) return settings[0]

    return null;
}

const getBuyList = (GameSetting) => async () => {
    const settings = await GameSetting.find();

    if(settings.length > 0){
        let setting = settings[0];
        let cost = setting.costPerCredit
        let bList = setting.creditBuyList;

        if(!cost || !bList || bList.length == 0) throw new Error('Invalid Credit Purchase Settings')

        let creditsList = []

        bList.forEach(element => {
            creditsList.push({
                credit: element,
                cost: element * cost
            })
        });

        return creditsList

    } 
    

    return null;
}


const getGameSettings = (GameSetting, gameCategoryService) => async () => {

    try {

        const settings = await GameSetting.find();

        let setData = (settings.length > 0) ? settings[0] : nulls

        const categories = await gameCategoryService.getCategories(0);

        return { settings: setData, categories };

    } catch (err) {
        throw new Error('Error in fetching game settings')
    }

}


module.exports = (GameSetting, gameCategoryService) => {
    return {

        saveOrUpdateSettings: saveOrUpdateSettings(GameSetting),
        getBuyList: getBuyList(GameSetting),
        getSettings: getSettings(GameSetting),
        setCurrentGameWeek: setCurrentGameWeek(GameSetting),
        getGameSettings: getGameSettings(GameSetting, gameCategoryService)
        // getActiveCategories: getActiveCategories(GameSetting)

    }
}