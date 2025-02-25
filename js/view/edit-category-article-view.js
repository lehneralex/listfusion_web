export class EditCategoryArticleView {
    // zeigt Artikel oder Kategorie bearbeiten Seite an
    init(params){
        let actionHeader = "";
        let editCategoryArticleLabel = "";
        if (params.type === "Kategorie"){
            actionHeader = "Aktionen zu dieser Kategorie:";
            editCategoryArticleLabel = "dieser Kategorie Artikel hinzufügen/entfernen - (alle Artikel mit Häkchen sind/werden dieser Kategorie zugeordnet)";
        } else if (params.type === "Artikel"){
            actionHeader = "Aktionen zu diesem Artikel:";
            editCategoryArticleLabel = "diesem Artikel Kategorie(n) hinzufügen/entfernen - (Artikel ist/wird allen Kategorien mit Häkchen zugeordnet)";
        }
        let editCategoryArticleHtml = `
            <h1>${params.type} bearbeiten</h1>
             <label for="category-select" class="action-label">${params.type} auswählen: </label>
             <select id="category-select" class="form-select" aria-label="Default select example">
                      <option selected disabled>Bitte auswählen</option>
                      ${this.#fillSelect(params.data)}
                </select>
              <h4>${actionHeader}</h4>
              <div class="form-check">
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="rename-category-article">
                  <label class="form-check-label action-label" for="rename-category-article">
                    ${params.type} umbenennen
                  </label>
                </div>
                
                <div class="form-group hidden" id="category-article-name-container">
                     <label for="category-article-name" class="action-label">umbennenen in:</label>
                     <input type="text" class="form-control" id="category-article-name">
                </div>
                
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="assign-category-article">
                  <label class="form-check-label action-label" for="assign-category-article">
                    ${editCategoryArticleLabel}
                  </label>
                 </div>
                <div class="form-group hidden" id="edit-articles-to-category-container">
                     <div id="edit-articles-to-category" class="row row-cols-3 container">
                        ${this.#addArticlesCategoriesToArticlesCategories(params.actionData)}
                     </div>
                </div>
                 <div class="form-check">
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="delete-category-article">
                  <label class="form-check-label action-label" for="delete-category-article">
                    ${params.type} löschen
                  </label>
                </div>
                <div class="d-flex justify-content-between action-btns" list-id="${params.listId}" type="${params.type}">
                <button type="button" class="btn btn-primary" id="back-btn">< Zurück</button>
                <button type="submit" class="btn btn-primary edit-category-article">Änderung übernehmen ></button>
            </div>
        `
        // html wird als child vom container angezeigt
        document.querySelector(".container").innerHTML = editCategoryArticleHtml;
    }

    // select, dass man Kategorie oder Artikel auswählen kann, die man bearbeiten will
    #fillSelect(data){
        let options = "";
        for (let dat of data){
            options+=`
            <option>
            ${dat.name}
            </option>
            `
        }
        // zurückgeben aller Options die werden dann in init-Methode angezeigt
        return options;
    }

    // es werden Kategorien oder Artikel bei Checkboxen erstellt
    #addArticlesCategoriesToArticlesCategories(data){
        let articleHtml ="";
        for(let dat of data){
            articleHtml += `
            <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="${dat.name}" id="article-checkbox">
                  <label class="form-check-label action-label" for="article-checkbox" >
                    ${dat.name}
                  </label>
            </div>            
            `
        }
        // zurückgeben udn in init Methode anzeigen
        return articleHtml;
    }

    // es werden alle Kategorien checkboxen beim Artikel abgehakt, die bereits ausgewählt waren
    renderCategoryDetails(assignedArticles){
        let articles = document.querySelectorAll("#article-checkbox");
        for (let article of articles){
            if (assignedArticles.includes(article.value)){
                article.checked = true;
            } else {
                article.checked = false;
            }
        }
    }

    // confirmation page wird geladen
    renderEditConfirmationPage(params){
        let backBtnText = "";
        if(params.target === "Liste"){
            backBtnText = "< zurück zur Liste";
        } else if(params.target === "Home"){
            backBtnText = "< zurück zur Listenübersicht";
        }
        let listId = document.querySelector(".action-btns").getAttribute("list-id");
        let confirmationPageHtml = `
        <h1>${params.header}</h1>
        <p>${params.description}</p>
        <button class="btn btn-secondary list-details-actions" id="back-to-list" list-id="${listId}" nav-target="${params.target}">${backBtnText}</button>
        `
        // html wird als child vom container angezeigt
        document.querySelector(".container").innerHTML = confirmationPageHtml;
    }

    // Security Check wird für Kategorie erstellt
    showSecurityCheckCategory(categoryName){
        // list-id holen
        let listId = document.querySelector(".action-btns").getAttribute("list-id");
        let securityCheckHtml = `
            <h1>Kategorie löschen</h1>
            <h4>Bist du sicher, dass du die Kategorie "${categoryName}" löschen möchtest? </h4>
            <p>Das Löschen einer Kategorie ist nur möglich, wenn dieser Kategorie keine Artikel zugeordnet sind.</p>
            <div class="d-flex justify-content-between action-btns" list-id="${listId}" type="Kategorie">
                <button type="button" class="btn btn-primary" id="back-btn">< Nein, ich möchte diese Kategorie nicht löschen</button>
                <button type="submit" class="btn btn-primary" id="yes-btn" name="${categoryName}" >Ja, ich möchte diese Kategorie löschen ></button>
            </div>
        `
        // html wird als child vom container angezeigt
        document.querySelector(".container").innerHTML = securityCheckHtml;
    }

    // Security Check für Artikel wird erstellt
    showSecurityCheckArticle(articleName){
        // list-id holen
        let listId = document.querySelector(".action-btns").getAttribute("list-id");
        let securityCheckHtml = `
            <h1>Artikel löschen</h1>
            <h4>Bist du sicher, dass du den Artikel "${articleName}" löschen möchtest? </h4>
            <p>Das Löschen eines Artikels ist nur möglich, wenn dieser Artikel keiner Liste mehr zugeordnet ist.</p>
            <div class="d-flex justify-content-between action-btns" list-id="${listId}" type="Artikel">
                <button type="button" class="btn btn-primary" id="back-btn">< Nein, ich möchte diesen Artikel nicht löschen</button>
                <button type="submit" class="btn btn-primary" id="yes-btn" name="${articleName}" >Ja, ich möchte diesen Artikel löschen ></button>
            </div>
        `
        // html wird als child vom container angezeigt
        document.querySelector(".container").innerHTML = securityCheckHtml;
    }
}