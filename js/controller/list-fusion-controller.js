// importiere Model und View
import {model} from "../model/list-fusion-model.js";
import {ListsView} from "../view/lists-view.js";
import {CreateListView} from "../view/create-list-view.js";
import {ListDetailView} from "../view/list-detail-view.js";
import {CreateCategoryArticleView} from "../view/create-category-article-view.js";
import {EditCategoryArticleView} from "../view/edit-category-article-view.js";
import {EditListView} from "../view/edit-list-view.js";

class FusionController {
    listView;
    createListView;
    listDetailView;
    createCategoryArticleView;
    editCategoryArticleView;
    editListView;

    constructor() {
        this.listView = new ListsView();
        this.createListView = new CreateListView();
        this.listDetailView = new ListDetailView();
        this.createCategoryArticleView = new CreateCategoryArticleView();
        this.editCategoryArticleView = new EditCategoryArticleView();
        this.editListView = new EditListView();

        // model wird benachrichtigt, dass unter dem jeweiligen "topic" eine/welche Methode auszuführen ist
        model.subscribe("initLists", this.listView, this.listView.init);
        model.subscribe("initCreateList", this.createListView, this.createListView.init);
        model.subscribe("createNewList", this.listDetailView, this.listDetailView.init);
        model.subscribe("renderCategories", this.listDetailView, this.listDetailView.renderCategories);
        model.subscribe("renderArticles", this.listDetailView, this.listDetailView.renderArticles);
        model.subscribe("renderArticleModal", this.listDetailView, this.listDetailView.renderArticleModal);
        model.subscribe("renderArticlesToBuy", this.listDetailView, this.listDetailView.renderArticlesToBuy);
        model.subscribe("renderPurchasedArticles", this.listDetailView, this.listDetailView.renderPurchasedArticles);
        model.subscribe("renderCreateCategoryArticle", this.createCategoryArticleView, this.createCategoryArticleView.init);
        model.subscribe("renderConfirmationPage", this.createCategoryArticleView, this.createCategoryArticleView.renderConfirmationPage);
        model.subscribe("renderEditCategoryArticle", this.editCategoryArticleView, this.editCategoryArticleView.init);
        model.subscribe("renderCategoryDetails", this.editCategoryArticleView, this.editCategoryArticleView.renderCategoryDetails);
        model.subscribe("renderEditConfirmationPage", this.editCategoryArticleView, this.editCategoryArticleView.renderEditConfirmationPage);
        model.subscribe("showSecurityCheckCategory", this.editCategoryArticleView, this.editCategoryArticleView.showSecurityCheckCategory);
        model.subscribe("showSecurityCheckArticle", this.editCategoryArticleView, this.editCategoryArticleView.showSecurityCheckArticle);
        model.subscribe("renderEditList", this.editListView, this.editListView.init);
        model.subscribe("showSecurityCheckList", this.editListView, this.editListView.showSecurityCheck);
        model.subscribe("showSecurityCheckDeleteList", this.editListView, this.editListView.showSecurityCheckDeleteList);
    }

    // Methode, die aufgerufen wird, wenn Index.html Seite geladen wird
    init() {
        // Daten werden aus data.json geladen und anschließend wird Startseite angezeigt
        model.init().then(() => {
            model.initLists();
            // Methode aufrufen um Eventlistener zu Startseite hinzuzufügen
            fusionController.initListOverviewPage();
        })
    }

    // Methode um Eventlistener zu Startseite hinzuzufügen
    initListOverviewPage() {
        document.querySelector(".add-new-list-button").onclick = function () {
            // neue Liste erstellen wenn auf Button geklickt wird
            model.initCreateList();
            // Methode aufrufen um Eventlistener in CreateNewListPage hinzuzufügen
            fusionController.initCreateNewListPage();
        }
        // alle Listen holen die auf Startseite angezeigt werden
        let lists = document.querySelectorAll(".list-card");
        // durch alle Listen durchgehen
        for (let list of lists) {
            // jeweils Eventlistener hinzufügen, dass man auf Liste draufklicken kann
            list.onclick = function (event) {
                // list-id von jeder Liste herausfinden
                let listId = event.currentTarget.getAttribute("list-id");
                // Listendetails von jeweiliger Liste werden angezeigt
                model.showListDetails(listId);
                // Methode aufrufen um Eventlistener zu Detailseite hinzuzufügen
                fusionController.initListDetailPage();
            }
        }
    }

