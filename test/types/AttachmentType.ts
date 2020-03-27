import { GraphQLString } from "graphql"
import { GraphQLFaunaTimestampType } from "../../src/types/GraphQLFaunaTimestampType"
import { GraphQLFaunaInterfaceType } from "../../src/types/GraphQLFaunaInterfaceType"
import { AttachmentIdType } from "./AttachmentIdType"

export const AttachmentType = new GraphQLFaunaInterfaceType({
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
