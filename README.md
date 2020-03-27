# faunadb-graphql-lib

A collection of types and utilites to for building GraphQL endpoints
backed by FaunaDB.


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