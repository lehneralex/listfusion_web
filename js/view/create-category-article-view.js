export class CreateCategoryArticleView {
    // zeigt Artikel/Kategorie erstellen Seite an
    init(params) {
        let newFormHtml = "";
        let headertext = "";
        if(params.type === "Artikel"){
            newFormHtml = this.#createNewArticleForm(params.data);
            headertext = "Neuen Artikel anlegen"
        } else if (params.type === "Kategorie") {
            newFormHtml = this.#createNewCategorieForm(params.data);
            headertext = "Neue Kategorie anlegen"
        }

        let newItemHtml = `
            <h1>${headertext}</h1>
            <form id="create-new-article-category" list-id="${params.listId}" type="${params.type}">
            ${newFormHtml}
            <div class="d-flex justify-content-between action-btns">
                <button type="button" class="btn btn-primary" id="back-btn">&lt; Zurück</button>
                <button type="submit" class="btn btn-primary create-category-article">${params.type} erstellen &gt;</button>
            </div>
            </form>
        `
        // html wird als child vom container angezeigt
        document.querySelector(".container").innerHTML = newItemHtml;
    }

    // neuen Artikel erstellen Formular wird erstellt
    #createNewArticleForm(categories) {
        let categoryHtml ="";
        for(let category of categories){
            categoryHtml += `
            <div class="form-check">
                  <input class="form-check-input action-label" type="checkbox" value="${category.name}" id="category-checkbox">
                  <label class="form-check-label" for="flexCheckDefault">
                    ${category.name}
                  </label>
            </div>            
            `
        }
        let newFormHtml = `
        <div class="form-group">
             <label for="articleName" class="action-label bold-text">Name des Artikels:</label>
             <input type="text" class="form-control" id="articleName">
        </div>
         <div class="form-group">
            <label for="icon-select" class="action-label bold-text">Symbol auswählen:</label>
            <select id="icon-select" class="form-select" aria-label="Default select example">
                      <option selected disabled>Bitte auswählen</option>
                      <option>&#127815</option>
                      <option>&#127817</option>
                      <option>&#127819</option>
                       <option>&#129389</option>
                      <option>&#127826</option>
                      <option>&#129364</option>
                       <option>&#127805</option>
                      <option>&#127812</option>
                      <option>&#129360</option>
                       <option>&#129391</option>
                      <option>&#129385</option>
                      <option>&#129474</option>   
                </select>
           </div>
           <div class="form-group">
             <label for="article-description" class="action-label bold-text">Beschreibung (optional):</label>
             <textarea class="form-control" id="article-description"></textarea>
        </div>
         <div class="form-group">
             <label for="category-to-articles" class="action-label bold-text">Artikel zu Kategorie(n) hinzufügen (optional):</label>
             <div id="category-to-articles" class="row row-cols-3 container">
              ${categoryHtml}
            </div>
        </div>
        `
        return newFormHtml;
    }

    // neue Kategorie erstellen Formular wird erstellt
    #createNewCategorieForm(articles){
        let articleHtml ="";
        for(let article of articles){
            articleHtml += `
            <div class="form-check">
                  <input class="form-check-input" type="checkbox" value="${article.id}" id="article-checkbox">
                  <label class="form-check-label action-label" for="article-checkbox" >
                    ${article.name}
                  </label>
            </div>            
            `
        }
        let newFormHtml = `
        <div class="form-group">
             <label for="categoryName" class="action-label bold-text">Name der Kategorie:</label>
             <input type="text" class="form-control" id="categoryName">
        </div>
        <div class="form-group">
             <label for="articles-to-category" class="action-label bold-text">Folgende Artikel hinzufügen (optional):</label>
             <div id="articles-to-category" class="row row-cols-3 container">
              ${articleHtml}
            </div>
        </div>
        `
        return newFormHtml;
    }

    // confirmation Page für erstellen von Kategorie/Artikel wird erstellt
    renderConfirmationPage(type){
        let listId = document.querySelector("#create-new-article-category").getAttribute("list-id");
        let headertext = "";
        if (type === "Artikel") {
            headertext = "Artikel erfolgreich angelegt!"
        } else if (type === "Kategorie") {
            headertext = "Kategorie erfolgreich angelegt!"
        }
        let confirmationPageHtml = `
        <h1>${headertext}</h1>
        <button class="btn btn-secondary list-details-actions" id="back-to-list" list-id="${listId}">< zurück zur Liste</button>
        `;

        // html wird als child vom container angezeigt
        document.querySelector(".container").innerHTML = confirmationPageHtml;


    }
}