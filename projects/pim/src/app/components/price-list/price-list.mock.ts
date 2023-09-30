import { Product } from "../../models/priceList.model";
import { getRandomBool, getRandomInt, getRandomName } from "./mock/mock.extentions";

export function getMockProducts(): Product[] {
    const products: Product[] = [];
    for (let i = 0; i < 1000; i++) {
        products.push(getRandomProduct());
    }
    return products
}

function getRandomProduct(): Product {
    return {
        id: getRandomName(),
        x: getRandomInt(1000),
        y: getRandomInt(1000),
        nameX: getRandomName(),
        nameY: getRandomName(),
        colorsRgb: getRandomName(),
        barcode: getRandomName(),
        quantity: getRandomInt(1000),
        quantitySupplier: getRandomInt(1000),
        priceWholesaleExclVat: getRandomInt(1000),
        priceOriginal: getRandomInt(1000),
        priceResaleInclVat: getRandomInt(1000),
        priceResaleMinimalInclVat: getRandomInt(1000),
        salePercent: getRandomInt(1000),
        productId: getRandomName(),
        productCardSubId: getRandomName(),
        stockId: getRandomName(),
        nameShort: getRandomName(),
        nameShortLang1: getRandomName(),
        nameShortLang2: getRandomName(),
        nameShortLang3: getRandomName(),
        nameShortLang4: getRandomName(),
        nameShortLang5: getRandomName(),
        nameFull: getRandomName(),
        nameFullLang1: getRandomName(),
        nameFullLang2: getRandomName(),
        nameFullLang3: getRandomName(),
        nameFullLang4: getRandomName(),
        nameFullLang5: getRandomName(),
        nameManufacturer: getRandomName(),
        description: getRandomName(),
        descriptionLang1: getRandomName(),
        descriptionLang2: getRandomName(),
        descriptionLang3: getRandomName(),
        descriptionLang4: getRandomName(),
        type: {id: getRandomName(), name: getRandomName()},
        kind: {id: getRandomName(), name: getRandomName()},
        category: {id: getRandomName(), name: getRandomName()},
        collection: {id: getRandomName(), name: getRandomName()},
        brand: {id: getRandomName(), name: getRandomName()},
        weight: getRandomInt(1000),
        isNew: getRandomBool(),
        isOffer: getRandomBool(),
        isSale: getRandomBool(),
        isRecommend: getRandomBool(),
        vatPercent: getRandomInt(1000),
        clubPoints: getRandomInt(1000),
        imageUrl: getRandomName(),
        parameters: [],
        images: []
    }
}

