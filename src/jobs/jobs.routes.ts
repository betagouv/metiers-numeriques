import { Router } from 'express';
import * as jobController from './jobs.controller';

const jobsRoutes = Router();
jobsRoutes.get('/annonces/', jobController.list);
jobsRoutes.all('/annonces/new', jobController.add);
jobsRoutes.all('/annonces/:id', jobController.get);

jobsRoutes.get('/institutions/', jobController.listInstitutions);
jobsRoutes.all('/institutions/new', jobController.addInstitution);
jobsRoutes.all('/institutions/:id', jobController.getInstitution);

export default jobsRoutes;
