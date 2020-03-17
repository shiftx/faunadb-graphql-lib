import { GraphQLFaunaCollectionType } from "../../src/types/GraphQLFaunaCollectionType"
import { GraphQLString } from "graphql"
import { AttachmentType } from "./AttachmentType"
import { AttachmentIdType } from "./AttachmentIdType"
import { GraphQLFaunaTimestampType } from "../../src/types/GraphQLFaunaTimestampType"

export const NoteType = new GraphQLFaunaCollectionType({
    name: "NoteType",
    interfaces: [AttachmentType],
    collectionName: "Attachments",
    fqlTypeCheck: (q, source) =>
        q.Equals("note", q.Select(["data", "kind"], source)),
    isTypeOf: source => source.kind === "note",
    fields: () => ({
        id: { type: AttachmentIdType },
        ts: { type: GraphQLFaunaTimestampType },
        kind: { type: GraphQLString },
        text: { type: GraphQLString },
    }),
})
