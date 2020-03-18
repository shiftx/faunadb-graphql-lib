import { GraphQLScalarType, locatedError } from "graphql"
import { query as q } from "faunadb"
export class GraphQLFaunaIdType extends GraphQLScalarType {
    collection: any
    constructor({ name, collection }) {
        super({
            name,
            serialize: val => val.id,
            parseValue: val => q.Ref(q.Collection(collection), val),
            parseLiteral: (ast: any) =>
                q.Ref(q.Collection(collection), ast.value),
        })
        this.collection = collection
    }
}
