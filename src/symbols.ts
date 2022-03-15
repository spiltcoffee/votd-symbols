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
  private symbols: Array<VotdSymbol>;

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

  find(id: VotdSymbolId): VotdSymbol {
    const symbol = this.symbols.find((symbol) => symbol.id === id);

    if (symbol) {
      return symbol;
    } else {
      throw new Error(`Unknown symbol id ${id}`);
    }
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
      new VotdSymbol(VotdSymbolId.REDACTED, "redacted", "Redacted"),
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

export class VotdSymbolViewCategory {
  readonly title: string;
  readonly subtitle: string;
  readonly symbols: Array<VotdSymbolId>;

  constructor(title: string, subtitle: string, symbols: Array<VotdSymbolId>) {
    this.title = title;
    this.subtitle = subtitle;
    this.symbols = symbols;
  }
}

export class VotdSymbolView {
  readonly title: string;
  readonly subtitle: string;
  readonly categories: Array<VotdSymbolViewCategory>;

  private constructor(
    title: string,
    subtitle: string,
    categories: Array<VotdSymbolViewCategory>
  ) {
    this.title = title;
    this.subtitle = subtitle;
    this.categories = categories;
  }

  static default(): VotdSymbolView {
    return new VotdSymbolView("", "", [
      new VotdSymbolViewCategory("", "", [
        VotdSymbolId.ASCENDANT_PLANE,
        VotdSymbolId.BLACK_GARDEN,
        VotdSymbolId.BLACK_HEART,
        VotdSymbolId.COMMUNE,
        VotdSymbolId.DARKNESS,
        VotdSymbolId.DRINK,
        VotdSymbolId.EARTH,
        VotdSymbolId.ENTER,
        VotdSymbolId.FLEET,
        VotdSymbolId.GIVE,
        VotdSymbolId.GRIEVE,
        VotdSymbolId.GUARDIAN,
        VotdSymbolId.HIVE,
        VotdSymbolId.KILL,
        VotdSymbolId.LIGHT,
        VotdSymbolId.LOVE,
        VotdSymbolId.PYRAMID,
        VotdSymbolId.REMEMBER,
        VotdSymbolId.SAVATHUN,
        VotdSymbolId.SCORN,
        VotdSymbolId.STOP,
        VotdSymbolId.TOWER,
        VotdSymbolId.TRAVELER,
        VotdSymbolId.WITNESS,
        VotdSymbolId.WORM,
        VotdSymbolId.WORSHIP,
      ]),
    ]);
  }

  static aquisition(): VotdSymbolView {
    return new VotdSymbolView("Acquisition", "", [
      new VotdSymbolViewCategory(
        "Top Totem Symbol",
        "Shows the side of the arena the Taken Compass has spawned",
        [VotdSymbolId.PYRAMID, VotdSymbolId.TRAVELER]
      ),
      new VotdSymbolViewCategory(
        "Middle Totem Symbol",
        "Shows the room around the arena that needs to be entered",
        [
          VotdSymbolId.WORSHIP,
          VotdSymbolId.ENTER,
          VotdSymbolId.GIVE,
          VotdSymbolId.GRIEVE,
          VotdSymbolId.STOP,
          VotdSymbolId.REMEMBER,
          VotdSymbolId.DRINK,
          VotdSymbolId.COMMUNE,
          VotdSymbolId.KILL,
        ]
      ),
      new VotdSymbolViewCategory(
        "Bottom Totem Symbol",
        "Shows which Glyphkeeper needs to be killed and read",
        [VotdSymbolId.DARKNESS, VotdSymbolId.LIGHT]
      ),
      new VotdSymbolViewCategory(
        "Obelisk Symbol",
        "These symbols only appear on the obelisks",
        [
          VotdSymbolId.ASCENDANT_PLANE,
          VotdSymbolId.BLACK_GARDEN,
          VotdSymbolId.BLACK_HEART,
          VotdSymbolId.EARTH,
          VotdSymbolId.FLEET,
          VotdSymbolId.GUARDIAN,
          VotdSymbolId.HIVE,
          VotdSymbolId.LOVE,
          VotdSymbolId.SAVATHUN,
          VotdSymbolId.SCORN,
          VotdSymbolId.TOWER,
          VotdSymbolId.WITNESS,
          VotdSymbolId.WORM,
        ]
      ),
    ]);
  }

  static extraChest(): VotdSymbolView {
    return new VotdSymbolView(
      "Extra Boss Chest Symbols",
      [
        "The following 9 symbols have rooms throughout the raid.",
        "When entering the raid, after the payload section but before",
        "the long drop, find a totem with three symbols on it.",
        "This correlates to 3 of the 9 rooms below.",
        "Shoot the symbol in the room once to activate.",
        "Shoot again to deactivate if the room is wrong.",
      ].join("\n"),
      [
        new VotdSymbolViewCategory("Before Acquisition", "First Encounter", [
          VotdSymbolId.PYRAMID,
          VotdSymbolId.GIVE,
          VotdSymbolId.DARKNESS,
        ]),
        new VotdSymbolViewCategory("Before Collection", "Second Encounter", [
          VotdSymbolId.TRAVELER,
        ]),
        new VotdSymbolViewCategory("Before Exhibition", "Third Encounter", [
          VotdSymbolId.WORSHIP,
          VotdSymbolId.LIGHT,
          VotdSymbolId.STOP,
        ]),
        new VotdSymbolViewCategory("Before Dominion", "Fourth Encounter", [
          VotdSymbolId.GUARDIAN,
          VotdSymbolId.KILL,
        ]),
      ]
    );
  }

  static lorePuzzle(): VotdSymbolView {
    return new VotdSymbolView(
      "Lore Puzzle Room Symbols",
      "Arranged in rows from the back wall to the entrance (you may need to resize symbols to allow 7 per row)",
      [
        new VotdSymbolViewCategory("", "", [
          VotdSymbolId.REDACTED,
          VotdSymbolId.REDACTED,
          VotdSymbolId.REDACTED,
          VotdSymbolId.WORSHIP,
          VotdSymbolId.SAVATHUN,
          VotdSymbolId.REDACTED,
          VotdSymbolId.REDACTED,
        ]),
        new VotdSymbolViewCategory("", "", [
          VotdSymbolId.PYRAMID,
          VotdSymbolId.LOVE,
          VotdSymbolId.FLEET,
          VotdSymbolId.COMMUNE,
          VotdSymbolId.BLACK_HEART,
          VotdSymbolId.GRIEVE,
          VotdSymbolId.TRAVELER,
        ]),
        new VotdSymbolViewCategory("", "", [
          VotdSymbolId.BLACK_GARDEN,
          VotdSymbolId.ASCENDANT_PLANE,
          VotdSymbolId.DARKNESS,
          VotdSymbolId.LIGHT,
          VotdSymbolId.DRINK,
          VotdSymbolId.REDACTED,
          VotdSymbolId.REDACTED,
        ]),
        new VotdSymbolViewCategory("", "", [
          VotdSymbolId.KILL,
          VotdSymbolId.GIVE,
          VotdSymbolId.SCORN,
          VotdSymbolId.TOWER,
          VotdSymbolId.WORM,
          VotdSymbolId.REDACTED,
          VotdSymbolId.REDACTED,
        ]),
        new VotdSymbolViewCategory("", "", [
          VotdSymbolId.REDACTED,
          VotdSymbolId.STOP,
          VotdSymbolId.HIVE,
          VotdSymbolId.GUARDIAN,
          VotdSymbolId.WITNESS,
          VotdSymbolId.ENTER,
          VotdSymbolId.EARTH,
        ]),
      ]
    );
  }
}
