import { Product } from "./priceList.model";
import { TableContinuationToken } from "./priceListPageRequest.model";

export interface PriceListResponse {
    products: Product[];
    continuationToken: TableContinuationToken


}