export interface CmsApiResponse<T = null> {
    result: T;
    success: boolean;                       // TRUE - if request was successfully processed, otherwise FALSE
    redirectUrl: string;                    // if populated, treat as an immediate redirect to the page (e.g. session expiration)
    messages: Array<CmsApiResponseMessage>; // list of response messages, or empty
}

interface CmsApiResponseMessage {
    messageType: CmsApiResponseMessageType, // message type used to indicate UX behaviour
    messageText: string,                    // message text, WARNING: TBD: Might change to 'messageHtml' to enable interactive elements, images or links.
}

type CmsApiResponseMessageType = "None" | "Error" | "Warning" | "Success";