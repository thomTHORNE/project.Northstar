import type { PrimeVueLocaleOptions } from "primevue/config";

/**
 * Localize what is needed from PrimeVueLocaleOptions interface.
 * Instruction on how to use this: https://primevue.org/configuration/#locale 
 */
export const CustomPrimeVueLocaleOptions: Partial<PrimeVueLocaleOptions> = {
    /**
     * d - day of month (no leading zero)
     * dd - day of month (two digit)
     * o - day of the year (no leading zeros)
     * oo - day of the year (three digit)
     * D - day name short
     * DD - day name long
     * m - month of year (no leading zero)
     * mm - month of year (two digit)
     * M - month name short
     * MM - month name long
     * y - year (two digit)
     * yy - year (four digit)
     * @ - Unix timestamp (ms since 01/01/1970)
     * ! - Windows ticks (100ns since 01/01/0001)
     * '...' - literal text
     * '' - single quote
     * anything else - literal text
     */
    dateFormat: 'dd.mm.yy',
    firstDayOfWeek: 0
}

/**
 * Provides formatting for number, date and time, and more.
 */
export const ApplicationLocaleOptions: {
    hourFormat: '12' | '24';
    numberLocale?: Intl.LocalesArgument,
    currency?: Intl.NumberFormatOptions["currency"];
} & Partial<PrimeVueLocaleOptions> = {
    hourFormat: '24',
    ...CustomPrimeVueLocaleOptions
};