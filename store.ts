import { atom } from 'jotai';
import { UserProps } from './types';

export const loginAtom = atom(false);
export const currentUserAtom = atom<UserProps | null>(null);
export const selectedProfileAtom = atom("");