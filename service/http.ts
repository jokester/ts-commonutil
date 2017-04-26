interface HTTPService {
    get(url: string): Promise<Buffer>
}

export interface HTTPReq {
    method: "GET"
    url: string
}

export interface HTTPResponse {
    bodyStr: string
    body: Buffer
}
