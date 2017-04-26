import { suite, test } from 'mocha-typescript';
import { expect } from 'chai';

import { toPromise } from './index';

@suite class TestSuite {
    @test
    async convertFunToPromisify() {

        function foo0() { }
        const result0 = await toPromise(foo0);

        function foo1(a: number) {
            return a + 1;
        }
        const result1 = await toPromise(foo1, 2);
        expect(result1).eq(3);

        function foo5(a1: string, a2: string, a3: string, a4: number, a5: boolean) {
            return [a1, a2, a3].join(`${a4}${a5}`);
        }
        const result5 = await toPromise(foo5, "a", "b", "c", 5, false);
        expect(result5).eq("a5falseb5falsec");
    }
}
