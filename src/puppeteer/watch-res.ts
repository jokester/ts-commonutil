import type * as puppeteer from 'puppeteer';
import { Deferred } from '../concurrency/deferred';

export async function waitRes(
  p: puppeteer.Page,
  predicate: (req: puppeteer.HTTPRequest, res: puppeteer.HTTPResponse) => boolean,
): Promise<puppeteer.HTTPResponse> {
  const captured = new Deferred<puppeteer.HTTPResponse>();

  p.on('response', (res) => {
    if (predicate(res.request(), res)) {
      captured.fulfill(res);
    }
  });

  return captured;
}
