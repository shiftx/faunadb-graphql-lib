import { GraphQLObjectType, GraphQLList } from "graphql"
import { GraphQLFaunaCursorType } from "../scalars/GraphQLFaunaCursorType"

export class GraphQLFaunaPageType extends GraphQLObjectType {
    constructor({ name, itemType, fields = [], ...rest }) {
        super({
            name,
            ...rest,
            fields: () => ({
                next: {
                    type: GraphQLFaunaCursorType,
                    resolve: source => source.after,
                },
                previous: {
                    type: GraphQLFaunaCursorType,
                    resolve: source => source.before,
                },
                page: {
                    type: new GraphQLList(itemType),
                    resolve: source => source.data,
                },
                ...itemType,
            }),
        })
    }
}
