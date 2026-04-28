import { v4 } from 'uuid';

export const getProcessId = (prefix?: string) => (prefix ? `${prefix}-${v4()}` : v4());
