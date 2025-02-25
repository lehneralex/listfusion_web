// einzelner Artikel der einer Liste hinzugefügt wurde
export class ArticleOfList {
    name;
    amount;
    unit;

    constructor(name, amount, unit) {
        this.name = name;
        this.amount = amount;
        this.unit = unit;
    }
}