import { GraphQLObjectType } from "graphql"

export class GraphQLFaunaCollectionType extends GraphQLObjectType {
    collectionName: string
    fqlTypeCheck: () => void
    constructor({
        name,
        fields,
        collectionName,
        interfaces = undefined,
        isTypeOf = undefined,
        fqlTypeCheck = undefined,
    }) {
        super({ name, fields, interfaces, isTypeOf })
        this.collectionName = collectionName
        this.fqlTypeCheck = fqlTypeCheck
    }
}
