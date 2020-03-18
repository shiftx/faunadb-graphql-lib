import { graphql } from "graphql"
import { schema } from "../../test/schema"

const query = /* GraphQL */ `
    query Test {
        readPost(id: "1") {
            id
            title
            author {
                id
                name
                email
                posts {
                    next
                    previous
                    items {
                        id
                    }
                }
            }
            attachments {
                items {
                    id
                    kind
                    ... on FileType {
                        file
                    }
                    ... on NoteType {
                        text
                    }
                }
            }
        }
    }
`

describe("One", () => {
    test("two", async () => {
        const res = await graphql(schema, query, null, null)
        const { data, errors } = JSON.parse(JSON.stringify(res))
        const post = data.readPost
        // console.log(errors)
        // console.log(data.readPost)
        // console.log(data.readPost.author.posts)
        // console.log(data.readPost.attachments)
    })
})
