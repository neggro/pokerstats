import i18n from '../i18n';

export default {

    formatDate(timeStamp) {

        const SELECTED_DATE = new Date(timeStamp);
        let MONTH_NUMBER = SELECTED_DATE.getMonth() + 1;
        let DATE_NUMBER = SELECTED_DATE.getDate();
        const FULL_YEAR = SELECTED_DATE.getFullYear();

        MONTH_NUMBER = MONTH_NUMBER < 10 ? '0' + MONTH_NUMBER : MONTH_NUMBER;
        DATE_NUMBER = DATE_NUMBER < 10 ? '0' + DATE_NUMBER : DATE_NUMBER;

        return i18n.locale.indexOf('en') === 0 ?
            `${MONTH_NUMBER}/${DATE_NUMBER}/${FULL_YEAR}` :
            `${DATE_NUMBER}/${MONTH_NUMBER}/${FULL_YEAR}`;
    }
};
