// einzelne Liste
export class List {
    id;
    name;
    people;
    articlesToBuy;
    purchasedArticles;
    open;
    listOwner;
    sharedUsers;

    constructor(id, name, articlesToBuy = [], purchasedArticles = [], people = "-", open = true, listOwner = null, sharedUsers = null) {
        this.id = id;
        this.name = name;
        this.articlesToBuy = articlesToBuy;
        this.purchasedArticles = purchasedArticles;
        this.open = open;
        this.people = people;
        this.listOwner = listOwner;
        this.sharedUsers = sharedUsers;
    }

    // Abhaken von Artikeln
    purchaseArticle(articleId) {
        let article = this.articlesToBuy[articleId];
        // entfernt Artikel von "Benötigte Artikel" Liste
        this.articlesToBuy.splice(articleId, 1);
        // fügt Artikel zu "Bereits besorgt" Liste hinzu
        this.purchasedArticles.push(article);
    }

    // wenn Artikel "bereits besorgt" wurde und man ihn wieder aktivieren will
    unTick(articleId){
        let article = this.purchasedArticles[articleId];
        // entfernt 1 Artikel mit jeweiliger Id von purchasedArticles
        this.purchasedArticles.splice(articleId, 1);
        // füge diesen Artikel wieder zu "benötigte Artikel" hinzu
        this.articlesToBuy.push(article);
    }
}