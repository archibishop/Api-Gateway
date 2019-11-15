#!/bin/bash
echo "Setting Up Kubernetes For Api Gateway."
kubectl create -f app-service.yaml
kubectl create -f app-deployment.yaml
kubectl create -f app-claim0-persistentvolumeclaim.yaml
kubectl create -f app-claim1-persistentvolumeclaim.yaml
echo "Done."
