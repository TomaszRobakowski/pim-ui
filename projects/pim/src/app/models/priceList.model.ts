export interface Product extends Variant {
    productId: string | null;
    productCardSubId: string | null;
    stockId: string | null;
    nameShort: string | null;
    nameShortLang1: string | null;
    nameShortLang2: string | null;
    nameShortLang3: string | null;
    nameShortLang4: string | null;
    nameShortLang5: string | null;
    nameFull: string | null;
    nameFullLang1: string | null;
    nameFullLang2: string | null;
    nameFullLang3: string | null;
    nameFullLang4: string | null;
    nameFullLang5: string | null;
    nameManufacturer: string | null;
    description: string | null;
    descriptionLang1: string | null;
    descriptionLang2: string | null;
    descriptionLang3: string | null;
    descriptionLang4: string | null;
    type: Type | null;
    kind: Kind | null;
    category: Category | null;
    collection: Collection | null;
    brand: Brand | null;
    weight: number | null;
    isNew: boolean | null;
    isOffer: boolean | null;
    isSale: boolean | null;
    isRecommend: boolean | null;
    vatPercent: number | null;
    clubPoints: number | null;
    imageUrl: string | null;
    parameters: Parameter[] | null;
    images: Image[] | null;
}

export interface Variant {
    id: string | null;
    x: number | null;
    y: number | null;
    nameX: string | null;
    nameY: string | null;
    colorsRgb: string | null;
    barcode: string | null;
    quantity: number | null;
    quantitySupplier: number | null;
    priceWholesaleExclVat: number | null;
    priceOriginal: number | null;
    priceResaleInclVat: number | null;
    priceResaleMinimalInclVat: number | null;
    salePercent: number | null;
}

export interface KeyValue {
    id: string | null;
    name: string | null;
}

export interface Brand extends KeyValue {}
export interface Category extends KeyValue {}
export interface Collection extends KeyValue {}
export interface Kind extends KeyValue {}
export interface Type extends KeyValue {}

export interface Image {
    id: number | null;
    url: string | null;
    extension: string | null;
    checksum: string | null;
    isProductDefault: boolean | null;
    isYDefault: boolean | null;
}

export interface Parameter {
    parameterId: number | null;
    name: string | null;
    nameLang1: string | null;
    nameLang2: string | null;
    nameLang3: string | null;
    nameLang4: string | null;
    nameLang5: string | null;
    value: string | null;
    valueLang1: string | null;
    valueLang2: string | null;
    valueLang3: string | null;
    valueLang4: string | null;
    valueLang5: string | null;
}
