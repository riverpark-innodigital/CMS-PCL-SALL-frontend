import { format } from 'date-fns';
import { th, enUS } from 'date-fns/locale';

export const ThaiFormat = (date) => {
    const formatDate = format(new Date(date), 'dd MMMM yyyy', { locale: th });
    return formatDate;
}

export const EnglishFormat = (date) => {
    const formatDate = format(new Date(date), 'dd MMMM yyyy', { locale: enUS });
    return formatDate;
}