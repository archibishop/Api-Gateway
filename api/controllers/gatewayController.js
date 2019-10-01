import axios from 'axios';

class GatewayController {

    async createUser(req, res) {
        const { body } = req;
        try {
            const output = await axios.post('http://0.0.0.0:3070/api/v1/users', { ...body });
            res.send(output.data);
        } catch (err) {
            res.send(err.response.data);
        }
    }

    async loginUser(req, res) {
        const { body } = req;
        try {
            const output = await axios.post('http://0.0.0.0:3070/api/v1/users/login', { ...body });
            res.send(output.data);
        } catch (err) {
            res.send(err.response.data);
        }
    }

    async getUsers(req, res) {
        const { body } = req;
        try {
            const output = await axios.get('http://0.0.0.0:3070/api/v1/users');
            res.send(output.data);
        } catch (err) {
            res.send(err.response.data);
        }
    }

    async activateUserAccount(req, res) {
        const { id } = req.params;
        try {
            const output = await axios.get('http://0.0.0.0:3070/api/v1/users/activate/' + id );
            res.send(output.data);
        } catch (err) {
            res.send(err.response.data);
        }
    }

    async resetPassword(req, res) {
        const { body } = req;
        try {
            const output = await axios.post('http://0.0.0.0:3070/api/v1/users/reset-password', { ...body });
            res.send(output.data);
        } catch (err) {
            res.send(err.response.data);
        }
    }

}

export default new GatewayController();
