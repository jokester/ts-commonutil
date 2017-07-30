import { liftPromise, toPromise1 } from "../type";

export interface Task {
    dep?: string[];
    run: Function;
    thisArg?: any;
}

type ConvertedTypeGraph = Map<string, Task>;

export type TaskGraph = Map<string, Task> | { [taskName: string]: Task };

//
const targetStack: string[] = [];

/**
 * Tasks cannot be recursively depended like A <- B <- A
 * A task is guaranteed to run at most once.
 */
export class TaskRunner<T> {

    private readonly results = new Map<string, Promise<T>>();
    private readonly taskDef: ConvertedTypeGraph;

    constructor(taskDef: TaskGraph) {
        if (taskDef instanceof Map)
            this.taskDef = new Map(taskDef);
        else if (taskDef instanceof Object) {
            this.taskDef = new Map;
            for (const name in taskDef) {
                this.taskDef.set(name, taskDef[name]);
            }
        } else
            throw new Error(`expect taskDef to be Map or Object`);
    }

    run(target: string): Promise<T> {
        return Promise.resolve(this.runSync(target));
    }

    /**
     * Run task and throw()
     *
     * @param {string} target
     * @returns {Promise<any>}
     *
     * @memberOf TaskRunner
     */
    runSync(target: string): Promise<T> {
        // Array#indexOf() may be bad in performance
        // but we can have a better `stack` for error message
        if (targetStack.indexOf(target) !== -1) {
            const err = new Error(
                `Cyclic dependicies: ${targetStack.concat([target]).join(" <- ")}`
            );
            targetStack.length = 0;
            throw err;
        }

        const task = this.taskDef.get(target);
        if (!task)
            throw new Error(`Task not defined: ${target}`);

        targetStack.push(target);
        const deps = (this.taskDef.get(target).dep || []).map(depName => {
            if (!this.results.has(depName)) {
                this.results.set(depName, this.runSync(depName));
            }
            return this.results.get(depName);
        });
        targetStack.pop();

        return Promise.all(deps).then(depResults => {
            return task.run.apply(task.thisArg, depResults);
        });
    }
}
