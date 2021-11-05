import { v4 } from 'uuid';

export type UuidProvider = () => string;
export const uuidProviderFactory = (uuid: string = v4()) => () => uuid;
