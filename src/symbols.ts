export class VotdSymbol {
  readonly id: string;
  private readonly originalName: string;
  private customName = "";

  private constructor(id: string, originalName: string) {
    this.id = id;
    this.originalName = originalName;
  }

  static of(id: string, originalName: string) {
    return new VotdSymbol(id, originalName);
  }

  get url(): string {
    return `symbols/${this.id}.png`;
  }

  get name(): string {
    return this.customName || this.originalName;
  }

  set name(name: string) {
    if (name === this.originalName) {
      this.reset();
    } else {
      this.customName = name;
    }
  }

  reset(): void {
    this.customName = "";
  }
}

export class VotdSymbolCollection {
  static build() {
    return [
      VotdSymbol.of("ascendantplane", "Ascendant Plane"),
      VotdSymbol.of("blackgarden", "Black Garden"),
      VotdSymbol.of("blackheart", "Black Heart"),
      VotdSymbol.of("commune", "Commune"),
      VotdSymbol.of("darkness", "Darkness"),
      VotdSymbol.of("drink", "Drink"),
      VotdSymbol.of("earth", "Earth"),
      VotdSymbol.of("enter", "Enter"),
      VotdSymbol.of("fleet", "Fleet"),
      VotdSymbol.of("give", "Give"),
      VotdSymbol.of("grieve", "Grieve"),
      VotdSymbol.of("guardian", "Guardian"),
      VotdSymbol.of("hive", "Hive"),
      VotdSymbol.of("kill", "Kill"),
      VotdSymbol.of("light", "Light"),
      VotdSymbol.of("love", "Love"),
      VotdSymbol.of("pyramid", "Pyramid"),
      VotdSymbol.of("remember", "Remember"),
      VotdSymbol.of("savathun", "Savathûn"),
      VotdSymbol.of("scorn", "Scorn"),
      VotdSymbol.of("stop", "Stop"),
      VotdSymbol.of("tower", "Tower"),
      VotdSymbol.of("traveler", "Traveler"),
      VotdSymbol.of("witness", "Witness"),
      VotdSymbol.of("worm", "Worm"),
      VotdSymbol.of("worship", "Worship"),
    ];
  }
}
