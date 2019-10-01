import axios from 'axios';

const isAuthroized = async (req, res, next) => {
    const token = req.headers['x-access-token'];
    const refreshToken = req.headers['refresh-token'];
    const headers = {
        'x-access-token': token
    }
    try {
        if (token && refreshToken) {
            const response = await axios.get('http://0.0.0.0:3070/api/v1/users/secure', { headers });
            next()
        } else {
            res.send({
                success: false,
                message: "Please provide token and refresh-token for authentication.",
            });
        }
    } catch(err){
        const { data, status }  = err.response
        if (data.message === 'jwt expired'){
            console.log("token has expired");
            try {
                const response = await axios.post('http://0.0.0.0:3070/api/v1/users/refresh-token', { refreshToken });
                // TODO ::
                // Use web sockets to send a push to the front-end.
                console.log(response.data);
                // Proceed with the request since a new token has been generated and sent to the front-end.
                next();
            } catch (err) {
                res.send({
                    success: false,
                    message: "Autehntication failed.",
                    status,
                    data
                });
            }
            res.send({
                message: "Testing refresh tokens."
            });
        } else  {
            res.send({
                success: false,
                message: "Autehntication failed.",
                status,
                data
            });
        }
    }
}

export default isAuthroized;
