import { GraphQLFaunaIdType } from "../../src/types/GraphQLFaunaIdType"

export const UserIdType = new GraphQLFaunaIdType({
    name: "UserIdType",
    collection: "Users",
})
