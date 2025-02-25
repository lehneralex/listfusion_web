export class CreateListView {
    // zeigt Liste erstellen Seite an
    init(){
        let createListHtml = `
        <h1>Neue Liste erstellen</h1>
        <form id="createNewListForm">
            <div class="form-group">
                <label for="listName">Name der Liste:</label>
                <input type="text" class="form-control" id="listName" placeholder="Name der Liste eingeben">
            </div>
            <div class="form-group">
                <label for="personCount">Personenanzahl (optional):</label>
                <input type="number" class="form-control" id="personCount" placeholder="Anzahl der Personen">
            </div>
            <div class="d-flex justify-content-between">
                <button type="button" class="btn btn-primary back">&lt; Zurück</button>
                <button type="submit" class="btn btn-primary create-list">Liste erstellen &gt;</button>
            </div>
        </form>
        `
        // html wird als child vom container angezeigt
        document.querySelector(".container").innerHTML = createListHtml;
    }
}