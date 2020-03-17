import { GraphQLString, GraphQLInterfaceType } from "graphql"
import { GraphQLFaunaCollectionType } from "../../src/types/GraphQLFaunaCollectionType"
import { GraphQLFaunaTimestampType } from "../../src/types/GraphQLFaunaTimestampType"
import { AttachmentIdType } from "./AttachmentIdType"

export const AttachmentType = new GraphQLInterfaceType({
    name: "AttachmentType",
    fields: () => ({
        id: { type: AttachmentIdType },
        ts: { type: GraphQLFaunaTimestampType },
        kind: { type: GraphQLString },
    }),
})

// class GraphQLInterfaceType {
//     constructor(config: GraphQLInterfaceTypeConfig)
//   }

//   type GraphQLInterfaceTypeConfig = {
//     name: string,
//     fields: GraphQLFieldConfigMapThunk | GraphQLFieldConfigMap,
//     resolveType?: (value: any, info?: GraphQLResolveInfo) => ?GraphQLObjectType,
//     description?: ?string
//   };
