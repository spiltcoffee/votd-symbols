import cloneDeep from "lodash.clonedeep";
import qs from "qs";

function encodeBase64(unencodedString: string): string {
  return window.btoa(unescape(encodeURIComponent(unencodedString)));
}

function decodeBase64(encodedString: string): string {
  return decodeURIComponent(escape(window.atob(encodedString)));
}

export class VotdSymbol {
  readonly id: number;
  private imageName: string;
  readonly originalName: string;
  private _customName = "";

  constructor(id: number, imageName: string, originalName: string) {
    this.id = id;
    this.imageName = imageName;
    this.originalName = originalName;
  }

  get url(): string {
    return `symbols/${this.imageName}.png`;
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
    return this.map((v) => v);
  }

  map(mapper: (symbol: VotdSymbol) => VotdSymbol) {
    return new VotdSymbolCollection(
      this.symbols.map((symbol) => {
        const clonedSymbol = symbol.clone();
        return mapper(clonedSymbol);
      })
    );
  }

  static serialize(collection: VotdSymbolCollection): string {
    const customNames = collection.symbols.reduce(
      (obj, symbol) => ({
        ...obj,
        ...(symbol.customName ? { [symbol.id]: symbol.customName } : {}),
      }),
      {}
    );

    const stringifiedQuery = qs.stringify(customNames);

    return encodeBase64(stringifiedQuery);
  }

  static deserialize(encodedQuery: string): VotdSymbolCollection {
    const stringifiedQuery = decodeBase64(encodedQuery);

    const customNames = <Record<string, string>>(
      qs.parse(stringifiedQuery, { depth: 0 })
    );

    return VotdSymbolCollection.default().map((symbol) => {
      if (customNames[symbol.id]) {
        symbol.name = customNames[symbol.id];
      }
      return symbol;
    });
  }

  static default(): VotdSymbolCollection {
    return new VotdSymbolCollection([
      new VotdSymbol(1, "ascendantplane", "Ascendant Plane"),
      new VotdSymbol(2, "blackgarden", "Black Garden"),
      new VotdSymbol(3, "blackheart", "Black Heart"),
      new VotdSymbol(4, "commune", "Commune"),
      new VotdSymbol(5, "darkness", "Darkness"),
      new VotdSymbol(6, "drink", "Drink"),
      new VotdSymbol(7, "earth", "Earth"),
      new VotdSymbol(8, "enter", "Enter"),
      new VotdSymbol(9, "fleet", "Fleet"),
      new VotdSymbol(10, "give", "Give"),
      new VotdSymbol(11, "grieve", "Grieve"),
      new VotdSymbol(12, "guardian", "Guardian"),
      new VotdSymbol(13, "hive", "Hive"),
      new VotdSymbol(14, "kill", "Kill"),
      new VotdSymbol(15, "light", "Light"),
      new VotdSymbol(16, "love", "Love"),
      new VotdSymbol(17, "pyramid", "Pyramid"),
      new VotdSymbol(18, "remember", "Remember"),
      new VotdSymbol(19, "savathun", "Savathûn"),
      new VotdSymbol(20, "scorn", "Scorn"),
      new VotdSymbol(21, "stop", "Stop"),
      new VotdSymbol(22, "tower", "Tower"),
      new VotdSymbol(23, "traveler", "Traveler"),
      new VotdSymbol(24, "witness", "Witness"),
      new VotdSymbol(25, "worm", "Worm"),
      new VotdSymbol(26, "worship", "Worship"),
    ]);
  }
}