    // Methode um Eventlistener zu "Neue Liste erstellen" Seite hinzuzufügen
    initCreateNewListPage() {
        // zurück-Button
        document.querySelector(".back").onclick = function () {
            // Laden der Startseite nach Zurück-Klick
            model.initLists();
            // Methode aufrufen um Eventlistener zu Startseite hinzuzufügen
            fusionController.initListOverviewPage();
        }
        // "Liste-erstellen"-Button
        document.querySelector("#createNewListForm").addEventListener("submit", function (event) {
            // um Neuladen der Seite zu vermeiden (damit gerade erstellte Liste angezeigt wird)
            event.preventDefault();
            // Name und Personenanzahl von der Eingabe holen
            let name = document.querySelector("#listName").value;
            let people = document.querySelector("#personCount").value;
            // wenn Name leer ist dann kommt Alert mit Aufforderung
            if (name === "") {
                alert("Bitte Name eingeben!");
                // Liste wird nicht erstellt, bevor Name nicht eingegeben wurde
                return;
            }
            // neue Liste wird erstellt und Detailseite wird angezeigt
            model.createNewList(name, people);
            // Methode aufrufen um Eventlistener zu Detailseite hinzuzufügen
            fusionController.initListDetailPage();
        });
    }

    // Methode um Eventlistener zu Detailseite einer Liste hinzuzufügen
    initListDetailPage() {
        // alle Artikel holen
        let articles = document.querySelectorAll(".article-card");
        // Artikel durchgehen
        for (let article of articles) {
            // bei Klicken auf Artikel soll "Modal" aufgehen, in dem man Daten eingeben kann und Artikel anschließend zur Liste hinzugefügt werden kann
            article.onclick = function (event) {
                // Artikel-Id des ausgewählten Artikels bestimmen
                let articleId = event.currentTarget.getAttribute("article-id");
                // Status der Liste, ob diese offen oder geschlossen ist
                let status = document.querySelector("#list-detail").getAttribute("status");
                // wenn Liste geschlossen ist, kann Artikel nicht zur Liste hinzugefügt werden
                if (status === "false") {
                    return;
                }
                // "Modal" wird geöffnet, in dem man Daten für Artikel eingeben kann
                model.selectArticle(articleId);
                // Methode aufrufen um Eventlistener zu "Modal" hinzuzufügen
                fusionController.initAddArticleToListModal(articleId);
            }
        }
        // alle Artikel werden ausgewählt, die in "benötigte Artikel" enthalten sind
        let articlesToBuy = document.querySelectorAll("#articles-to-buy-container > .list-group-item");
        // Artikel durchgehen
        for (let article of articlesToBuy) {
            // hinzufügen eines onchange-Eventlisteners um bei Abhaken eines Artikels ihn zu "bereits besorgt" zu verschieben
            article.onchange = function (event) {
                // Artikel-Id des Artikels holen, der gerade abgehakt wurde
                let articleId = event.currentTarget.getAttribute("article-id");
                // List-Id holen, in welcher Liste der Artikel gerade abgehakt wurde
                let listId = document.querySelector("#list-detail").getAttribute("list-id");
                // Artikel wird nach unten in "bereits besorgt" verschoben und Artikel in Liste werden neu geladen
                model.tickOff(articleId, listId);
                // Methode aufrufen um Eventlistener zu Detailseite hinzuzufügen
                fusionController.initListDetailPage();
            }
        }
        // alle "bereits besorgten" Artikel holen
        let purchasedArticles = document.querySelectorAll("#purchased-articles-container > .list-group-item");
        // Artikel durchgehen
        for (let article of purchasedArticles) {
            // hinzufügen eines onchange-Eventlisteners um bei wieder anhaken eines Artikels ihn zu "benötigte Artikel" zu verschieben
            article.onchange = function (event) {
                // Artikel-Id des Artikels holen, der wieder angehakt wurde
                let articleId = event.currentTarget.getAttribute("article-id");
                // List-Id holen, in welcher Liste der Artikel gerade wieder angehakt wurde
                let listId = document.querySelector("#list-detail").getAttribute("list-id");
                // Artikel wird nach oben in "benötigte Artikel" verschoben und Artikel in Liste werden neu geladen
                model.unTick(articleId, listId);
                // Methode aufrufen um Eventlistener zu Detailseite hinzuzufügen
                fusionController.initListDetailPage();
            }
        }
        // "zurück" zur Listenübersicht holen und Eventlistener hinzufügen
        document.querySelector("#back-to-homepage").onclick = function () {
            // Listenübersicht wird geladen wenn ich auf Button geklickt habe
            model.initLists();
            // Methode aufrufen um Eventlistener zur Übersichtsseite hinzuzufügen
            fusionController.initListOverviewPage();
        }
        // alle Kategorien holen
        let categoryButton = document.querySelectorAll(".category-button");
        // Kateogrien durchgehen
        for (let category of categoryButton) {
            // Eventlistener zu jeder Kategorie hinzufügen, damit man draufklicken kann
            category.onclick = function (event) {
                // Kategoriename holen
                let category = event.currentTarget.textContent;
                // Klassen auf einer Kategorie holen
                let classes = event.currentTarget.classList;
                // wenn Klasse bereits aktiv ist (ausgewählt ist),
                if (classes.contains("active")) {
                    // dann entferne "aktiv"
                    classes.remove("active");
                    // entferne Filter der ausgewählten Kategorie
                    model.removeCategoryFilter(category);
                } else {
                    // ansonsten (wenn Kategorie nicht aktiv ist), dann bei Button "alle Kategorien" Status aktiv entfernen
                    document.querySelector("#all-categories-filter").classList.remove("active");
                    // auf jeweiliger Kategorie aktiv hinzufügen
                    classes.add("active");
                    // filtern nach ausgewählter Kategorie
                    model.addCategoryFilter(category);
                }
                // wenn nach "alle Kategorien" gefiltert wird
                if (category === "Alle Kategorien") {
                    // alle Kategorie-Buttons auswählen
                    let categoryButton = document.querySelectorAll(".category-button");
                    // Kategorie-Buttons durchlaufen
                    for (let category of categoryButton) {
                        // bei allen Buttons, die nicht "Alle Kategorien"-Button sind
                        if (category.innerText !== "Alle Kategorien") {
                            // wird aktiv-Status entfernt
                            category.classList.remove("active");
                        }
                    }
                }
                // wenn keine Kategorie mehr ausgewählt ist (Länge ist 1), dann wird "alle Kategorien" Button aktiv gesetzt
                if (model.filterCategories.length === 1 && model.filterCategories.includes("Alle Kategorien")) {
                    // alle Kategorien Button wird auf aktiv gesetzt
                    document.querySelector("#all-categories-filter").classList.add("active");
                }
                // Methode aufrufen um Eventlistener zur Detailseite hinzuzufügen
                fusionController.initListDetailPage();
            }
        }
        // Eventlistener wird zu "neuen Artikel anlegen" Button hinzugefügt
        document.querySelector("#new-article-btn").onclick = function () {
            // listId von Seite, auf der man sich gerade befindet
            let listId = document.querySelector("#list-detail").getAttribute("list-id");
            // zeige "neuen Artikel anlegen" Seite an
            model.createCategoryArticle("Artikel", listId);
            // Methode aufrufen um Eventlistener zu "neuen Artikel anlegen"-Seite hinzuzufügen
            fusionController.initCreateCategoryArticlePage();
        }
        // Eventlistener wird zu "neue Kategorie anlegen" Button hinzugefügt
        document.querySelector("#new-category-btn").onclick = function () {
            // listId von Seite, auf der man sich gerade befindet
            let listId = document.querySelector("#list-detail").getAttribute("list-id");
            // zeige "neue Kategorie anlegen" Seite an
            model.createCategoryArticle("Kategorie", listId);
            // Methode aufrufen um Eventlistener zu "neue Kategorie anlegen"-Seite hinzuzufügen
            fusionController.initCreateCategoryArticlePage();
        }
        // Eventlistener wird zu "Kategorien bearbeiten" Button hinzugefügt
        document.querySelector("#edit-category-btn").onclick = function () {
            // listId von Seite, auf der man sich gerade befindet
            let listId = document.querySelector("#list-detail").getAttribute("list-id");
            // zeige "Kategorien bearbeiten" Seite an
            model.editCategoryArticle("Kategorie", listId);
            // Methode aufrufen um Eventlistener zu "Kategorien bearbeiten"-Seite hinzuzufügen
            fusionController.initEditCategoryArticlePage();
        }
        // Eventlistener wird zu "Artikel bearbeiten" Button hinzugefügt
        document.querySelector("#edit-article-btn").onclick = function () {
            // listId von Seite, auf der man sich gerade befindet
            let listId = document.querySelector("#list-detail").getAttribute("list-id");
            // zeige "Artikel bearbeiten" Seite an
            model.editCategoryArticle("Artikel", listId);
            // Methode aufrufen um Eventlistener zu "Artikel bearbeiten"-Seite hinzuzufügen
            fusionController.initEditCategoryArticlePage();
        }
        // Eventlistener wird zu "Liste bearbeiten" Button hinzugefügt
        document.querySelector("#edit-list-btn").onclick = function () {
            // listId von Seite, auf der man sich gerade befindet
            let listId = document.querySelector("#list-detail").getAttribute("list-id");
            // zeige "Liste bearbeiten" Seite an
            model.editList(listId);
            // Methode aufrufen um Eventlistener zu "Liste bearbeiten"-Seite hinzuzufügen
            fusionController.initEditListPage();
        }
        // Eventlistener wird zu "Liste als erledigt kennzeichnen" Button hinzugefügt
        document.querySelector("#finish-list-btn").onclick = function () {
            // status der Liste (offen oder geschlossen) ermitteln
            let status = document.querySelector("#list-detail").getAttribute("status");
            // listId von aktueller Seite ermitteln
            let listId = document.querySelector("#list-detail").getAttribute("list-id");
            // wenn Status der Liste geschlossen ist
            if (status === "false") {
                // dann wird Liste wieder geöffnet
                model.reOpenList(listId);
                // zeige Übersichtsseite an
                model.initLists();
                // Methode aufrufen um Eventlistener zu Überssichtsseite hinzuzufügen
                fusionController.initListOverviewPage();
            } else {
                // wenn Status der Liste geöffnet ist, dann zeige SecurityCheck an
                // von aktueller Liste den Namen holen
                let listname = model.lists[listId].name;
                // zeige SecurityCheck mit Name der Liste an
                model.showSecurityCheck("Liste", listname);
                // Methode aufrufen um Eventlistener zu Security Check Seite hinzuzufügen
                fusionController.initSecurityCheck();
            }
        }
        // Eventlistener wird zu "Liste löschen" Button hinzugefügt
        document.querySelector("#delete-list-btn").onclick = function () {
            // listId von aktueller Seite ermitteln
            let listId = document.querySelector("#list-detail").getAttribute("list-id");
            // von aktueller Liste den Namen holen
            let listname = model.lists[listId].name;
            // zeige SecurityCheck mit Name der Liste an
            model.showSecurityCheck("ListeLöschen", listname);
            // Methode aufrufen um Eventlistener zu Security Check Seite hinzuzufügen
            fusionController.initSecurityCheck();
        }
    }

