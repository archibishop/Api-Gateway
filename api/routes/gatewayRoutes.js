import express from 'express';
import isAuthorized from '../middleware/isAuthroized';
import GatewayController from '../controllers/gatewayController';

const router = express.Router();


router.get('/request', isAuthorized, (req, res)=> {
    res.send({
        message: "The request has been sucessfully processed."
    });
});

router.post('/api-gateway/v1/users', GatewayController.createUser);

router.post('/api-gateway/v1/users/login', GatewayController.loginUser);

router.get('/api-gateway/v1/users', GatewayController.getUsers);

router.get('/api-gateway/v1/users/activate/:id', GatewayController.activateUserAccount);

router.post('/api-gateway/v1/users/reset-password', GatewayController.resetPassword);

router.get('/api-gateway/v1/users/meals', isAuthorized, GatewayController.getMeals);

router.post('/api-gateway/v1/users/meals', isAuthorized, GatewayController.addMeal);

router.delete('/api-gateway/v1/users/meals/:id', isAuthorized, GatewayController.deleteMeal);

export default router;
