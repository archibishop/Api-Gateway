import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import gatewayRoutes from './api/routes/gatewayRoutes';

// Server
const app = express();

// Port
const PORT = process.env.Port || 3001;

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use(gatewayRoutes);

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on Port ${PORT}`);
});

export default app