    // "Modal" das sich öffnet, wenn man Artikel anklickt - Eventlistener dafür hinzufügen
    initAddArticleToListModal(articleId) {
        // Eventlistener wird zu "Artikel hinzufügen" Button hinzugefügt
        document.querySelector("#add-article-to-list").onclick = function (event) {
            // listId von aktueller Seite ermitteln
            let listId = document.querySelector("#list-detail").getAttribute("list-id");
            // eingegebene Einheit ermitteln
            let unit = document.querySelector("#unit-select").value;
            // eingegebene Menge ermitteln
            let amount = document.querySelector("#amount-input").value;
            // wenn keine Einheit oder keine Menge eingegeben wurde, dann wirf Alert aus
            if (unit === "Bitte auswählen" || amount === "") {
                alert("Bitte überprüfe, ob die geforderten Felder (Einheit, Menge) ausgefüllt sind!");
                // Artikel wird nicht zur Liste hinzugefügt
                return;
            }
            // Artikel wird zur Liste hinzugefügt und Artikel oben werden neu geladen
            model.addArticleToList(listId, articleId, unit, amount);
            // Methode aufrufen um Eventlistener zur Detailseite hinzuzufügen
            fusionController.initListDetailPage();
        }
    }

    // Seite bei erstellen eines Artikels oder einer Kategorie - Eventlistener dafür hinzufügen
    initCreateCategoryArticlePage() {
        // Eventlistener wird zu "zurück" Button hinzugefügt
        document.querySelector("#back-btn").onclick = function () {
            // listId von aktueller Seite ermitteln
            let listId = document.querySelector("#create-new-article-category").getAttribute("list-id");
            // zeige Listen Details von der List-Id (bei zurück)
            model.showListDetails(listId);
            // Methode aufrufen um Eventlistener zur Detailseite hinzuzufügen
            fusionController.initListDetailPage();
        }
        // Éventlistener wird zu "Artikel erstellen" Button hinzugefügt
        document.querySelector("#create-new-article-category").addEventListener("submit", function (event) {
            // Seite wird nicht neu geladen bei draufdrücken, sondern neuer Artikel wird auch angezeigt
            event.preventDefault();
            // Typ wird geholt - ob man Kategorie oder Artikel erstellt
            let type = document.querySelector("#create-new-article-category").getAttribute("type");
            // wenn Typ Artikel ist,
            if (type === "Artikel") {
                // Name holen
                let name = document.querySelector("#articleName").value;
                // Symbol holen
                let symbol = document.querySelector("#icon-select").value;
                // Beschreibung holen
                let description = document.querySelector("#article-description").value;
                // alle Kategorien holen
                let categories = document.querySelectorAll("#category-checkbox");
                // Kategorien speichern, die angehakt wurden
                let addedCategories = [];
                // Kategorien durchgehen
                for (let category of categories) {
                    // wenn Kategorie angehakt ist
                    if (category.checked === true) {
                        // füge Kategorie hinzu
                        addedCategories.push(category.value);
                    }
                }
                // wenn Name oder Symbol nicht ausgewählt wurden, kommt Alert mit Aufforderung
                if (name === "" || symbol === "Bitte auswählen") {
                    alert("Bitte überprüfe, ob die geforderten Felder (Name, Symbol) ausgefüllt sind!");
                    // Artikel wird nicht hinzugefügt
                    return;
                }
                // neuer Artikel wird hinzugefügt mit eingegebenen Parametern und confirmation Page wird aufgerufen
                model.addArticle(name, symbol, description, addedCategories);
                // wenn Typ Kategorie ist
            } else if (type === "Kategorie") {
                // Name holen
                let name = document.querySelector("#categoryName").value;
                // alle Artikel holen
                let articles = document.querySelectorAll("#article-checkbox");
                // Artikel speichern, die angehakt wurden
                let addedArticles = [];
                // Artikel durchgehen
                for (let article of articles) {
                    // wenn Artikel angehakt ist
                    if (article.checked === true) {
                        // füge Artikel hinzu
                        addedArticles.push(article.value);
                    }
                }
                // wenn Name nicht eingegeben wurde, wirf Alert mit Aufforderung
                if (name === "") {
                    alert("Bitte überprüfe, ob das geforderte Feld (Name) ausgefüllt ist!");
                    // Kategorie wird nicht hinzugefügt
                    return;
                }
                // neue Kategorie wird hinzugefügt mit eingegebenen Parametern und Confirmation Page wird aufgerufen
                model.addCategory(name, addedArticles);
            }
            // Methode aufrufen um Eventlistener zur Confirmation Page hinzuzufügen
            fusionController.initConfirmationPage();
        })
    }

