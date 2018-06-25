export class Pattern {
  public name: string;
  public duration: number;
  public valAt: (time: number) => number;

  constructor(name: string, duration: number, valAt: (time: number) => number) {
    this.name = name;
    this.duration = duration;
    this.valAt = valAt;
  }
}
