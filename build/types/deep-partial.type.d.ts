export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: T[P] extends Array<any> ? T[P] : DeepPartial<T[P]>;
} : T;
