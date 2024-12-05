import { FileSystem } from 'fs';

declare global {
    interface Window {
        fs: FileSystem & {
            promises: {
                appendFile(path: string, data: string): Promise<void>;
            };
        };
    }
}
