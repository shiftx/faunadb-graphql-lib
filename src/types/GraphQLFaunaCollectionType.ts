import { GraphQLObjectType } from "graphql"
import { GraphQLFaunaObjectType } from "./GraphQLFaunaObjectType"

// const validateInterfaces = interfaces => {
//     interfaces.forEach(interface => {})
// }
export class GraphQLFaunaCollectionType extends GraphQLFaunaObjectType {
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
        // if (interfaces?.length) validateInterfaces(interfaces)
        super({ name, fields, interfaces, isTypeOf })
        this.collectionName = collectionName
        this.fqlTypeCheck = fqlTypeCheck
    }
    static isFaunaGraphQLType: true
}
