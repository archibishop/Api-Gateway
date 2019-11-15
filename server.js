/* eslint-disable no-console */
import express from 'express';
import { EventEmitter } from 'events';
import proxy from 'http-proxy-middleware';
import middlewareObj from './middleware/isAuthroized';

const k8s = require('@kubernetes/client-node');

// Server
const app = express();

const mediator = new EventEmitter();

// Kubernetes
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const containerMetaData = [];
// Port
const PORT = process.env.Port || 3001;

let authPort = '';
let authIp = '';

k8sApi.listNamespacedService('default').then((res) => {
  res.body.items.forEach((item) => {
    console.log('All default namespaced services');
    // Service Information
    if (item.metadata.annotations) {
      console.log('Here inside Annotations');
      if (item.metadata.annotations.apiRoute) {
        const metaContainer = {
          route: item.metadata.annotations.apiRoute,
          publicPort: item.spec.ports[0].port,
          privatePort: item.spec.ports[0].targetPort,
          ipAddress: item.spec.clusterIP,
        };
        if (item.metadata.annotations.apiRoute.includes('users')) {
          authPort = item.spec.ports[0].port;
          authIp = item.spec.clusterIP;
        }
        containerMetaData.push(metaContainer);
      }
    }
  });
  mediator.emit('onComplete');
}).catch((err) => {
  console.log('An error has occurred', err);
  mediator.emit('onComplete');
});

mediator.on('onComplete', () => {
  const authMiddleware = middlewareObj(authIp, authPort);
  containerMetaData.forEach((value) => {
    const { route, ipAddress, publicPort } = value;
    const target = `http://${ipAddress}:${publicPort}`;
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
