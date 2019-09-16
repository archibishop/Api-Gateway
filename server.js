import express from 'express';
import bodyParser from 'body-parser';

// Server
const app = express();

// Port
const PORT = process.env.Port || 3000;

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/test', (req, res) => {
    res.send({
        success: true,
        message: "The test has been successfull"
    })
});

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on Port ${PORT}`);
});

export default app
