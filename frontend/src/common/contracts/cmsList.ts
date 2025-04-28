export interface CmsListView {
    columns: Array<CmsListViewColumn>;               // list of table column definitions to be used for display
    pagedData: PaginatedList<CmsListViewRow> | null; // paginated list of records (results)
}

export interface PaginatedList<T> {
    data: Array<T> | null;                           // list of objects (if any)
    pageIndex: number;                               // current zero-based page index
    pageSize: number;                                // number of elements per page
    totalCount: number;                              // total number of elements in the dataset
    pagesCount: number;                              // total number of pages in the dataset with respect to 'pageSize'
}

export interface CmsListViewColumn {
    title: string;                                   // column display title
    propertyName: string;                            // underlying property name
}

export interface CmsListViewRow {
    url: string;                                     // url for "row click" - page edit url formatted as: '/spa/edit/{tableName}/{id:int}'
    columns: Array<{
        key: string;
        value: string;
    }> | null;                                       // list of key-value pairs corresponding the 'columns' definition of the ListView
}

export interface CmsListItem {
    text: string;
    value: number;
    cssClass: string | null;
    disabled: boolean;
}
