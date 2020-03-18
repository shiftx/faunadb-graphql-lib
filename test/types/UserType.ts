import { GraphQLFaunaCollectionType } from "../../src/types/GraphQLFaunaCollectionType"
import { UserIdType } from "./UserIdType"
import { GraphQLString } from "graphql"
import { PostPageType } from "./PostPageType"

export const UserType = new GraphQLFaunaCollectionType({
    name: "UserType",
    collectionName: "Users",
    fields: () => ({
        id: { type: UserIdType },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        posts: {
            type: PostPageType,
            fql: q =>
                q.GetAll(
                    q.Paginate(
                        q.Match(
                            q.Index("Posts_by_authorRef"),
                            q.SelectRef(q.Var("_item_"))
                        )
                    )
                ),
        },
    }),
})