    // Methode um Eventlistener zu Confirmation Page hinzuzufügen
    initConfirmationPage() {
        // Éventlistener wird zu "zurück zur Liste" Button hinzugefügt
        document.querySelector("#back-to-list").onclick = function (event) {
            // listId von aktueller Seite ermitteln
            let listId = event.currentTarget.getAttribute("list-id");
            // Detailseite der Liste wird angezeigt
            model.showListDetails(listId);
            // Methode aufrufen um Eventlistener zur Detailseite hinzuzufügen
            fusionController.initListDetailPage();
        }
    }

    // Methode um Eventlistener zu Seite bei Bearbeiten einer Kategorie oder Artikel Seite hinzuzufügen
    initEditCategoryArticlePage() {
        // Eventlistener für Kategorie oder Artikel umbenenennen Radio Button
        document.querySelector("#rename-category-article").addEventListener("change", function () {
            // umbenennen Feld wird angezeigt
            document.querySelector("#category-article-name-container").classList.remove("hidden");
            // Checkboxen für Kategorien oder Artikel werden versteckt
            document.querySelector("#edit-articles-to-category-container").classList.add("hidden");
        });
        // Eventlistener für hinzufügen/entfernen von Kategorien/Artikel Radio Button
        document.querySelector("#assign-category-article").addEventListener("change", function () {
            // umbenennen Feld wird versteckt
            document.querySelector("#category-article-name-container").classList.add("hidden");
            // Checkboxen für Kategorien oder Artikel werden angezeigt
            document.querySelector("#edit-articles-to-category-container").classList.remove("hidden");

        });
        // Eventlistener für Kategorie oder Artikel löschen Radio Button
        document.querySelector("#delete-category-article").addEventListener("change", function () {
            // umbenennen Feld wird versteckt
            document.querySelector("#category-article-name-container").classList.add("hidden");
            // Checkboxen für Kategorien oder Artikel werden versteckt
            document.querySelector("#edit-articles-to-category-container").classList.add("hidden");
        });
        // Eventlistener für Feld wo man Kategorie oder Artikel auswählt, die man bearbeiten will
        document.querySelector("#category-select").onchange = function (event) {
            // Name der ausgewählten Kategorie/Artikel
            let currentName = event.currentTarget.value;
            // Typ der ausgewählten Kategorie/Artikel
            let type = document.querySelector(".action-btns").getAttribute("type");
            // wenn es ein Artikel ist
            if (type === "Artikel") {
                // bei Checkboxen werden bei zugewiesenen Kategorien Häkchen angezeigt
                model.loadAssignedCategories(currentName);
                // wenn es eine Kategorie ist
            } else if (type === "Kategorie") {
                // bei Checkboxen werden bei zugewiesenen Artikeln Häkchen angezeigt
                model.loadAssignedArticles(currentName);
            }
        }
        // Eventlistener für zurück Button hinzufügen
        document.querySelector("#back-btn").onclick = function () {
            // listId von aktueller Seite ermitteln
            let listId = document.querySelector(".action-btns").getAttribute("list-id");
            // Detailseite der Liste wird angezeigt
            model.showListDetails(listId);
            // Methode aufrufen um Eventlistener zur Detailseite hinzuzufügen
            fusionController.initListDetailPage();
        }
        // Eventlistener für "Änderung übernehmen" Button hinzufügen
        document.querySelector(".edit-category-article").onclick = function () {
            // Wert ob "Artikel/Kategorie umbenennen" angehakt wurde holen
            let rename = document.querySelector("#rename-category-article").checked;
            // Wert ob "Kategorien/Artikel hinzufügen" angehakt wurde holen
            let addArticlesCategories = document.querySelector("#assign-category-article").checked;
            // Wert ob "Kategorie/Artikel löschen" angehakt wurde holen
            let deleteArticlesCategory = document.querySelector("#delete-category-article").checked;
            // Wert von select holen (welche Kategorie/Artikel wurde ausgewählt)
            let currentName = document.querySelector("#category-select").value;
            // Typ holen, ob Kategorie oder Artikel bearbeitet wird
            let type = document.querySelector(".action-btns").getAttribute("type");
            // wenn kein Artikel/Kategorie ausgewählt wurde, dann wirf Alert mit Aufforderung
            if (currentName === "Bitte auswählen") {
                alert(`Bitte ${type} auswählen!`);
                // Artikel/Kategorie wird nicht bearbeitet
                return;
            }
            // wenn angehakt ist, dass Artikel/Kategorie umbenennen
            if (rename === true) {
                // dann neuen Namen holen
                let newName = document.querySelector("#category-article-name").value;
                // wenn kein neuer Name eingegeben wurde, dann wirf Alert mit Fehlermeldung
                if (newName === "") {
                    alert("Neuer Name muss mind. 1 Zeichen haben!")
                    // Artikel/Kategorie wird nicht umbenannt
                    return;
                }
                // wenn Typ Artikel ist
                if (type === "Artikel") {
                    // editiere Artikelname und lade Confirmation Page
                    model.editArticleName(currentName, newName);
                    // wenn Typ Kategorie ist
                } else if (type === "Kategorie") {
                    // editiere Kategoriename und lade Confirmation Page
                    model.editCategoryName(currentName, newName);
                }
                // Methode aufrufen um Eventlistener zur Confirmation Page hinzuzufügen
                fusionController.initEditConfirmationPage();
                // wenn  angehakt ist, dass Artikel/Kategorie Artikel/Kategorie hinzufügen
            } else if (addArticlesCategories === true) {
                // dann ausgewählte Artikel/Kategorien speichern
                let assignedArticlesCategories = [];
                // dann ausgewählte Artikel/Kategorien holen
                let checkboxes = document.querySelectorAll("#article-checkbox");
                // alle Artikel/Kategorien durchgehen
                for (let checkbox of checkboxes) {
                    // wenn Artikel/Kategorie angehakt ist
                    if (checkbox.checked === true) {
                        // dann speichern zu Kategorie/Artikel
                        assignedArticlesCategories.push(checkbox.value);
                    }
                }
                // wenn Typ Kategorie ist
                if (type === "Kategorie") {
                    // füge Artikel zur Kategorie hinzu und lade Confirmation Page
                    model.editCategoryAdd(currentName, assignedArticlesCategories);
                    // wenn Typ Artikel ist
                } else if (type === "Artikel") {
                    // füge Kategorie zu Artikel hinzu und lade Confirmation Page
                    model.editArticleAdd(currentName, assignedArticlesCategories);
                }
                // Methode aufrufen um Eventlistener zur Confirmation Page hinzuzufügen
                fusionController.initEditConfirmationPage();
                // wenn angehakt, dass Artikel/Kategorie löschen
            } else if (deleteArticlesCategory === true) {
                // zeige Security Check an mit Name
                model.showSecurityCheck(type, currentName);
                // Methode aufrufen um Eventlistener zur Security Check Seite hinzuzufügen
                fusionController.initSecurityCheck();
            } else {
                // wenn nicht ausgewählt, dann Alert mit Aufforderung werfen
                alert(`Bitte Aktion zu ${type} auswählen!`)
            }
        }
    }

