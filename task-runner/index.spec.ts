import { TaskGraph, Task } from './runner';
import { suite, test } from 'mocha-typescript';
import { expect } from 'chai';

import { TaskRunner } from './runner';

const tasksAsMap: TaskGraph = new Map<string, Task>([
    ["a",
        {
            dep: ["b", "c"],
            run: (resultB: string, resultC: string) => resultB + resultC
        }],
    ["b",
        {
            run: () => `B`
        }],
    ["c",
        {
            dep: ["d"],
            run: (resultD: string) => `C` + resultD
        }],
    ["d",
        {
            dep: [],
            run: () => `D`
        }],
    ["e",
        {
            dep: ["f"],
            run: () => Promise.reject("should not be executed")
        }],
    ["f",
        {
            dep: ["e"],
            run: () => Promise.reject("should not be executed")
        }],
]);

const tasksAsObj: TaskGraph = {
    a: {
        dep: ["b", "c"],
        run: (resultB: string, resultC: string) => resultB + resultC
    },
    b: {
        run: () => Promise.resolve(`B`)
    },
    c: {
        dep: ["d"],
        run: (resultD: string) => `C` + resultD
    },
    d: {
        run: () => Promise.resolve(`D`)
    },
    e: {
        dep: ["f"],
        run: () => Promise.reject("should not start")
    },
    f: {
        dep: ["e"],
        run: () => Promise.reject("should not start")
    }
};

@suite
class TestTaskRunner {
    @test("executes graph")
    async test1() {
        const runner1 = new TaskRunner(tasksAsMap);
        expect(await runner1.runSync("a")).eq("BCD");
        expect(await runner1.run("a")).eq("BCD");

        const runner2 = new TaskRunner(tasksAsObj);
        expect(await runner2.runSync("a")).eq("BCD");
        expect(await runner2.run("a")).eq("BCD");
    }

    @test("throws on circular dependcies")
    async testCircularDependcies() {
        const runner1 = new TaskRunner(tasksAsMap);
        expect(() => runner1.runSync("e")).to.throws(/Cyclic dep/)
        try {
            await runner1.run("e");
            expect(false).eq(true, "should not be here");
        } catch (e) {
            expect(e.message).matches(/Cyclic dep/);
        }
    }

    @test("throws on nonexist task")
    async testNonExistTask() {
        const runner1 = new TaskRunner(tasksAsMap);
        expect(() => runner1.runSync("g")).to.throws(/Task not defined/);
    }

    @test("throws on incorrect graph")
    testIncompleteGraph() {
        expect(() => new TaskRunner(null)).to.throw(/Map or Object/);
    }
}
