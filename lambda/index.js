exports.handler = async (event) => {
    // assert that input id is provided
    let id = null;
    try {
        id = event.pathParameters.id;
        if (!Number.isInteger(id)) {
            const response = {
                statusCode: 400,
                body: JSON.stringify({
                    msg: 'id not an integer'
                }),
            };
            return response;
        }
    } catch (e) {
        const response = {
            statusCode: 400,
            body: JSON.stringify({
                msg: 'id not provided'
            }),
        };
        return response;
    }

    // simply respond with input id
    const response = {
        statusCode: 200,
        body: JSON.stringify(event.pathParameters),
    };
    return response;
};