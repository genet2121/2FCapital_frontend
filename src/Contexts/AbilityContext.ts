import {createContext} from 'react';
import { createContextualCan } from '@casl/react';

const new_context = createContext<any>({});
export const Can = createContextualCan(new_context.Consumer);

export default new_context;