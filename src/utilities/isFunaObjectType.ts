import { GraphQLFaunaObjectType } from "../types/GraphQLFaunaObjectType"
import { GraphQLFaunaInterfaceType } from "../types/GraphQLFaunaInterfaceType"

export const isFaunaObjectType = object =>
    object instanceof GraphQLFaunaObjectType ||
    object instanceof GraphQLFaunaInterfaceType
