import { GraphQLFaunaCollectionType } from "../../src/types/GraphQLFaunaCollectionType"
import { PostIdType } from "./PostIdType"
import {
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLObjectType,
} from "graphql"
import { UserType } from "./UserType"
import { AttachmentPageType } from "./AttachmentPageType"
import { faunaPageArgs } from "../../src/utilities/faunaPageArgs"
import { GraphQLFaunaTimestampType } from "../../src/types/GraphQLFaunaTimestampType"

const CoordinatesType = new GraphQLObjectType({
    name: "CoordinatesType",
    fields: () => ({
        x: { type: GraphQLInt },
        y: { type: GraphQLInt },
    }),
})

export const PostType = new GraphQLFaunaCollectionType({
    name: "Post",
    collectionName: "Posts",
    fields: () => ({
        id: { type: PostIdType },
        ts: { type: GraphQLFaunaTimestampType },
        title: { type: GraphQLString },
        author: { type: UserType },
        tags: { type: new GraphQLList(GraphQLString) },
        coordinates: { type: CoordinatesType },
        attachments: {
            type: AttachmentPageType,
            args: faunaPageArgs(),
            fqlQuery: (doc, q) => {
                // console.log("here in att", doc)
                return q.Map(
                    q.Paginate(
                        q.Match(
                            q.Index("Attachments_by_postRef"),
                            q.Select(["ref"], doc)
                        )
                        // { size: 1 }
                    ),
                    q.Lambda("ref", q.Get(q.Var("ref")))
                )
            },
        },
    }),
})
