# faunadb-graphql-lib

A collection of types and utilites to for building GraphQL endpoints
backed by FaunaDB.


### Helpers

#### generateFaunaQuery
Given a GraphQLResolveInfo and a Fauna query that produces a result matching the output type of a GraphQL query or muation, this will generate a single FQL query that fetches fields and related data requested in the GraphQL query.

```JavaScript

import { generateFaunaQuery } from "faunadb-graphql-lib"

{
    readPost: {
        type: PostType,
        args: {
            id: { type: PostIdType },
        },
        resolve: (_, { id }, context, info) => {
            const query = generateFaunaQuery(info, q.Get(id))
            return createClient()
                .query(query)
                .catch(err => {
                    console.log(err)
                    throw err
                })
        },
    }
}
    
```

### GraphQL Types

#### GraphQLFaunaCollectionType

#### `GraphQLFaunaCollectionType`

```JavaScript
new GraphQLFaunaCollectionType({
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
```