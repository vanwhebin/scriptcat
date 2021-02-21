export class Page {
    protected _page: number;
    protected _count: number;
    protected _order: string;
    protected _sort: string;

    constructor(page: number, count: number, order?: string, sort?: string) {
        this._page = page;
        this._count = count;
        this._order = order || "id";
        this._sort = sort || "desc";
    }

    public page() {
        return this._page;
    }

    public count() {
        return this._count;
    }

    public order() {
        return this._order;
    }

    public sort() {
        return this._sort;
    }
}

export function randomString(e: number) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}