const mysql = require('promise-mysql');

exports.handler = async (event) => {
    // assert that id was provided
    let id = null;
    try {
        id = event.pathParameters.id;
    } catch (e) {
        const response = {
            statusCode: 400,
            body: JSON.stringify({
                msg: 'id not provided'
            }),
        };
        return response;
    }

    // create connection to database
    let connection = null;
    try {
        connection = await mysql.createConnection({
            host: "<host>",
            user: "<user>",
            password: "<password>",
            database: "<db>"
        });
    } catch (e) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                msg: 'db unavailable'
            }),
        };
        return response;
    }
    
    // assert account manager exists
    try {
        let result = await connection.query('select id from accountmanagers where id=' + id);

        if (result.length >= 1) {
            console.log('account manager ' + id + ' exists');
        } else {
            connection.end();
            console.log('account manager ' + id + ' does not exist');
            const response = {
                statusCode: 404,
                body: JSON.stringify({
                    msg: 'id does not exist'
                }),
            };
            return response;
        }
    } catch (e) {
        connection.end();
        
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                msg: 'db query failed'
            }),
        };
        return response;
    }

    // assert account manager does not exist in accountmanagergroupmembers table
    try {
        let result = await connection.query('select accountmanagerid from accountmanagergroupmembers where accountmanagerid=' + id);

        if (result.length < 1) {
            console.log('account manager ' + id + ' does not exist in accountmanagergroupmembers table');
        } else {
            connection.end();
            console.log('account manager ' + id + ' exists in accountmanagergroupmembers table');
            const response = {
                statusCode: 400,
                body: JSON.stringify({
                    msg: 'account manager belongs to a group'
                }),
            };
            return response;
        }
    } catch (e) {
        connection.end();
        
        const response = {
            statusCode: 500,
            body: JSON.stringify({
                msg: 'db query failed'
            }),
        };
        return response;
    }

    await connection.end();
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(event.pathParameters),
    };
    return response;
};
