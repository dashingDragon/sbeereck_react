import { HttpsCallableResult, getFunctions, httpsCallable } from 'firebase/functions';
import { useState } from 'react';
import { MakeStaffPayload } from './staffs';
import { MakeTransactionPayload } from './transactions';

export type PendingStaff = {
  uid: string,
  name: string,
  email: string,
};

export type ListPendingStaffs = {
  users: PendingStaff[],
};

export const useListPendingStaffs = () => {
    const functions = getFunctions();
    const fun = httpsCallable(functions, 'listPendingStaffs');

    return async () => {
        console.log('Called function listPendingStaffs');
        return (await fun({})).data as ListPendingStaffs;
    };
};

export const usePendingStaffs: () => [PendingStaff[], () => Promise<void>] = () => {
    const listPendingStaffs = useListPendingStaffs();
    const [pending, setPending] = useState([] as PendingStaff[]);

    const refresh = async () => {
        setPending((await listPendingStaffs()).users);
    };

    return [pending, refresh];
};

export const useMakeStaff = () => {
    const functions = getFunctions();
    const fun = httpsCallable(functions, 'makeStaff');

    return async (payload: MakeStaffPayload) => {
        console.log('Called function makeStaff');
        await fun(payload);
    };
};


/**
 * Write a transaction for the exchange and update
 * the account's balance and stats.
 *
 * @returns a function to make the transation
 */
export const useMakeTransaction = () => {
    const functions = getFunctions();
    const fun = httpsCallable(functions, 'makeTransaction') as (data?: unknown) => Promise<HttpsCallableResult<{ success: boolean }>>;

    return async (payload: MakeTransactionPayload): Promise<HttpsCallableResult<{ success: boolean }>> => {
        console.log('Called function makeTransaction');
        try {
            return await fun(payload);
        } catch (e) {
            console.error('makeTransaction failed : '  + e);
            return { data: { success: false } };
        }
    };
};
