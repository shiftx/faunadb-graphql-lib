import { GraphQLFaunaCollectionType } from "../../src/types/GraphQLFaunaCollectionType"
import { PostIdType } from "./PostIdType"
import { GraphQLString, GraphQLList } from "graphql"
import { UserType } from "./UserType"
import { AttachmentType } from "./AttachmentType"
import { AttachmentPageType } from "./AttachmentPageType"

export const PostType = new GraphQLFaunaCollectionType({
    name: "Post",
    collectionName: "Posts",
    fields: () => ({
        id: { type: PostIdType },
        title: { type: GraphQLString },
        author: {
            type: UserType,
        },
        attachments: {
            type: AttachmentPageType,
            fql: q =>
                // Just return index?
                q.GetAll(
                    q.Paginate(
                        q.Match(
                            q.Index("Attachments_by_postRef"),
                            q.SelectRef(q.Var("_item_"))
                        )
                    )
                ),
        },
    }),
})
