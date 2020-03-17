import { GraphQLFaunaIdType } from "../../src/types/GraphQLFaunaIdType"

export const PostIdType = new GraphQLFaunaIdType({
    name: "PostIdType",
    collection: "Posts",
})
