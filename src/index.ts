import { config } from 'dotenv';
import app from './server';

config();

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
