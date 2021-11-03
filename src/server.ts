import express, { Request, Response } from 'express';
import path from 'path';
import { jobRoutes } from './jobs';


const appName = `metiers.numerique.gouv.fr`;
const appDescription = 'Tout savoir sur les métiers du numérique au sein de l’Etat';
const appRepo = 'https://github.com/betagouv/metiers-numeriques';
const appRoot = path.resolve(__dirname);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// app.use('/static', express.static('../static'));
app.use('/static', express.static(path.join(__dirname, '../static')));
// Hack for importing css from npm package
app.use('/~', express.static(path.join(__dirname, '../node_modules')));
// Populate some variables for all views
app.use(function(req: Request, res: Response, next) {
    res.locals.appName = appName;
    res.locals.appDescription = appDescription;
    res.locals.appRepo = appRepo;
    res.locals.page = req.url;
    res.locals.appRoot = appRoot;
    next();
});

app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
    res.render('landing', {
        contactEmail: 'contact@metiers.numerique.gouv.fr',
    });
});

app.get('/mentions-legales', (_req: Request, res: Response) => {
    res.render('legalNotice', {
        pageTitle: 'Mentions légales',
        contactEmail: 'contact@metiers.numerique.gouv.fr',
    });
});

app.get('/suivi', (_req, res) => {
    res.render('suivi', {
        contactEmail: 'contact@metiers.numerique.gouv.fr',
    });
});

app.use('/', jobRoutes);

export default app;
