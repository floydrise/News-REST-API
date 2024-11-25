const endpointsJSON = require('../endpoints.json');
const {} = require("");

const getApi = (req,res,next) => {
    res.status(200).send({endpoints: endpointsJSON});
};

module.exports = {getApi};