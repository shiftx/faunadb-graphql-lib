import { GraphQLScalarType } from "graphql"
import { query as q } from "faunadb"

export const GraphQLFaunaDateType = new GraphQLScalarType({
    name: "GraphQLFaunaDateType",
    serialize(val) {
        if (val) return val.value
    },
    parseValue(val) {
        if (val === "") return null
        if (val) return q.Date(val)
    },
})