    // Methode um Eventlistener zu Confirmation Page hinzuzufügen
    initEditConfirmationPage() {
        // füge Eventlistener zu zurück zur Liste Button hinzu
        document.querySelector("#back-to-list").onclick = function () {
            // hole Target um zu wissen, ob zur Detailseite oder Startseite zurück navigieren
            let target = document.querySelector("#back-to-list").getAttribute("nav-target");
            // wenn target Liste ist dann zur Detailseite zurückgehen
            if (target === "Liste") {
                // listId von aktueller Seite ermitteln
                let listId = document.querySelector("#back-to-list").getAttribute("list-id");
                // zeige Detailseite der Liste an
                model.showListDetails(listId);
                // Methode aufrufen um Eventlistener zur Detailseite hinzuzufügen
                fusionController.initListDetailPage();
                // wenn target Home ist, dann zur Startseite zurückgehen
            } else if (target === "Home") {
                // zeige Übersichtsseite an
                model.initLists();
                // Methode aufrufen um Eventlistener zur Übersichtsseite hinzuzufügen
                fusionController.initListOverviewPage();
            }
        }
    }

    // Methode um Eventlistener zu Security Check Seite hinzuzufügen
    initSecurityCheck() {
        // füge Eventlistener zu zurück Button hinzu
        document.querySelector("#back-btn").onclick = function () {
            // listId von aktueller Seite ermitteln
            let listId = document.querySelector(".action-btns").getAttribute("list-id");
            // zeige Detailseite der Liste an
            model.showListDetails(listId);
            // Methode aufrufen um Eventlistener zur Detailseite hinzuzufügen
            fusionController.initListDetailPage();
        }
        // füge Eventlistener zu "ja" Button hinzu
        document.querySelector("#yes-btn").onclick = function () {
            // Name von Artikel/Kategorie/Liste mit der man die Aktion macht
            let name = document.querySelector("#yes-btn").getAttribute("name");
            // Typ ob Artikel, Kategorie oder Liste
            let type = document.querySelector(".action-btns").getAttribute("type");
            // wenn Typ Artikel
            if (type === "Artikel") {
                // dann lösche Artikel und zeige Confirmation Page an oder Abbruchsseite wenn nicht möglich
                model.editArticleDelete(name);
                // wenn Typ Kategorie
            } else if (type === "Kategorie") {
                // dann lösche Kategorie und zeige Confirmation Page an oder Abbruchsseite wenn nicht möglich
                model.editCategoryDelete(name);
                // wenn Typ Liste
            } else if (type === "Liste") {
                // listId von aktueller Seite ermitteln
                let listId = document.querySelector(".action-btns").getAttribute("list-id");
                // setze Liste auf abgeschlossen und zeige Confirmation Page an
                model.completeList(listId);
                // wenn Typ ListeLöschen
            } else if (type === "ListeLöschen") {
                // listId von aktueller Seite ermitteln
                let listId = document.querySelector(".action-btns").getAttribute("list-id");
                // lösche Liste und zeige Confirmation Page an
                model.deleteList(listId);
            }
            // Methode aufrufen um Eventlistener zur Confirmation Page hinzuzufügen
            fusionController.initEditConfirmationPage();
        }
    }

