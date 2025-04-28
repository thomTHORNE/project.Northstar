import { CmsListView } from "./cmsList";
import { CmsFilterOption, CmsSchema } from "./cmsSchema";
import { CmsTreeView } from "./cmsTree";

export interface CmsGetPageData {
    schema: CmsSchema,
    listView: CmsListView,
    treeView: CmsTreeView
}

export interface CmsGetPageDataRequest {
    pageSize: number | null,                           // listing page size (not used for TreeView)
    pageIndex: number | null,                          // current zero-based page index (not used for TreeView, mandatory for ListView)
    id: number | null,                                 // active ID (if omitted, defaults the response as a new entry
    filterOptions: Array<CmsFilterOption> | null,      // list of optional filter configurations
    // searchExpression: string | null,                // (optional) search phrase if search is enabled
}