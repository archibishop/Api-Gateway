import axios from 'axios';

const middleWareObj = (authIp, authPort) => {
  const unAuthenticatedRoutes = ['/api/v1/users/login', '/api/v1/users', '/api/v1/users/secure'];

  const authenticationMiddleWare = async (req, res, next) => {
    if (unAuthenticatedRoutes.includes(req.originalUrl)) {
      next();
    } else {
      const token = req.headers['x-access-token'];
      const refreshToken = req.headers['refresh-token'];
      const headers = {
        'x-access-token': token,
      };
      try {
        if (token && refreshToken) {
          await axios.get(`http://${authIp}:${authPort}/api/v1/users/secure`, { headers });
          next();
        } else {
          res.send({
            success: false,
            message: 'Please provide token and refresh-token for authentication.',
          });
        }
      } catch (err) {
        const { data, status } = err.response;
        if (data.message === 'jwt expired') {
          try {
            await axios.post(`http://${authIp}:${authPort}/api/v1/users/refresh-token`, { refreshToken });
            // TODO ::
            // Use web sockets to send a push to the front-end.
            // Proceed with the request since a new token has been generated and sent to front-end.
            next();
          } catch (error) {
            res.send({
              success: false,
              message: 'Autehntication failed.',
              status,
              data,
            });
          }
          res.send({
            message: 'Testing refresh tokens.',
          });
        } else {
          res.send({
            success: false,
            message: 'Autehntication failed.',
            status,
            data,
          });
        }
      }
    }
  };
  return Object.create({
    authenticationMiddleWare,
  });
};

export default middleWareObj;
