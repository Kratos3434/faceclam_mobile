import { atom } from 'jotai';
import { UserProps } from './types';

export const loginAtom = atom(false);
export const currentUserAtom = atom<UserProps | null>(null);
export const selectedProfileAtom = atom("");
export const lastCreatedAtom = atom<string | null>("");
export const respondBottomSheetIndexAtom = atom(-1);
export const userIdAtom = atom(-1);
export const userProfileAtom = atom<UserProps | undefined>(undefined)