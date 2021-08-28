import * as typed_event_emitter from "./typed-event-emitter"
// @ponicode
describe("onceInternal", () => {
    let inst: any

    beforeEach(() => {
        inst = new typed_event_emitter.TypedEventEmitter()
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.onceInternal("withdrawal", () => undefined)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.onceInternal("invoice", () => undefined)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.onceInternal("deposit", () => undefined)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.onceInternal("payment", () => undefined)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.onceInternal("", () => undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
