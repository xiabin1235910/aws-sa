import moment from "moment";

export const dateFromNow = (date: number, lang: string) => {
    return date && moment(date).locale(lang).fromNow() || '';
};