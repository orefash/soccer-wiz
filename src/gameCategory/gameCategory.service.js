

const saveCategory = (GameCategory) => async (data) => {

    const existing = await GameCategory.findOne({ category: data.category })

    // console.log("in create: ", data)

    if (existing)
        throw new Error("Categroy already exists")

    const newCategory = new GameCategory(data)

    return newCategory.save()
}

const deleteCategory = (GameCategory) => async (id) => {
    const category = await GameCategory.findByIdAndDelete(id)

    return category;
}


const deleteAllCategories = (GameCategory) => async (id) => {
    const data = await GameCategory.deleteMany({});

    return data;
}

// const updateSetting = (GameSetting) => async (id, data) => {

//     const updatedSetting = await GameSetting.findByIdAndUpdate(id, data, {
//         new: true,
//     });

//     return updatedSetting

// }


const getCategoryByName = (GameCategory) => async (category) => {
    const categoryData = await GameCategory.findOne({ category });

    return categoryData;
}

const getCategories = (GameCategory) => async (active = 1) => {

    let categories = null;

    if(active === 1){

        categories = await GameCategory.find()

        return categories;
    }
     
    categories = await GameCategory.find({
        "isActive": true
    })

    return categories;
}

// const getQuestionById = (Question) => async (id) => {

//     const question = await Question.findById(id);

//     return question;
// }


module.exports = (GameCategory) => {
    return {

        saveCategory: saveCategory(GameCategory),
        getCategories: getCategories(GameCategory),
        deleteCategory: deleteCategory(GameCategory),
        getCategoryByName: getCategoryByName(GameCategory),
        deleteAllCategories: deleteAllCategories(GameCategory)
        // updateSetting: updateSetting(GameSetting),
        // getSettings: getSettings(GameSetting),
        // getActiveCategories: getActiveCategories(GameSetting)

    }
}