const fixedDateProvider = {
    date: (date) => {
        return date;
    }
}

const systemDateProvider =  {
    date: () => {
        return new Date();
    }
}

module.exports = {
    fixedDateProvider,
    systemDateProvider
}


