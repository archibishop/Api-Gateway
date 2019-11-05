/* eslint-disable no-console */
import express from 'express';
import Docker from 'dockerode';
import { EventEmitter } from 'events';
import proxy from 'http-proxy-middleware';
import middlewareObj from './api/middleware/isAuthroized';

// Server
const app = express();

const docker = new Docker();
const mediator = new EventEmitter();


const containerMetaData = [];
// Port
const PORT = process.env.Port || 3001;

let authPort = '';

docker.listContainers((err, containers) => {
  containers.forEach((containerInfo) => {
    if (containerInfo.Names[0] === '/auth-service' || containerInfo.Names[0] === '/meal-service') {
      console.log(containerInfo.Ports[0].PublicPort);
      const metaContainer = {
        route: containerInfo.Labels.apiRoute,
        port: containerInfo.Ports[0].PublicPort,
      };
      if (containerInfo.Labels.apiRoute.includes('users')) {
        authPort = containerInfo.Ports[0].PublicPort;
      }
      containerMetaData.push(metaContainer);
    }
  });
  mediator.emit('onComplete');
});

mediator.on('onComplete', () => {
  const authMiddleware = middlewareObj(authPort);
  containerMetaData.forEach((value) => {
    const { route, port } = value;
    const target = `http://0.0.0.0:${port}`;
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
