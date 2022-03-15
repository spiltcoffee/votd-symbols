import cloneDeep from "lodash.clonedeep";
import qs from "qs";

function encodeURIForAscii(unencodedString: string): string {
  return encodeURIComponent(unencodedString).replace(
    /%([0-9A-F]{2})/g,
    function toSolidBytes(_, p1: string) {
      return String.fromCharCode(parseInt(p1, 16));
    }
  );
}

function encodeBase64(unencodedString: string): string {
  return btoa(encodeURIForAscii(unencodedString));
}

function decodeURIForAscii(encodedString: string): string {
  return decodeURIComponent(
    encodedString
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

function decodeBase64(encodedString: string): string {
  return decodeURIForAscii(atob(encodedString));
}

export enum VotdSymbolId {
  REDACTED,
  ASCENDANT_PLANE,
  BLACK_GARDEN,
  BLACK_HEART,
  COMMUNE,
  DARKNESS,
  DRINK,
  EARTH,
  ENTER,
  FLEET,
  GIVE,
  GRIEVE,
  GUARDIAN,
  HIVE,
  KILL,
  LIGHT,
  LOVE,
  PYRAMID,
  REMEMBER,
  SAVATHUN,
  SCORN,
  STOP,
  TOWER,
  TRAVELER,
  WITNESS,
  WORM,
  WORSHIP,
}

export class VotdSymbol {
  readonly id: VotdSymbolId;
  private imageName: string;
  readonly originalName: string;
  private _customName = "";

  constructor(id: VotdSymbolId, imageName: string, originalName: string) {
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
      new VotdSymbol(
        VotdSymbolId.ASCENDANT_PLANE,
        "ascendantplane",
        "Ascendant Plane"
      ),
      new VotdSymbol(VotdSymbolId.BLACK_GARDEN, "blackgarden", "Black Garden"),
      new VotdSymbol(VotdSymbolId.BLACK_HEART, "blackheart", "Black Heart"),
      new VotdSymbol(VotdSymbolId.COMMUNE, "commune", "Commune"),
      new VotdSymbol(VotdSymbolId.DARKNESS, "darkness", "Darkness"),
      new VotdSymbol(VotdSymbolId.DRINK, "drink", "Drink"),
      new VotdSymbol(VotdSymbolId.EARTH, "earth", "Earth"),
      new VotdSymbol(VotdSymbolId.ENTER, "enter", "Enter"),
      new VotdSymbol(VotdSymbolId.FLEET, "fleet", "Fleet"),
      new VotdSymbol(VotdSymbolId.GIVE, "give", "Give"),
      new VotdSymbol(VotdSymbolId.GRIEVE, "grieve", "Grieve"),
      new VotdSymbol(VotdSymbolId.GUARDIAN, "guardian", "Guardian"),
      new VotdSymbol(VotdSymbolId.HIVE, "hive", "Hive"),
      new VotdSymbol(VotdSymbolId.KILL, "kill", "Kill"),
      new VotdSymbol(VotdSymbolId.LIGHT, "light", "Light"),
      new VotdSymbol(VotdSymbolId.LOVE, "love", "Love"),
      new VotdSymbol(VotdSymbolId.PYRAMID, "pyramid", "Pyramid"),
      new VotdSymbol(VotdSymbolId.REMEMBER, "remember", "Remember"),
      new VotdSymbol(VotdSymbolId.SAVATHUN, "savathun", "Savathûn"),
      new VotdSymbol(VotdSymbolId.SCORN, "scorn", "Scorn"),
      new VotdSymbol(VotdSymbolId.STOP, "stop", "Stop"),
      new VotdSymbol(VotdSymbolId.TOWER, "tower", "Tower"),
      new VotdSymbol(VotdSymbolId.TRAVELER, "traveler", "Traveler"),
      new VotdSymbol(VotdSymbolId.WITNESS, "witness", "Witness"),
      new VotdSymbol(VotdSymbolId.WORM, "worm", "Worm"),
      new VotdSymbol(VotdSymbolId.WORSHIP, "worship", "Worship"),
    ]);
  }
}
