import * as saveAs from "file-saver";
import { Product } from "../models/priceList.model";

export function saveDataArrayToFile(products: Product[]): void {
    const header = Object.keys(products[0]);
    let csv = products.map((row: any) => header.map(fieldName => JSON.stringify(row[fieldName])).join('\t'));
    csv.unshift(header.join('\t'));
    let csvArray = csv.join('\r\n');

    var blob = new Blob([csvArray], {type: 'text/csv' })
    const fileName = `productsPriceList_${products.length}_${Date.now().toString()}.csv`
    saveAs(blob, fileName);
  }