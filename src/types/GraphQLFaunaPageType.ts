import { GraphQLList } from "graphql"
import { GraphQLFaunaCursorType } from "./GraphQLFaunaCursorType"
import { GraphQLFaunaObjectType } from "./GraphQLFaunaObjectType"

export class GraphQLFaunaPageType extends GraphQLFaunaObjectType {
    fql: object
    constructor({ name, itemType, fields = {}, ...rest }) {
        super({
            name,
            ...rest,
            fields: () => ({
                next: {
                    type: GraphQLFaunaCursorType,
                    // fqlQuery: 
                },
                previous: {
                    type: GraphQLFaunaCursorType,
                    // fqlQuery: (doc, q) => q.Select(["before"], doc, null),
                },
                page: {
                    type: new GraphQLList(itemType()),
                    // fqlQuery: (doc, q) => q.Select(["data"], doc),
                    // resolve: source => console.log(source.page),
                },
                ...fields,
            }),
        })
        this.fql = {
            fields: {
                next: (doc, q) => q.Select(["after"], doc, null),
                previous: (doc, q) => q.Select(["before"], doc, null),
                page: (doc, q) => q.Select(["data"], doc),
            }
        }
    }
}
