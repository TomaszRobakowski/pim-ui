import { SearchQuery } from "./search.model";

export interface PriceListPageRequest {
    pageSize?: number;
    pageNumber?: number;
    continuationToken?: TableContinuationToken;
    search?: SearchQuery; 
    ids?: (string | null)[] | null;
}

export interface TableContinuationToken {
    nextPartitionKey?: string;
    nextRowKey?: string;
    nextTableName?: string;
    targetLocation?: number
}