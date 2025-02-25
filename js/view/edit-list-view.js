export class EditListView {
    // zeigt Liste bearbeiten Seite an
    init(listId) {
        let editListHtml = `
        <h1>Liste bearbeiten</h1>
        <h4 class="edit-list-subheader">Aktionen zu dieser Liste: </h4>
         <div class="form-check">
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="rename-list">
                  <label class="form-check-label action-label" for="rename-list">
                    Liste umbenennen 
                  </label>
         </div>
         
         <div class="form-group hidden" id="list-name-container">
                     <label for="list-newname" class="action-label">umbennenen in:</label>
                     <input type="text" class="form-control" id="list-newname">
         </div>
         
          <div class="form-check">
                  <input class="form-check-input" type="radio" name="flexRadioDefault" id="change-people-list">
                  <label class="form-check-label action-label" for="change-people-list">
                    Personenanzahl ändern
                  </label>
         </div>
         
         <div class="form-group hidden" id="people-number-container">
                     <label for="list-newpeople" class="action-label">ändern in:</label>
                     <input type="number" class="form-control" id="list-newpeople">
         </div>
          <div class="d-flex justify-content-between action-btns" list-id="${listId}">
                <button type="button" class="btn btn-primary" id="back-btn">< Zurück</button>
                <button type="submit" class="btn btn-primary" id="edit-list">Änderung übernehmen ></button>
            </div>
        `
        // html wird als child vom container angezeigt
        document.querySelector(".container").innerHTML = editListHtml;
    }

    // zeige Security Check Seite für Liste erledigt setzen an
    showSecurityCheck(name) {
        let listId = document.querySelector("#list-detail").getAttribute("list-id");
        let securityCheckHtml = `
            <h1>Liste als erledigt kennzeichnen</h1>
            <h4>Bist du sicher, dass du die Liste "${name}" als erledigt kennzeichnen möchtest? </h4>
            <div class="d-flex justify-content-between action-btns" list-id="${listId}" type="Liste">
                <button type="button" class="btn btn-primary" id="back-btn">< Nein, ich möchte diese Liste nicht als erledigt kennzeichnen</button>
                <button type="submit" class="btn btn-primary" id="yes-btn" name="${name}" >Ja, ich möchte diese Liste als erledigt kennzeichnen ></button>
            </div>
        `
        // html wird als child vom container angezeigt
        document.querySelector(".container").innerHTML = securityCheckHtml;
    }

    // zeige Security Check für Liste löschen an
    showSecurityCheckDeleteList(name) {
        let listId = document.querySelector("#list-detail").getAttribute("list-id");
        let securityCheckHtml = `
            <h1>Liste löschen</h1>
            <h4>Bist du sicher, dass du die Liste "${name}" löschen möchtest? </h4>
            <p>Das Löschen einer Liste ist nur dem/der Ersteller:in möglich.</p>
            <div class="d-flex justify-content-between action-btns" list-id="${listId}" type="ListeLöschen">
                <button type="button" class="btn btn-primary" id="back-btn">< Nein, ich möchte diese Liste nicht löschen</button>
                <button type="submit" class="btn btn-primary" id="yes-btn" name="${name}" >Ja, ich möchte diese Liste löschen ></button>
            </div>
        `
        // html wird als child vom container angezeigt
        document.querySelector(".container").innerHTML = securityCheckHtml;
    }


}