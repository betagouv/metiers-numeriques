module.exports = class Job {
    /**
     *
     * @param title string
     * @param mission string
     * @param objectives string[]
     * @param profile string
     * @param experience string[]
     * @param location string
     * @param department string
     * @param openedToContractTypes string[]
     * @param salary string
     * @param team string
     */
    constructor({title, mission, experience, location, department, openedToContractTypes, salary, team}) {
        this.title = title;
        this.mission = mission;
        this.experience = experience;
        this.location = location;
        this.department = department;
        this.openedToContractTypes = openedToContractTypes;
        this.salary = salary;
        this.team = team;
    }
};
