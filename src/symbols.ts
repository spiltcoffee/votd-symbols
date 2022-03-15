import cloneDeep from "lodash.clonedeep";

export class VotdSymbol {
  readonly id: string;
  readonly originalName: string;
  private _customName = "";

  constructor(id: string, originalName: string) {
    this.id = id;
    this.originalName = originalName;
  }

  get url(): string {
    return `symbols/${this.id}.png`;
  }

  get name(): string {
    return this._customName || this.originalName;
  }

  set name(name: string) {
    if (name === this.originalName) {
      this._customName = "";
    } else {
      this._customName = name;
    }
  }

  get customName(): string {
    return this._customName;
  }

  clone(): VotdSymbol {
    return cloneDeep(this);
  }
}

export class VotdSymbolCollection {
  symbols: Array<VotdSymbol>;

  private constructor(symbols: Array<VotdSymbol>) {
    this.symbols = symbols;
  }

  clone(): VotdSymbolCollection {
    return new VotdSymbolCollection(
      this.symbols.map((symbol) => symbol.clone())
    );
  }

  map(mapper: (symbol: VotdSymbol) => VotdSymbol) {
    return new VotdSymbolCollection(this.symbols.map(mapper));
  }

  static default(): VotdSymbolCollection {
    return new VotdSymbolCollection([
      new VotdSymbol("ascendantplane", "Ascendant Plane"),
      new VotdSymbol("blackgarden", "Black Garden"),
      new VotdSymbol("blackheart", "Black Heart"),
      new VotdSymbol("commune", "Commune"),
      new VotdSymbol("darkness", "Darkness"),
      new VotdSymbol("drink", "Drink"),
      new VotdSymbol("earth", "Earth"),
      new VotdSymbol("enter", "Enter"),
      new VotdSymbol("fleet", "Fleet"),
      new VotdSymbol("give", "Give"),
      new VotdSymbol("grieve", "Grieve"),
      new VotdSymbol("guardian", "Guardian"),
      new VotdSymbol("hive", "Hive"),
      new VotdSymbol("kill", "Kill"),
      new VotdSymbol("light", "Light"),
      new VotdSymbol("love", "Love"),
      new VotdSymbol("pyramid", "Pyramid"),
      new VotdSymbol("remember", "Remember"),
      new VotdSymbol("savathun", "Savathûn"),
      new VotdSymbol("scorn", "Scorn"),
      new VotdSymbol("stop", "Stop"),
      new VotdSymbol("tower", "Tower"),
      new VotdSymbol("traveler", "Traveler"),
      new VotdSymbol("witness", "Witness"),
      new VotdSymbol("worm", "Worm"),
      new VotdSymbol("worship", "Worship"),
    ]);
  }
}
