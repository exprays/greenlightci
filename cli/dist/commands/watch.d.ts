import { WatchOptions } from '../types.js';
/**
 * Watch command - continuously monitor files for changes
 */
export declare function watchCommand(path: string, options: WatchOptions): Promise<void>;
