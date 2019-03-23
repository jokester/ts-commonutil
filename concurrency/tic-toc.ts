export class TicToc {
  readonly ticAt = Date.now();

  toc() {
    return Date.now() - this.ticAt;
  }
}
