import { suite, test } from 'mocha-typescript';
import { expect } from 'chai';

import { fastMul } from './index';

interface Monoid<T> {
    readonly id: T
    readonly mplus: (a1: T, a2: T) => T
}

@suite
class TestSuite {
    @test
    testAddMonad() {
        const Monoid: Monoid<number> = {
            id: 0,
            mplus: (a, b) => a + b
        };
        expect(fastMul(Monoid.id, Monoid.mplus, 5, 10)).eq(50);
    }

    @test
    testMulMonad() {
        const Monoid: Monoid<number> = {
            id: 1,
            mplus: (a, b) => a * b
        }
        expect(fastMul(Monoid.id, Monoid.mplus, 5, 6)).eq(Math.pow(5, 6));
    }

    @test
    testModMonad() {
        const Monoid: Monoid<number> = {
            id: 0,
            mplus: (a, b) => ((a % 1999) + (b % 1999)) % 1999
        }
        // correct result: 1801430843748943459009 % 1193
        expect(fastMul(Monoid.id, Monoid.mplus, Number.MAX_SAFE_INTEGER, 199999)).eq(1193);

        // a incorrect result due to overflow
        expect(199999 * Number.MAX_SAFE_INTEGER % 1999).eq(1017);
    }
}
