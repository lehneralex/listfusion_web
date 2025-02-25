export class ListDetailView {
    // zeigt Detailansicht einer Liste an
    init(list){
        let people = "";
        if(list.people !== ""){
           people = "(" + list.people + " Pers.)"
        }
        let disabled = "";
        let liststatus = "Liste als erledigt kennzeichnen";
        if (list.open == false){
            disabled = "disabled";
            liststatus = "Liste wiederherstellen";
        }
        let listDetailHtml = `
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
        <div class="d-flex justify-content-between align-items-center" id="list-detail" list-id="${list.id}" status="${list.open}">
            <h1>${list.name + " " + people}</h1>
            <button class="btn btn-primary" id="back-to-homepage">&lt; zurück zur Listenübersicht</button>
        </div>
        <h3>Benötigte Artikel:</h3>
        <ul class="list-group" id="articles-to-buy-container">
        </ul>
        <h3>Bereits besorgte Artikel:</h3>
        <ul class="list-group" id="purchased-articles-container">
        </ul>
        <hr class="cut-detail-view">
        <div class="row">
            <div class="col-md-12">
                <h3>Filtern nach:</h3>
                <div class="row" id="categories">
                    <div class="category-container btn-group" role="group">
                        <button id="all-categories-filter" ${disabled} type="button" class="btn btn-outline-primary category-button active">Alle Kategorien</button>
                    </div>
                </div>
            </div>
        </div>
        
        <h3 class=select-articles>Ich brauche ...</h3>
        <div id="articles">
            <div id="articles-container" class="row row-cols-5 gap-3"></div>
            <div class="row row-cols-2 article">
                    <div class="col-auto">
                        <button type="button" class="btn btn-secondary list-details-actions" ${disabled} id="edit-article-btn">Artikel bearbeiten ></button>
                    </div>
                    <div class="col-auto">
                        <button type="button" class="btn btn-secondary list-details-actions" ${disabled} id="new-article-btn">+ neuen Artikel anlegen</button>
                    </div>
                    <div class="col-auto">
                        <button type="button" class="btn btn-secondary list-details-actions" ${disabled} id="edit-category-btn">Kategorien bearbeiten ></button>
                    </div>
                    <div class="col-auto">
                        <button type="button" class="btn btn-secondary list-details-actions" ${disabled} id="new-category-btn">+ neue Kategorie anlegen</button>
                    </div>
            </div>
        </div>
        <hr class="cut-detail-view">
        <h3>Aktionen zu dieser Liste</h3>
        <div class="row mt-3">
            <div class="col-auto">
                <button type="button" class="btn btn-primary" id="edit-list-btn" ${disabled}>
                    <i class="bi bi-pencil"></i> Liste bearbeiten
                </button>
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-primary" disabled>
                    <i class="bi bi-share"></i> Liste mit anderen teilen
                </button>
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-auto">
                <button type="button" class="btn btn-primary" id="finish-list-btn">
                    <i class="bi bi-check-circle"></i> ${liststatus}
                </button>
            </div>
            <div class="col-auto">
                <button type="button" class="btn btn-primary" id="delete-list-btn" ${disabled}>
                    <i class="bi bi-trash"></i> Liste löschen
                </button>
            </div>
        </div>
        `
        // html wird als child vom container angezeigt
        document.querySelector(".container").innerHTML = listDetailHtml;
    }

    // zeigt benötigte Artikel in einer Liste an
    renderArticlesToBuy(articlesToBuy) {
        let articlesToBuyContainer = document.querySelector("#articles-to-buy-container");
        // zurücksetzen der angezeigten Artikel
        articlesToBuyContainer.innerHTML = "";
        // alle Artikel durchgehen
        for(let i = 0; i < articlesToBuy.length; i++) {
            // Artikel holen
            let article = articlesToBuy[i];
            // getArticleOfListHtml aufrufen und gibt 1 Artikel Html zurück
            let articlesToBuyHtml = this.#getArticleOfListHtml(article, i, false);
            // html wird als child von "benötigter Liste" angezeigt
            articlesToBuyContainer.insertAdjacentHTML("beforeend", articlesToBuyHtml);
        }
    }

    // zeigt bereits besorgte Artikel in einer Liste an
    renderPurchasedArticles(purchasedArticles) {
        let purchasedArticlesContainer = document.querySelector("#purchased-articles-container");
        // zurücksetzen der angezeigten Artikel
        purchasedArticlesContainer.innerHTML = "";
        // alle Artikel durchgehen
        for(let i = 0; i < purchasedArticles.length; i++) {
            // Artikel holen
            let article = purchasedArticles[i];
            // getArticleOfListHtml aufrufen und gibt 1 Artikel Html zurück
            let purchasedArticleHtml = this.#getArticleOfListHtml(article, i, true);
            // html wird als child von "benötigter Liste" angezeigt
            purchasedArticlesContainer.insertAdjacentHTML("beforeend", purchasedArticleHtml);
        }
    }

    // 1 Artikel bei benötigte oder bereits besorgte Artikel wird erstellt
    #getArticleOfListHtml(article, articleId, closed){
        let checked = "";
        let disabled = "";
        // status ob Liste offen oder abgeschlossen ist
        let status = document.querySelector("#list-detail").getAttribute("status");

        if(closed === true){
            checked = "checked";
        }
        if (status === "false"){
            disabled = "disabled";
        }
        let articleHtml = `
        <li class="list-group-item d-flex gap-2 article-checkbox-container" article-id="${articleId}">
                <input class="form-check-input me-1" type="checkbox" value="" ${checked} id="firstCheckbox" ${disabled}>
                <div class="form-check-label d-flex justify-content-between article-name-label-container">
                    <p class="article-name-label action-label">${article.name}</p>
                    <p class="article-name-label action-label">${article.amount + " " + article.unit}</p>
                </div>
        </li>
        `
        // Artikel Html wird zurückgegeben um es später zu laden
        return articleHtml;
    }

    // Buttons für Kategorien werden geladen
    renderCategories(categories) {
        let categoryContainer = document.querySelector(".category-container");
        let status = document.querySelector("#list-detail").getAttribute("status");
        let disabled = "";
        if (status === "false"){
            disabled = "disabled";
        }
        for(let category of categories){
            let buttonHtml =`
            <button type="button" ${disabled} class="btn btn-outline-primary category-button">${category.name}</button>
            
            `
            // html wird als child von Filtern nach angezeigt
            categoryContainer.insertAdjacentHTML("beforeend", buttonHtml);
        }
}
    // Artikel werden angezeigt (die man auswählen kann)
    renderArticles(articles) {
        let articleContainer = document.querySelector("#articles-container");
        let status = document.querySelector("#list-detail").getAttribute("status");
        // um Modal öffnen zu können
        let modelAction = 'data-bs-toggle="modal" data-bs-target="#add-article-to-list-modal"'
        // wenn Liste geschlossen, dann kann man Modal nicht mehr öffnen
        if(status === "false"){
            modelAction = ""
        }
        articleContainer.innerHTML = "";
        for(let article of articles){
            let articleHtml = `
            <div class="col-auto">
                <div class="card article-card container" article-id="${article.id}" ${modelAction}>
                    <div class="card-img-top article-image d-flex justify-content-center">${article.image}</div>
                        <div class="card-body article-body">
                            <h5 class="card-title article-name">${article.name}</h5>
                            <p class="card-text article-description">${article.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            `
            // html wird als child von "ich brauche" angezeigt
            articleContainer.insertAdjacentHTML("beforeend", articleHtml);
        }
    }

    // Modal zu einem Artikel wird angezeigt
    renderArticleModal(article){
        let articleModal = document.querySelector(".modal-body");
        let articleModalHtml = `
        <h3>${article.name}</h3>
        <p>${article.description}</p>
        <hr>
        <div class="d-flex gap-5">
            <h4 class="unit-label">Einheit:</h4>
                <select id="unit-select" class="form-select" aria-label="Default select example">
                      <option selected disabled>Bitte auswählen</option>
                      <option>Stk.</option>
                      <option>Pkg.</option>
                      <option>Dose(n)</option>
                       <option>Liter</option>
                      <option>Milliliter</option>
                      <option>kg</option>
                       <option>dag</option>
                      <option>g</option>
                      <option>Meter</option>
                       <option>Zentimeter</option>
                      <option>Kiste(n)</option>
                      <option>Flasche(n)</option>   
                </select>
        </div>
        <div class="d-flex gap-5 amount-input">
            <h4 class="amount-label">Menge:</h4>
            <input type="number" id="amount-input" class="form-control" placeholder="Bitte Menge eingeben ..." min="0"/>
        </div>
        
        `
        // html wird im Modal angezeigt
        articleModal.innerHTML = articleModalHtml;
    }

}