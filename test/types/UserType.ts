import { GraphQLFaunaCollectionType } from "../../src/types/GraphQLFaunaCollectionType"
import { UserIdType } from "./UserIdType"
import { GraphQLString, GraphQLInt } from "graphql"
import { PostPageType } from "./PostPageType"

export const UserType = new GraphQLFaunaCollectionType({
    name: "UserType",
    collectionName: "Users",
    fql: {
        fields: {
            posts: (doc, q) => {
                return q.Map(
                    q.Paginate(
                        q.Match(
                            q.Index("Posts_by_authorRef"),
                            q.Select(["ref"], doc)
                        )
                    ),
                    q.Lambda("ref", q.Get(q.Var("ref")))
                )
            }
        }
    }, 
    fields: () => ({
        id: { type: UserIdType },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        posts: {
            type: PostPageType,
            args: { size: { type: GraphQLInt } },
            // fqlQuery: (doc, q) =>
            //     q.Map(
            //         q.Paginate(
            //             q.Match(
            //                 q.Index("Posts_by_authorRef"),
            //                 q.Select(["ref"], doc)
            //             )
            //         ),
            //         q.Lambda("ref", q.Get(q.Var("ref")))
            //     ),
        },
    }),
})
