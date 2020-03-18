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
                        title
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
        console.log(post)
        expect(post.id).toBe("1")
        expect(post.title).toBe("Test post 1")
        expect(post.author.id).toBe("1")
        expect(post.author.name).toBe("Foo Bar")
        expect(post.author.email).toBe("foo@bar.com")
        expect(post.author.posts.items[0].title).toBe("Test post 1")
        expect(post.attachments.items[0].kind).toBe("file")
        expect(post.attachments.items[1].kind).toBe("note")
        expect(post.attachments.items[0].file).toBe("foo.pdf")
        expect(post.attachments.items[1].text).toBe("Lorem Ipsum...")
    })
})
