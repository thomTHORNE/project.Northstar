export interface CmsTreeView {
    items: Array<CmsTreeViewItem> // list of child elements
}

export interface CmsTreeViewItem {
    id: number;
    parentID: number;
    sortOrder: number;            // underlying 'sortOrder' (decimal) property for reference, the API should always return sorted lists
    title: string;                // element display title
    url: string | null;           // element CTA url (click to edit element)
    active: boolean;              // TRUE - if element is active (for elements that do not have activation flags, always TRUE)
    selected: boolean;            // TRUE - if element is being edited or is otherwise somehow selected
    items: Array<CmsTreeViewItem> // list of child elements
}

export enum CmsTreeViewDropPosition {
    None = "None",
    Before = "Before",
    After = "After",
    Over = "Over"
}

export interface CmsTreeViewDropRequest {
    position: CmsTreeViewDropPosition,
    sourceId: number,
    destinationId: number
}