

const saveOrUpdateSettings = (GameSetting) => async (data) => {

    const existing = await GameSetting.find()

    // console.log("in create: ", existing)

    if (existing.length>0) {
        let setting = existing[existing.length-1];
        // console.log("Setting last: ", setting);

        return await updateSetting(GameSetting)(setting._id, data)


    } else {
        const newSetting = new GameSetting(data)

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

    return settings;
}



// const getQuestionById = (Question) => async (id) => {

//     const question = await Question.findById(id);

//     return question;
// }


module.exports = (GameSetting) => {
    return {

        saveOrUpdateSettings: saveOrUpdateSettings(GameSetting),
        // updateSetting: updateSetting(GameSetting),
        getSettings: getSettings(GameSetting)

    }
}