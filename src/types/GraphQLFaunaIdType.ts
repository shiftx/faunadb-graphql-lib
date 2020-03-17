import { GraphQLScalarType, locatedError } from "graphql"
import { query as q } from "faunadb"

export class GraphQLFaunaIdType extends GraphQLScalarType {
    collection: any
    constructor({ collection, ...args }) {
        super(args)
        this.collection = collection
        this.parseValue = val => {
            return q.Ref(q.Collection(collection), val)
        }
        this.serialize = val => {
            // throw locatedError(new Error(issue))
            // todo: add graphql parse error, but dont throw
            // context.reportError(
            //     new GraphQLError(
            //       `The operation \`${node.operation}\` is missing a name.`,
            //       [node]
            //     )
            //   );
            return val.id
        }
        this.parseLiteral = ast => {
            return q.Ref(q.Collection(collection), ast.value)
        }
    }
}
