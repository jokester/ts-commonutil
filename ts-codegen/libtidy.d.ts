declare module 'libtidy' {
    export interface TidyOption {
        readonly name: string
        readonly type: string
        readonly readOnly: boolean
        readonly pickList: string[]
        readonly id: number
        toString(): string
    }

    // minimum interface for code generation
    export interface TidyDoc {
        getOptionList(): TidyOption[]
    }

    interface TidyDocConstructor {
        new (): TidyDoc
        (): TidyDoc
    }
    export const TidyDoc: TidyDocConstructor
}