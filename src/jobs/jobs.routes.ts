import { Router } from 'express';
import * as jobController from './jobs.controller';

const jobsRoutes = Router();
jobsRoutes.get('/annonces/', jobController.list);
jobsRoutes.get('/annonces/:id', jobController.get);

jobsRoutes.get('/ministeres', jobController.listMinistries);
jobsRoutes.get('/ministeres/:id', jobController.getMinistry);

export default jobsRoutes;
