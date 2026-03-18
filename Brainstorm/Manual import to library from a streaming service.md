# Manual import to library from a streaming service

Once a user has successfully integrated a service with Northstar, they can begin importing various supported data types, including artists, albums, songs, and playlists. Northstar fetches all data owned by the account registered with the streaming service and provides an option to opt certain data source subtrees out of import.

## **User Flows**

There are several flows that cover different scenarios in which state data is in in which end of the import transaction.

### Empty library + Empty service library

Display a message informing a user to first save something in the service that can be transferred over.

### Empty library + First import

> Replicate the metadata structure and relationships exactly as they exist in the streaming service to provide the user with a starting point.
> 

### Library contains data + First import

> Append the new data while correctly establishing relationships between entities. In either case, users can manually modify, add, or delete entities and their relations afterward.
> 
1. Selected “Artists” as the import anchor
2. Selected “Albums” as the import anchor
3. Selected “Tracks” as the import anchor
4. Selected “Playlists” as the import anchor

### Library contains data + Next import

> 
> 
1. Selected “Artists” as the import anchor
2. Selected “Albums” as the import anchor
3. Selected “Tracks” as the import anchor
4. Selected “Playlists” as the import anchor