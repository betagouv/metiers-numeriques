import { v4 } from 'uuid';

export type UuidGenerator = () => string;
export const uuidGeneratorFactory = (uuid: string = v4()) => () => uuid;
