import { GraphQLFaunaPageType } from "../../src/types/GraphQLFaunaPageType"
import { AttachmentType } from "./AttachmentType"

export const AttachmentPageType = new GraphQLFaunaPageType({
    name: "AttachmentPageType",
    itemType: () => AttachmentType,
})
