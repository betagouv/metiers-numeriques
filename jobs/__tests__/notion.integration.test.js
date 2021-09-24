const usecases = require('../usecases');
const {NotionJobsService} = require('../infrastructure/NotionJobsRepository');
const jobsStub = require('./stubs/jobs.stub.json');
const axios = require('axios');
const Job = require('../entities');

jest.mock('axios');

describe('Jobs fetch api', () => {
    it('should fetch and return a list of job', async () => {
        axios.post.mockImplementation(() => Promise.resolve({data: jobsStub}));

        const result = await NotionJobsService.all();

        expect(result.length).toEqual(jobsStub.results.length);
        expect(result[0]).toEqual(new Job({
            id: 'acd471f0-2db5-4685-bdb7-eeaba1f03875',
            title: 'Data scientist F/H',
            mission: 'Vous serez chargé(e) de mettre en œuvre des projets de Data Science qui permettront d’appuyer la mise en œuvre des politiques publiques éducatives.',
            experiences: ['3 ans minimum dans la mise en œuvre de projets de Data Science'],
            location: ['61-65 rue Dutot 75015 Paris'],
            department: ['Ministère de l’éducation nationale de la jeunesse et des sports – Ministère de l’enseignement supérieur de la recherche et de l’innovation'],
            openedToContractTypes: ['Fonctionnaire', 'Contractuel.le'],
            salary: 'La rémunération est à définir en fonction de l’expérience et du profil',
            team: 'Au sein de la sous-direction des services numériques, vous intégrerez une équipe de 23 personnes (chefs de projets nationaux et concepteurs-développeurs) dédiée aux systèmes d\'information de gestion et du décisionnel.',
        }));
    });

    it('should fetch and return one job details', async () => {
        axios.post.mockImplementation(() => Promise.resolve({data: jobsStub}));

        const result = await NotionJobsService.get(jobsStub.results[0].id);

        expect(result).toEqual(new Job({
            id: 'acd471f0-2db5-4685-bdb7-eeaba1f03875',
            title: 'Data scientist F/H',
            mission: 'Vous serez chargé(e) de mettre en œuvre des projets de Data Science qui permettront d’appuyer la mise en œuvre des politiques publiques éducatives.',
            experiences: ['3 ans minimum dans la mise en œuvre de projets de Data Science'],
            location: ['61-65 rue Dutot 75015 Paris'],
            department: ['Ministère de l’éducation nationale de la jeunesse et des sports – Ministère de l’enseignement supérieur de la recherche et de l’innovation'],
            openedToContractTypes: ['Fonctionnaire', 'Contractuel.le'],
            salary: 'La rémunération est à définir en fonction de l’expérience et du profil',
            team: 'Au sein de la sous-direction des services numériques, vous intégrerez une équipe de 23 personnes (chefs de projets nationaux et concepteurs-développeurs) dédiée aux systèmes d\'information de gestion et du décisionnel.',
        }));
    });
});
