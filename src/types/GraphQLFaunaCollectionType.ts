import { GraphQLObjectType, GraphQLObjectTypeConfig } from "graphql"

export class GraphQLFaunaCollectionType extends GraphQLObjectType {
    collectionName: string
    fqlTypeCheck: any
    constructor({ collectionName, fqlTypeCheck, ...args }) {
        super(args)
        this.collectionName = collectionName
        this.fqlTypeCheck = fqlTypeCheck
    }
}
