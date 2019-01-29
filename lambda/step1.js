exports.handler = async (event) => {
    // simply respond with all inputs from request
    const response = {
        statusCode: 200,
        body: JSON.stringify(event),
    };
    return response;
};