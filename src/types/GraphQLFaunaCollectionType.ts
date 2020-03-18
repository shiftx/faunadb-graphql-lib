import { GraphQLObjectType } from "graphql"

export class GraphQLFaunaCollectionType extends GraphQLObjectType {
    collectionName: string
    fqlTypeCheck: () => void
    constructor({ name, fields, collectionName, fqlTypeCheck }) {
        super({ name, fields })
        this.collectionName = collectionName
        this.fqlTypeCheck = fqlTypeCheck
    }
}
