import { GraphQLInt } from "graphql"

export const faunaPageArgs = () => ({
    size: { type: GraphQLInt, defaultValue: 64 },
})
