export interface PriceListPageRequest {
    pageSize?: number;
    pageNumber?: number;
    tableContinuationToken?: TableContinuationToken
}

export interface TableContinuationToken {
    nextPartitionKey?: string;
    nextRowKey?: string;
    nextTableName?: string;
    targetLocation?: number
}