import { japanese } from './ja';
export const isJapanese = () => document.documentElement.lang === 'ja';
export const text = (value: string) => isJapanese() ? japanese(value) : value;