    // Methode um Eventlistener zu Liste Bearbeiten Seite hinzuzufügen
    initEditListPage() {
        // Eventlistener für Liste umbenenennen Radio Button
        document.querySelector("#rename-list").addEventListener("change", function () {
            // umbenennen Feld wird angezeigt
            document.querySelector("#list-name-container").classList.remove("hidden");
            // Personenanzahl Feld wird versteckt
            document.querySelector("#people-number-container").classList.add("hidden");
        });
        // // Eventlistener für Personenanzahl ändern Radio Button
        document.querySelector("#change-people-list").addEventListener("change", function () {
            // umbenennen Feld wird versteckt
            document.querySelector("#list-name-container").classList.add("hidden");
            // Personenanzahl Feld wird angezeigt
            document.querySelector("#people-number-container").classList.remove("hidden");
        });
        // Eventlistener für zurück Button
        document.querySelector("#back-btn").onclick = function () {
            // listId von aktueller Seite ermitteln
            let listId = document.querySelector(".action-btns").getAttribute("list-id");
            // zeige Detailseite der Liste an
            model.showListDetails(listId);
            // Methode aufrufen um Eventlistener zur Detailseite hinzuzufügen
            fusionController.initListDetailPage();
        }
        // Eventlistener für Änderung übernehmen Button
        document.querySelector("#edit-list").onclick = function () {
            // listId von aktueller Seite ermitteln
            let listId = document.querySelector(".action-btns").getAttribute("list-id");
            // holen, ob Radio Btn Liste umbenennen angehakt ist
            let renameList = document.querySelector("#rename-list").checked;
            // holen, ob Radio Btn Personenanzahl ändern angehakt ist
            let people = document.querySelector("#change-people-list").checked;
            // wenn umbenennen angehakt
            if (renameList === true) {
                // name holen
                let newName = document.querySelector("#list-newname").value;
                // wenn kein Name eingegeben wurde, dann wirf Alert mit Aufforderung
                if (newName === "") {
                    alert("Neuer Name muss mind. 1 Zeichen haben!");
                    // Liste wurde nicht umbenannt
                    return;
                }
                // Liste wird umbenannt und Confirmation Page wird angezeigt
                model.editListRename(listId, newName);
                // wenn Personenanzahl angehakt
            } else if (people === true) {
                // Personenanzahl holen
                let newPeople = document.querySelector("#list-newpeople").value;
                // Personenanzahl ändern und Confirmation Page wird angezeigt
                model.editListPeople(listId, newPeople);
            } else {
                // wenn keine Aktion ausgewählt dann wirf Alert mit Aufforderung
                alert(`Bitte Aktion zur Liste auswählen!`);
                // Liste wird nicht bearbeitet
                return;
            }
            // Methode aufrufen um Eventlistener zur Confirmation Page hinzuzufügen
            fusionController.initEditConfirmationPage();
        }
    }
}

// Objekt von Typ FusionController, ist dafür da um im Main darauf zugreifen zu können
export const fusionController = new FusionController();