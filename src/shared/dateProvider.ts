export interface DateProvider {
    date: (date?: Date) => Date;
}

export const fixedDateProvider: DateProvider = {
    date(date: Date = new Date()) {
        return date;
    },
};

export const systemDateProvider: DateProvider = {
    date() {
        return new Date();
    },
};
