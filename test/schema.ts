import { GraphQLSchema, GraphQLObjectType } from "graphql"
import { query as q } from "faunadb"
import { createClient } from "./utils"
import { astToFaunaQuery } from "../src/utilities/astToFaunaQuery"
import { PostType } from "./types/PostType"
import { PostIdType } from "./types/PostIdType"
import { FileType } from "./types/FileType"
import { NoteType } from "./types/NoteType"
import { PostPageType } from "./types/PostPageType"
import { faunaPageArgs } from "../src/utilities/faunaPageArgs"

export const schema = new GraphQLSchema({
    types: [FileType, NoteType],
    query: new GraphQLObjectType({
        name: "Query",
        fields: () => ({
            // readUser: {
            //     type: User,
            //     args: {
            //         id: { type: GraphQLID },
            //     },
            //     resolve: async (_, args, context, ast) => {
            //         const res = buildFaunaQuery(ast)
            //         console.log(res)
            //         // console.log(ast)
            //         return { id: "1", posts: [{ id: "2", title: "Foo" }] }
            //     },
            // },
            readPost: {
                type: PostType,
                args: {
                    id: { type: PostIdType },
                },
                resolve: async (_, { id }, context, info) => {
                    const query = astToFaunaQuery(info, q.Get(id))
                    // const query = q.Get(id)
                    const res = await createClient()
                        .query(query)
                        .catch(err => {
                            console.log(err)
                            throw err
                        })
                    return res
                },
            },
            pagePosts: {
                type: PostPageType,
                args: faunaPageArgs(),
                resolve: async (first, { size }, context, info) => {
                    // console.log("before")
                    const query = astToFaunaQuery(
                        info,
                        q.Map(
                            q.Paginate(q.Documents(q.Collection("Posts")), {
                                size,
                            }),
                            q.Lambda("ref", q.Get(q.Var("ref")))
                        )
                    )
                    const res = await createClient()
                        .query(query)
                        .catch(err => {
                            console.log(err)
                            throw err
                        })
                    return res
                },
            },
        }),
    }),
})
