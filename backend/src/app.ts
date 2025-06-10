import express from 'express';
import bodyParser from 'body-parser';
import { setBoardRoutes } from './routes/boardRoutes';
import { setListRoutes } from './routes/listRoutes';
import { setCardRoutes } from './routes/cardRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

setBoardRoutes(app);
setListRoutes(app);
setCardRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});