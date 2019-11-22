#!/bin/bash
create_resources_from_file() {
    kubectl create -f $1
    if [ $? -eq 0 ]; then
        echo Success
    else
        echo FAIL
        exit 1
    fi
}

echo "Setup Kubernetes For Meal Service .... "
# kubectl create -f database-service.yaml
create_resources_from_file database-service.yaml
# kubectl create -f database-deployment.yaml
create_resources_from_file database-deployment.yaml
# kubectl create -f redis-1-service.yaml
create_resources_from_file redis-1-service.yaml
# kubectl create -f redis-1-deployment.yaml
create_resources_from_file redis-1-deployment.yaml
# kubectl create -f web-1-service.yaml
create_resources_from_file web-1-service.yaml
# kubectl create -f web-1-deployment.yaml
create_resources_from_file web-1-deployment.yaml
# kubectl create -f web-1-claim0-persistentvolumeclaim.yaml
create_resources_from_file web-1-claim0-persistentvolumeclaim.yaml
echo "Finished Creating Pods For Meal Service."
echo "Setup Kubernetes For Authentication Service .... "
kubectl create -f db-service.yaml
kubectl create -f db-deployment.yaml
kubectl create -f redis-service.yaml
kubectl create -f redis-deployment.yaml
kubectl create -f web-service.yaml
kubectl create -f web-deployment.yaml
kubectl create -f web-claim0-persistentvolumeclaim.yaml
echo "Finished Creating Pods For Authentication Service."
echo "Setting Up Kubernetes For Api Gateway."
kubectl create -f app-service.yaml
kubectl create -f app-deployment.yaml
kubectl create -f app-claim0-persistentvolumeclaim.yaml
kubectl create -f app-claim1-persistentvolumeclaim.yaml
echo "Done Setting up Kubernetes ."
