// importiere Klassen und Subject
import {List} from "../classes/list.js";
import {Category} from "../classes/category.js";
import {Article} from "../classes/article.js";
import Subject from "./subject.js";
import {ArticleOfList} from "../classes/articleOfList.js";

export class ListFusionModel extends Subject {
    lists;
    categories;
    articles;
    filterCategories;
    users;

    constructor() {
        super()
        this.lists = [];
        this.categories = [];
        this.articles = [];
        this.filterCategories = ["Alle Kategorien"];
        this.users = [];
    }

    // Laden der Daten aus JSON File
    init() {
        return fetch('../json/data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP-Fehler! Status: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                for (let list of data.lists) {
                    let l = new List(list.id, list.name, list.articlesToBuy, list.purchasedArticles, list.people, list.open);
                    this.lists.push(l);
                }
                // kommt aus JSON file
                for (let category of data.categories) {
                    let c = new Category(category.name);
                    this.categories.push(c);
                }
                for (let article of data.articles) {
                    let a = new Article(article.id, article.name, article.image, article.description, article.categories);
                    this.articles.push(a);
                }
            })
            // wenn nicht möglich, dann Error
            .catch(error => {
                console.error('Fehler beim Laden der JSON-Datei:', error);
            });
    }

    // Kategorie kommt herein und wird zu Filterung hinzugefügt
    addCategoryFilter(category) {
        // Kategorie wird hinzugefügt
        this.filterCategories.push(category);
        // wenn Kategorie nicht "alle Kategorien" ist
        if (category !== "Alle Kategorien") {
            // dann wird Filterung von Alle Kategorien entfernt
            this.removeCategoryFilter("Alle Kategorien");
        }
        // Filterung wird ausgeführt
        this.#filterByCategories();
    }

    // Kategorie kommt herein und wird von Filterung entfernt
    removeCategoryFilter(category) {
        // Kategorie wird von Filterung entfernt
        this.filterCategories = this.filterCategories.filter(cat => category !== cat);
        // wenn auch keine andere Kategorie mehr ausgewählt ist
        if (this.filterCategories.length === 0) {
            // dann wird "Alle Kategorien" ausgewählt
            this.filterCategories.push("Alle Kategorien");
        }
        // Filterung wird ausgeführt
        this.#filterByCategories();
    }

    // Filterung wird ausgeführt
    #filterByCategories() {
        // wenn "alle Kategorien" ausgewählt ist
        if (this.filterCategories.includes("Alle Kategorien")) {
            // dann werden filterCategories auf "Alle Kategorien" gesetzt
            this.filterCategories = ["Alle Kategorien"]
            // es werden alle Artikel geladen
            this.notify("renderArticles", this.articles);
            // Methode wird vorzeitig beendet
            return;
        }
        // gefilterte Artikel werden gespeichert
        let filteredArticles = [];
        // alle Artikel durchgehen
        for (let article of this.articles) {
            // alle Kategorien für jeweiligen Artikel werden durchgegangen
            for (let category of article.categories) {
                // es wird geschaut, ob Artikel Kategorie beinhalt, nach der gefiltert wird
                if (this.filterCategories.includes(category)) {
                    // wenn ja, dann wird Artikel gespeichert und später angezeigt
                    filteredArticles.push(article);
                    // gehe zum nächsten Artikel
                    break;
                }
            }
        }
        // zeige Artikel in Filterung an (View)
        this.notify("renderArticles", filteredArticles);
    }

    // zeige Listen an (View)
    initLists() {
        this.notify("initLists", this.lists);
    }

    // zeige Liste erstellen Seite an (View)
    initCreateList() {
        this.notify("initCreateList");
    }

    // erstelle neue Liste
    createNewList(name, people) {
        // neue Liste wird erstellt
        let list = new List(this.lists.length, name, [], [], people);
        // wird hinzugefügt
        this.lists.push(list);
        // zeige erstellte Liste Detail an (View)
        this.notify("createNewList", list);
        this.notify("renderCategories", this.categories);
        this.notify("renderArticles", this.articles);
    }

    // Artikel wird zur Liste hinzugefügt
    addArticleToList(listId, articleId, unit, amount) {
        // Liste wo man Artikel hinzufügen will
        let list = this.lists[listId];
        // Artikel wird ausgewählt den man anklickt
        let article = this.articles.find((article) => article.id == articleId);
        // Artikel der zu Liste hinzugefügt wird (wird benötigt)
        let articleOfList = new ArticleOfList(article.name, amount, unit);
        // Artikel wird zur Liste hinzugefügt
        list.articlesToBuy.push(articleOfList);
        // zeige Artikel in "benötigte Artikel"
        this.notify("renderArticlesToBuy", list.articlesToBuy);
    }

    // zeige "Modal" wenn man auf Artikel klickt
    selectArticle(articleId) {
        // Artikel der im Modal geladen werden soll
        let article = this.articles.find((article) => article.id == articleId)
        // zeige Artikel im Modal an
        this.notify("renderArticleModal", article)
    }

    // zeige Detailseite einer Liste an
    showListDetails(listId) {
        let list = this.lists[listId];
        this.notify("createNewList", list);
        this.notify("renderCategories", this.categories);
        this.notify("renderArticles", this.articles);
        this.notify("renderArticlesToBuy", list.articlesToBuy);
        this.notify("renderPurchasedArticles", list.purchasedArticles);
    }

    // Artikel von benötigte in bereits besorgte Artikel verschieben
    tickOff(articleId, listId) {
        let list = this.lists[listId];
        list.purchaseArticle(articleId);
        this.notify("renderArticlesToBuy", list.articlesToBuy);
        this.notify("renderPurchasedArticles", list.purchasedArticles);
    }

    // Artikel von bereits besorgte in benötigte Artikel verschieben
    unTick(articleId, listId) {
        let list = this.lists[listId];
        list.unTick(articleId);
        this.notify("renderArticlesToBuy", list.articlesToBuy);
        this.notify("renderPurchasedArticles", list.purchasedArticles);
    }

    // Kategorie oder Artikel erstellen
    createCategoryArticle(type, listId) {
        let params;
        if (type === "Artikel") {
            // diese Daten werden mitgegeben
            params = {type: type, data: this.categories, listId: listId};
        } else if (type === "Kategorie") {
            params = {type: type, data: this.articles, listId: listId};
        }
        // zeige neuen Artikel/Kategorie erstellen Seite an
        this.notify("renderCreateCategoryArticle", params);
    }

    // neuen Artikel erstellen
    addArticle(name, symbol, description, addedCategories) {
        // id eines Artikels, vom letzten gespeicherten die Id holen und plus 1 da fortlaufende Nummer
        let id = this.articles[this.articles.length - 1].id++;
        let article = new Article(id, name, symbol, description, addedCategories);
        // neuen Artikel hinzufügen
        this.articles.push(article);
        // zeige Confirmation Page an mit Typ Artikel
        this.notify("renderConfirmationPage", "Artikel");
    }

    // neue Kategorie erstellen
    addCategory(name, addedArticles) {
        let category = new Category(name);
        this.categories.push(category);
        // Kategorie wird zu ausgewählten Artikel hinzugefügt
        for (let articleId of addedArticles) {
           let article =  this.articles.find(article => article.id == articleId);
            article.categories.push(category.name);
        }

        // zeige Confirmation Page an mit Typ Kategorie
        this.notify("renderConfirmationPage", "Kategorie");
    }

    // Artikel oder Kategorie bearbeiten Seite wird geladen
    editCategoryArticle(type, listId) {
        let params;
        if (type === "Kategorie") {
            // mitgegebene Daten
            params = {type: type, data: this.categories, listId: listId, actionData: this.articles};
        } else if (type === "Artikel") {
            params = {type: type, data: this.articles, listId: listId, actionData: this.categories};
        }
        // zeige Artikel oder Kategorie bearbeiten Seite an
        this.notify("renderEditCategoryArticle", params);
    }

    // bei Kategorie bearbeiten und ausgewählter Kategorie werden bereits zugewiesene Artikel angehakt
    loadAssignedArticles(name) {
        // Artikel werden gespeichert, die bereits zugeordnet sind
        let articlesOfCategory = [];
        // Artikel durchgehen
        for (let article of this.articles) {
            // wenn Artikel bereits Kategorie zugewiesen ist
            if (article.categories.includes(name)) {
                // dann speichern
                articlesOfCategory.push(article.name);
            }
        }
        // Häkchen bei Checkboxen
        this.notify("renderCategoryDetails", articlesOfCategory);
    }

    // bei Artikel bearbeiten und ausgewählten Artikeln werden bereits zugewiesene Kategorien angehakt
    loadAssignedCategories(name) {
        // Artikel der gerade bearbeitet wird speichern
        let article = null;
        // Artikel werden durchgegangen
        for (let art of this.articles) {
            // wenn Artikelname gleich ist wie der nachdem man sucht
            if (art.name === name) {
                // dann speichern
                article = art;
            }
        }
        // Häkchen bei Checkboxen
        this.notify("renderCategoryDetails", article.categories);
    }

    // Kategoriename wird bearbeitet
    editCategoryName(oldCategoryName, newCategoryName) {
        // alle Kategorien durchgehen
        for (let category of this.categories) {
            // wenn Kategorie den Namen hat nach dem man sucht
            if (category.name === oldCategoryName) {
                // dann wird Name geändert
                category.name = newCategoryName;
            }
        }
        // Artikel durchgehen
        for (let article of this.articles) {
            // alle Kategorien der Artikel durchgehen
            for (let i = 0; i < article.categories.length; i++) {
                let category = article.categories[i];
                // wenn Kategorie die ist nach der man sucht
                if (category === oldCategoryName) {
                    // dann wird Name geändert
                    article.categories[i] = newCategoryName;
                }
            }
        }
        // Daten für Confirmation Page
        let params = {header: "Kategorie erfolgreich umbenannt!", description: "", target: "Liste"};
        // zeige Confirmation Page mit Daten
        this.notify("renderEditConfirmationPage", params);
    }

    // Artikelname bearbeiten
    editArticleName(oldArticleName, newArticleName) {
        // alle Artikel durchgehen
        for (let article of this.articles) {
            // wenn Artikel den Namen hat nach dem man sucht
            if (article.name === oldArticleName) {
                // dann wird Name geändert
                article.name = newArticleName;
            }
        }
        // alle Listen durchgehen
        for (let list of this.lists) {
            // für jede Liste benötigte Artikel durchgehen
            for (let article of list.articlesToBuy) {
                // wenn Artikel der ist nach dem man sucht
                if (article.name === oldArticleName) {
                    // Name ändern
                    article.name = newArticleName;
                }
            }
            // für jede Liste bereits gekaufte Artikel durchgehen
            for (let article of list.purchasedArticles) {
                // wenn Artikel der ist nach dem man sucht
                if (article.name === oldArticleName) {
                    // Name ändern
                    article.name = newArticleName;
                }
            }
        }
        // Daten für Confirmation Page
        let params = {header: "Artikel erfolgreich umbenannt!", description: "", target: "Liste"};
        // zeige Confirmation Page mit Daten
        this.notify("renderEditConfirmationPage", params);
    }

    // Artikel zu Kategorie hinzufügen/entfernen
    editCategoryAdd(categoryName, assignedArticles) {
        // Artikel durchgehen
        for (let article of this.articles) {
            // wenn Artikel von uns abgehakt wurde
            if (assignedArticles.includes(article.name)) {
                // dann Kategorie zum Artikel hinzufügen
                article.addCategory(categoryName);
            } else {
                // ansonsten Kategorie entfernen
                article.removeCategory(categoryName);
            }
        }
        let params = {
            header: "Artikel wurde(n) erfolgreich zur Kategorie hinzugefügt/entfernt!",
            description: "",
            target: "Liste"
        };
        // zeige Confirmation Page mit Daten
        this.notify("renderEditConfirmationPage", params);
    }

    // Kategorie zu Artikel hinzufügen/entfernen
    editArticleAdd(articleName, assignedCategories) {
        // Artikel speichern den man gerade bearbeitet
        let article = null;
        // alle Artikel durchgehen
        for (let art of this.articles) {
            // wenn Artikel der ist den man sucht
            if (art.name === articleName) {
                // Artikel speichern
                article = art;
            }
        }
        // alle Kategorien durchgehen
        for (let category of this.categories) {
            // wenn Kategorie von uns abgehakt wurde
            if (assignedCategories.includes(category.name)) {
                // dann füge Kategorie zu Artikel hinzu
                article.addCategory(category.name);
            } else {
                // ansonsten Kategorie entfernen
                article.removeCategory(category.name);
            }
        }
        let params = {
            header: "Kategorie(n) wurde(n) erfolgreich zum Artikel hinzugefügt/entfernt!",
            description: "",
            target: "Liste"
        };
        // zeige Confirmation Page mit Daten
        this.notify("renderEditConfirmationPage", params);
    }

    // Kategorie löschen
    editCategoryDelete(categoryName) {
        // schauen ob Kategorie noch wo verwendet wird
        let isUsed = false;
        for (let article of this.articles) {
            if (article.categories.includes(categoryName)) {
                isUsed = true;
            }
        }
        // wenn Kategorie verwendet wird
        if (isUsed === true) {
            let params = {
                header: `Kategorie "${categoryName}" kann nicht gelöscht werden.`,
                description: `Die Kategorie "${categoryName}" kann nicht gelöscht werden, da sich noch ein oder mehrere Artikel in dieser Kategorie befinden.`,
                target: "Liste"
            };
            // zeige Confirmation Page mit Daten (kann nicht gelöscht werden)
            this.notify("renderEditConfirmationPage", params);
        } else {
            // wenn Kategorie nicht verwendet wird, wird Kategorie gelöscht
            this.categories = this.categories.filter(category => category.name !== categoryName);
            let params = {header: "Kategorie erfolgreich gelöscht!", description: "", target: "Liste"};
            // zeige Confirmation Page mit Daten (kann gelöscht werden)
            this.notify("renderEditConfirmationPage", params);
        }

    }

    // löschen eines Artikels
    editArticleDelete(articleName) {
        // schauen, ob Artikel in Liste verwendet wird
        let isUsed = false;
        for (let list of this.lists) {
            for (let article of list.articlesToBuy) {
                if (article.name === articleName) {
                    isUsed = true;
                }
            }
        }
        // wenn Artikel verwendet wird
        if (isUsed === true) {
            let params = {
                header: `Artikel "${articleName}" kann nicht gelöscht werden.`,
                description: `Der Artikel "${articleName}" kann nicht gelöscht werden, da sich dieser Artikel noch in ein oder mehreren Listen befindet.`,
                target: "Liste"
            };
            // zeige Confirmation Page mit Daten (kann nicht gelöscht werden)
            this.notify("renderEditConfirmationPage", params);
        } else {
            // wenn Artikel nicht verwendet wird
            this.articles = this.articles.filter(article => article.name !== articleName);
            for(let list of this.lists) {
                // Artikel wird von Listen von "bereits besorgt" gelöscht
                list.purchasedArticles = list.purchasedArticles.filter(article => article.name !== articleName);
            }
            let params = {header: "Artikel erfolgreich gelöscht!", description: "", target: "Liste"};
            // zeige Confirmation Page mit Daten (kann gelöscht werden)
            this.notify("renderEditConfirmationPage", params);
        }
    }

    // zeige Security Check je nach Typ
    showSecurityCheck(type, name) {
        if (type === "Artikel") {
            this.notify("showSecurityCheckArticle", name);
        } else if (type === "Kategorie") {
            this.notify("showSecurityCheckCategory", name);
        } else if (type === "Liste") {
            this.notify("showSecurityCheckList", name);
        } else if (type === "ListeLöschen") {
            this.notify("showSecurityCheckDeleteList", name);
        }
    }

    // zeige Liste bearbeiten Seite
    editList(listId) {
        this.notify("renderEditList", listId);
    }

    // Liste umbenennen
    editListRename(listId, newName) {
        let list = this.lists[listId];
        list.name = newName;
        let params = {header: "Liste erfolgreich umbenannt!", description: "", target: "Liste"};
        // zeige Confirmation Page mit Daten
        this.notify("renderEditConfirmationPage", params);
    }

    // Personenanzahl ändern einer Liste
    editListPeople(listId, newPeople) {
        let list = this.lists[listId];
        list.people = newPeople;
        let params = {header: "Personenanzahl erfolgreich geändert!", description: "", target: "Liste"};
        // zeige Confirmation Page mit Daten
        this.notify("renderEditConfirmationPage", params);
    }

    // Liste als erledigt kennzeichnen
    completeList(listId) {
        let list = this.lists[listId];
        list.open = false;
        let params = {header: "Liste erfolgreich als erledigt gekennzeichnet!", description: "", target: "Home"};
        // zeige Confirmation Page mit Daten
        this.notify("renderEditConfirmationPage", params);
    }

    // Liste löschen
    deleteList(listId) {
        this.lists = this.lists.filter(list => list.id != listId);
        let params = {header: "Liste erfolgreich gelöscht!", description: "", target: "Home"};
        // zeige Confirmation Page mit Daten
        this.notify("renderEditConfirmationPage", params);
    }

    // Liste wiederherstellen (bei bereits abgeschlossen)
    reOpenList(listId) {
        let list = this.lists[listId];
        list.open = true;
    }
}

// Objekt von Typ ListFusionModel, wird im Controller verwendet
export const model = new ListFusionModel();