import { atom } from 'jotai';
import { LikeProps, PostProps, UserProps } from './types';
import { ImagePickerAsset } from 'expo-image-picker';

export const loginAtom = atom(false);
export const currentUserAtom = atom<UserProps | null>(null);
export const selectedProfileAtom = atom("");
export const lastCreatedAtom = atom<string | null>("");
export const respondBottomSheetIndexAtom = atom(-1);
export const userIdAtom = atom(-1);
export const userProfileAtom = atom<UserProps | undefined>(undefined);
export const selectedPhotoAtom = atom<ImagePickerAsset | null>(null);
export const likesAtom = atom<Map<number, LikeProps[]>>(new Map<number, LikeProps[]>());