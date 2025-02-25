export class ListsView {
    // zeigt Listeübersicht (Startseite) an
    init(lists) {
        let listsHtml = `
        <h1>Willkommen bei ListFusion - Einkaufen war noch nie so einfach!</h1>
        
        <p>Mit ListFusion behältst du deine Einkäufe immer im Blick. Erstelle individuelle Einkaufslisten für Supermarkt, Drogerie & mehr, füge Artikel hinzu und hake sie einfach ab. 
        Teile deine Listen mit anderen, um Einkäufe gemeinsam zu planen und zu verwalten. Starte jetzt und erlebe stressfreies Einkaufen!🛒✔️ </p>
       
        <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="open-lists-tab" data-bs-toggle="tab" data-bs-target="#offene-listen-tab"
                        type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">offene Listen
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="closed-lists-tab" data-bs-toggle="tab" data-bs-target="#abgeschlossene-listen-tab"
                        type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">abgeschlossene
                    Listen
                </button>
               
            </li>
    
        </ul>
        <div class="tab-content border-start border-bottom border-end" id="myTabContent">
            <div class="tab-pane fade show active" id="offene-listen-tab" role="tabpanel" aria-labelledby="home-tab"
                 tabindex="0">
                <p class="list-group-header">Eigene Listen</p>
                <div id="ownLists" class="d-flex flex-wrap gap-3 list-container">
                </div>
                <p id="sharedLists" class="list-group-header">Mit mir geteilte Listen</p>
                <p>Derzeit keine geteilten offenen Listen vorhanden.</p>
            </div>
            <div class="tab-pane fade" id="abgeschlossene-listen-tab" role="tabpanel" aria-labelledby="profile-tab"
                 tabindex="0">
                <p class="list-group-header">Eigene Listen</p>
                <div id="ownListsClosed" class="d-flex flex-wrap gap-3 list-container">
                </div>
                <p id="sharedListsClosed" class="list-group-header">Mit mir geteilte Listen</p>
                <p>Derzeit keine geteilten abgeschlossenen Listen vorhanden.</p>
            </div>
        </div>
       
       <div class="d-flex justify-content-between">
        <button class="btn btn-primary add-new-list-button">+ neue Liste erstellen</button>
        <button class="btn btn-primary add-new-list-button" disabled >Mein Profil</button>
        </div>
         
        
         
        `
        // html wird als child vom container angezeigt
        document.querySelector(".container").innerHTML = listsHtml;
        // Listen werden angezeigt
        this.showLists(lists);
    }

    // Listen werden in der Übersicht angezeigt (Listenvorschau)
    showLists(lists) {
        let openLists = document.getElementById("ownLists");
        let closedLists = document.getElementById("ownListsClosed");
        // alle Listen durchgehen
        for (let list of lists) {
            let articlesPreviewHtml = "";
            // die ersten 3 Artikel von einer Liste
            for (let i = 0; i < 3; i++) {
                // wenn Liste weniger als 3 Artikel hat, dann werden nur die Artikel bis dahin angezeigt
                if (list.articlesToBuy.length <= i) {
                    break;
                }
                let article = list.articlesToBuy[i];
                articlesPreviewHtml += `
                    <div class="d-flex justify-content-between">
                        <p class="list-details">${article.name}</p>
                        <p class="list-details">${article.amount + " " + article.unit}</p>
                    </div>
                `
            }
            // wenn keine Personenanzahl dann wird Minus angezeigt
            if(list.people === ""){
                list.people = "- ";
            }
            // eine Liste (Feld) wird erstellt
            let listhtml = `
            <div class="card list-card" list-id="${list.id}">
                <div class="card-body">
                    <div class="d-flex justify-content-between card-title">
                        <p class="list-header">${list.name}</p>
                        <p class="list-header">${list.people + " Pers."}</p>
                    </div>
                    <div id="article-preview ">
                     ${articlesPreviewHtml}
                    </div>
                </div>
            </div>
            `;
            if (list.open == true) {
                // html wird als child von "offene Listen" angezeigt
                openLists.insertAdjacentHTML("afterbegin", listhtml);
            } else {
                // html wird als child von "abgeschlossene Listen" angezeigt
                closedLists.insertAdjacentHTML("afterbegin", listhtml);
            }
        }
        // wenn keine offenen Listen vorhanden, dann Text anzeigen
        if (openLists.children.length === 0) {
            openLists.insertAdjacentHTML("afterend", "<p>Derzeit keine eigenen offenen Listen vorhanden.</p>");
        }
        // wenn keine abgeschlossenen Listen vorhanden, dann Text anzeigen
        if (closedLists.children.length === 0) {
            closedLists.insertAdjacentHTML("afterend", "<p>Derzeit keine eigenen abgeschlossenen Listen vorhanden.</p>");
        }
    }
}