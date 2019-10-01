import axios from 'axios';

const isAuthroized = async (req, res, next) => {
    const token = req.headers['x-access-token'];
    const headers = {
        'x-access-token': token
    }
    try {
        if (token) {
            const response = await axios.get('http://0.0.0.0:3070/api/v1/users/secure', { headers });
            next()
        } else {
            res.send({
                success: false,
                message: "Please provide token for authentication.",
            });
        }
    } catch(err){
        const { data, status }  = err.response
        if (data.message === 'jwt expired'){
            console.log("token has expired");
        }
        res.send({
            success: false,
            message: "Autehntication failed.",
            status,
            data
        });
    }
}

export default isAuthroized;
