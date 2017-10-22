interface PortDef<T> {
    uuid: string;
    portNo: number;
}

interface PipeUnit<Result> {
    init(data: string): this;
    toJSON(): string;
    readonly uuid: string;
    run(): Promise<Result>;
}
