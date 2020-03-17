import { GraphQLFaunaCollectionType } from "../../src/types/GraphQLFaunaCollectionType"
import { GraphQLString } from "graphql"
import { AttachmentType } from "./AttachmentType"
import { AttachmentIdType } from "./AttachmentIdType"
import { GraphQLFaunaTimestampType } from "../../src/types/GraphQLFaunaTimestampType"

export const FileType = new GraphQLFaunaCollectionType({
    name: "FileType",
    interfaces: [AttachmentType],
    collectionName: "Attachments",
    fqlTypeCheck: (q, source) =>
        q.Equals("file", q.Select(["data", "kind"], source)),
    isTypeOf: source => source.kind === "file",
    fields: () => ({
        id: { type: AttachmentIdType },
        ts: { type: GraphQLFaunaTimestampType },
        kind: { type: GraphQLString },
        file: { type: GraphQLString },
    }),
})
