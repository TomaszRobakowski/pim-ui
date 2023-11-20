export interface PriceListPageRequest {
    pageSize?: number;
    pageNumber?: number;
    continuationToken?: TableContinuationToken;
    search?: string;
}

export interface TableContinuationToken {
    nextPartitionKey?: string;
    nextRowKey?: string;
    nextTableName?: string;
    targetLocation?: number
}