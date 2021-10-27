interface JobParams {
    mission: string;
    departments: string[];
    team: string;
    title: string;
    openedToContractTypes: string[]
}

class Job {
    constructor(private params: JobParams) {
        console.log(params)
    }

}
