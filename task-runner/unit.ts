export interface Action1_1<In1, Out1> {
    (in1: Promise<In1>): Promise<Out1>;
}

export interface Action0_1<Out1> {
    (): Promise<Out1>
}

interface PortDef<T> {
    uuid: string
    portNo: number
}

interface PipeUnit<Result> {
    init(data: string): this
    toJSON(): string
    readonly uuid: string
    run(): Promise<Result>
}
