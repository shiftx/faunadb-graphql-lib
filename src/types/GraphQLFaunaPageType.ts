import { GraphQLList } from "graphql"
import { GraphQLFaunaCursorType } from "./GraphQLFaunaCursorType"
import { GraphQLFaunaObjectType } from "./GraphQLFaunaObjectType"

export class GraphQLFaunaPageType extends GraphQLFaunaObjectType {
    constructor({ name, itemType, fields = {}, ...rest }) {
        super({
            name,
            ...rest,
            fields: () => ({
                next: {
                    type: GraphQLFaunaCursorType,
                    fqlQuery: (doc, q) => q.Select(["after"], doc, null),
                },
                previous: {
                    type: GraphQLFaunaCursorType,
                    fqlQuery: (doc, q) => q.Select(["before"], doc, null),
                },
                page: {
                    type: new GraphQLList(itemType()),
                    fqlQuery: (doc, q) => q.Select(["data"], doc),
                    // resolve: source => console.log(source.page),
                },
                ...fields,
            }),
        })
    }
}
