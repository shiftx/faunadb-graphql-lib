import { GraphQLFaunaIdType } from "../../src/types/GraphQLFaunaIdType"

export const AttachmentIdType = new GraphQLFaunaIdType({
    name: "AttachmentIdType",
    collection: "Attachments",
})
