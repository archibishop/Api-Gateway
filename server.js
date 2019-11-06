/* eslint-disable no-console */
import express from 'express';
import Docker from 'dockerode';
import { EventEmitter } from 'events';
import proxy from 'http-proxy-middleware';
import middlewareObj from './api/middleware/isAuthroized';

// Server
const app = express();

const docker = new Docker({ socketPath: '/var/run/docker.sock' });
const mediator = new EventEmitter();


const containerMetaData = [];
// Port
const PORT = process.env.Port || 3001;

let authPort = '';
let authIp = '';

docker.listContainers((err, containers) => {
  containers.forEach((containerInfo) => {
    if (containerInfo.Names[0] === '/auth-service' || containerInfo.Names[0] === '/meal-service') {
      console.log(containerInfo.Ports[0]);
      const metaContainer = {
        route: containerInfo.Labels.apiRoute,
        publicPort: containerInfo.Ports[0].PublicPort,
        privatePort: containerInfo.Ports[0].PrivatePort,
        ipAddress: containerInfo.NetworkSettings.Networks['auth-service_default'].IPAddress,
      };
      if (containerInfo.Labels.apiRoute.includes('users')) {
        authPort = containerInfo.Ports[0].PrivatePort;
        authIp = containerInfo.NetworkSettings.Networks['auth-service_default'].IPAddress;
      }
      containerMetaData.push(metaContainer);
    }
  });
  mediator.emit('onComplete');
});

mediator.on('onComplete', () => {
  const authMiddleware = middlewareObj(authIp, authPort);
  containerMetaData.forEach((value) => {
    const { route, ipAddress, privatePort } = value;
    const target = `http://${ipAddress}:${privatePort}`;
    app.use(
      route,
      authMiddleware.authenticationMiddleWare,
      proxy({ target, changeOrigin: true }),
    );
  });
  app.listen(PORT, () => {
    console.log(`listening at port ${PORT}`);
  });
});

export default app;
