import { suite, test } from 'mocha-typescript';
import { expect } from 'chai';
import { Factory } from './index'

class Class1 {
    method1() {

    }
}

class Class2 extends Class1 {

}

@suite
class TestSerialize {
    @test
    test1() {
        const f = 1;
    }
}