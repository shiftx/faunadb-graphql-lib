import { GraphQLObjectType, GraphQLList, GraphQLInt } from "graphql"
import { GraphQLFaunaCursorType } from "./GraphQLFaunaCursorType"

export class GraphQLFaunaPageType extends GraphQLObjectType {
    constructor({ name, itemType, fields = {}, ...rest }) {
        super({
            name,
            ...rest,
            fields: () => ({
                next: {
                    type: GraphQLFaunaCursorType,
                    fql: q => q.Select(["after"], q.Var("_item_"), null),
                },
                previous: {
                    type: GraphQLFaunaCursorType,
                    fql: q => q.Select(["before"], q.Var("_item_"), null),
                },
                items: {
                    type: new GraphQLList(itemType()),
                    args: {
                        size: { type: GraphQLInt, defaultValue: 64 },
                    },
                    fql: q => q.Select(["data"], q.Var("_item_")),
                },
                ...fields,
            }),
        })
    }
}
