import {State, Loadable} from 'smx';

export function useLoadable<T>(state: State<T>): Loadable<PromiseInfer<T>>;
export function useLoadable(states: State<any>[]): Loadable<any>[];

export function useValue<T>(state: State<T>): PromiseInfer<T>;
export function useValue(states: State<any>[]): any[];

type PromiseInfer<T> = T extends Promise<infer U> ? U : T;
