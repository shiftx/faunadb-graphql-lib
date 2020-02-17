import { GraphQLScalarType } from "graphql"
import { query as q } from "faunadb"

export const GraphQLFaunaTimeType = new GraphQLScalarType({
    name: "GraphQLFaunaTimeType",
    serialize(val) {
        if (val) return val.value
    },
    parseValue(val) {
        if (val === "") return null
        if (val) return q.Time(val)
    },
})
