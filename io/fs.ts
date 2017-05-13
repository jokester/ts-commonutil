import * as fs from "fs";
import * as path from "path";
import { Callback2Promise as Promisify } from "../type/promisify";

/**
 * FS: node's builtin as module
 */
namespace FSImpl {

    export function cp(oldPath: string, newPath: string) {
        return new Promise<void>((fulfill, reject) => {
            const readStream = fs.createReadStream(oldPath);
            const writeStream = fs.createWriteStream(newPath);

            readStream.on("error", reject);
            writeStream.on("error", reject);

            readStream.on("close", fulfill);
            readStream.pipe(writeStream);
        });
    }

    /**
     * mv: use POSIX rename first, and fallback to (cp + unlink)
     *
     * @export
     * @param {string} oldPath
     * @param {string} newPath
     */
    export async function mv(oldPath: string, newPath: string) {
        try {
            await rename(oldPath, newPath);
        } catch (e) {
            if (e && e.code === "EXDEV") {
                /**
                 * on "EXDEV: cross-device link not permitted" error
                 * fallback to cp + unlink
                 */
                await cp(oldPath, newPath);
                await unlink(oldPath);
            } else {
                throw e;
            }
        }
    }

    export const readDir = Promisify.toPromise1(fs.readdir);
    export const readFile = Promisify.toPromise1(fs.readFile);
    export const readText = Promisify
        .toPromise2<string, { encoding: string; flag?: string; }, string>(fs.readFile);

    export const lstat = Promisify.toPromise1(fs.lstat);
    export const stat = Promisify.toPromise1(fs.stat);
    export const unlink = Promisify.toPromise1v(fs.unlink);
    export const mkdtemp = Promisify.toPromise1(fs.mkdtemp);
    export const rmdir = Promisify.toPromise1v(fs.rmdir);
    // NOTE 'rename' (and POSIX 'rename' syscall) is limited to same filesystem.
    export const rename = Promisify.toPromise2v(fs.rename);
    export const writeFile = Promisify.toPromise2v(fs.writeFile);

    /**
     *
     *
     * @export
     * @param {string} dirName
     * @returns {Promise<DirItem[]>} (name + isDir + size) of entries
     */
    export async function readDirDetail(dirName: string): Promise<DirItem[]> {
        const s = await stat(dirName);
        if (!s.isDirectory()) {
            throw new Error(`expected a directory at '${dirName}'`);
        }

        const childNames = await readDir(dirName);
        const children = childNames.map(async name => {
            const fullPath = path.join(dirName, name);
            const childS = await stat(fullPath);
            const childItem: DirItem = {
                name: name,
                isDir: childS.isDirectory(),
                // -1 works better with JSON
                // NaN will be serialized to `null`
                size: childS.isDirectory() ? -1 : childS.size
            };
            return childItem;
        });

        return Promise.all(children);
    }
}

interface DirItem {
    name: string;
    size: number;
    isDir: boolean;
}

export interface FSType {
    cp(oldPath: string, newPath: string): Promise<void>;
    mv(oldPath: string, newPath: string): Promise<void>;
    readDir(path: string | Buffer): Promise<string[]>;
    readFile(filename: string): Promise<Buffer>;
    readText(filename: string,
        options: { encoding: string; flag?: string; }): Promise<string>;
    lstat(path: string | Buffer): Promise<fs.Stats>;
    stat(path: string | Buffer): Promise<fs.Stats>;
    unlink(path: string | Buffer): Promise<void>;
    mkdtemp(prefix: string): Promise<string>;
    rmdir(path: string | Buffer): Promise<void>;
    rename(oldPath: string, newPath: string): Promise<void>;
    writeFile(filename: string, data: any): Promise<void>;
    readDirDetail(path: string): Promise<DirItem[]>;
}

export const FS: FSType = FSImpl;