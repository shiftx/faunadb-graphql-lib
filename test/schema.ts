import { GraphQLSchema, GraphQLObjectType } from "graphql"
import { createClient } from "./utils"
import { query as q } from "faunadb"
import { astToFaunaQuery } from "../src/utilities/astToFaunaQuery"
import { PostType } from "./types/PostType"
import { PostIdType } from "./types/PostIdType"
import { FileType } from "./types/FileType"
import { NoteType } from "./types/NoteType"

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
                resolve: async (_, { id }, context, ast) => {
                    const query = astToFaunaQuery(ast, q.Get(id))
                    const res = await createClient()
                        .query(query)
                        .catch(err => {
                            console.log(err)
                            throw err
                        })
                    console.log(res)
                    console.log(res.attachments.items)
                    return res
                },
            },
        }),
    }),
})
