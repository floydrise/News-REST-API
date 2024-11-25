const endpointsJSON = require('../endpoints.json');
const {fetchAllTopics} = require("./model");

const getApi = (req, res, next) => {
    res.status(200).send({endpoints: endpointsJSON});
};

const getTopics = async (req, res, next) => {
    try {
        const topics = await fetchAllTopics();
        res.status(200).send({topics});
    } catch (err) {
        next(err);
    }
}

module.exports = {getApi, getTopics};