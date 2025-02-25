// einzelner Artikel der zur Liste hinzugefügt werden kann
export class Article {
    id;
    name;
    description;
    image;
    categories;

    constructor(id, name, image, description = ' ', categories = []) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.description = description;
        this.categories = categories;
    }

    // hinzufügen einer Kategorie wenn sie dem Artikel noch nicht zugeordnet ist
    addCategory(category) {
        if (!this.categories.includes(category)) {
            this.categories.push(category);
        }
    }

    // entfernen einer Kategorie vom Artikel
    removeCategory(category) {
        // Kategorie die mitgegeben wird wird entfernt
        this.categories = this.categories.filter(cat => cat !== category);
    }
}