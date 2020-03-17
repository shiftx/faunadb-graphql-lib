import { buildFaunaQuery } from "../utils/buildFaunaQuery"

export const faunaReadQuery = ({ type, clientFn }) => {
    console.log(type)
    return {
        type,
        args: {
            id: { type: PostIdType },
        },
        resolve: async (_, { id }, context, ast) => {
            // console.log(ast)
            const query = buildFaunaQuery(ast, q.Get(id))
            const res = await clientFn(context)
                .query(query)
                .catch(err => {
                    console.log(err)
                    throw err
                })
            console.log(res)
            // const res = await createClient().query(
            //     q.Let(
            //         {
            //             res: q.Get(id),
            //         },
            //         q.Var("res")
            //     )
            // )
            return res
        },
    }
}
