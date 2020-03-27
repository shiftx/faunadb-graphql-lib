import { query as q } from "faunadb"
import { createClient } from "./utils"

const client = createClient()

const migration1 = [
    q.If(
        q.Exists(q.Collection("Posts")),
        null,
        q.CreateCollection({ name: "Posts" })
    ),
    q.If(
        q.Exists(q.Collection("Users")),
        null,
        q.CreateCollection({ name: "Users" })
    ),
    q.If(
        q.Exists(q.Collection("Attachments")),
        null,
        q.CreateCollection({ name: "Attachments" })
    ),
]

const migration2 = [
    q.If(
        q.Exists(q.Index("Posts_by_authorRef")),
        null,
        q.CreateIndex({
            name: "Posts_by_authorRef",
            source: q.Collection("Posts"),
            terms: [{ field: ["data", "authorRef"] }],
        })
    ),
    q.If(
        q.Exists(q.Index("Attachments_by_postRef")),
        null,
        q.CreateIndex({
            name: "Attachments_by_postRef",
            source: q.Collection("Attachments"),
            terms: [{ field: ["data", "postRef"] }],
        })
    ),
]

const seed = q.Do(
    q.If(
        q.Exists(q.Ref(q.Collection("Users"), "1")),
        null,
        q.Create(q.Ref(q.Collection("Users"), "1"), {
            data: {
                name: "Foo Bar",
                email: "foo@bar.com",
            },
        })
    ),
    q.If(
        q.Exists(q.Ref(q.Collection("Posts"), "1")),
        null,
        // q.Delete(q.Ref(q.Collection("Posts"), "1")),
        q.Create(q.Ref(q.Collection("Posts"), "1"), {
            data: {
                title: "Test post 1",
                tags: ["foo", "bar"],
                coordinates: { x: 1, y: 2 },
                authorRef: q.Ref(q.Collection("Users"), "1"),
            },
        })
    ),
    q.If(
        q.Exists(q.Ref(q.Collection("Posts"), "2")),
        null,
        // q.Delete(q.Ref(q.Collection("Posts"), "1")),
        q.Create(q.Ref(q.Collection("Posts"), "2"), {
            data: {
                title: "Test post 2",
                tags: ["bar"],
                coordinates: { x: 10, y: 20 },
                authorRef: q.Ref(q.Collection("Users"), "1"),
            },
        })
    ),
    q.If(
        q.Exists(q.Ref(q.Collection("Attachments"), "1")),
        null,
        q.Create(q.Ref(q.Collection("Attachments"), "1"), {
            data: {
                kind: "file",
                file: "foo.pdf",
                postRef: q.Ref(q.Collection("Posts"), "1"),
            },
        })
    ),
    q.If(
        q.Exists(q.Ref(q.Collection("Attachments"), "2")),
        null,
        q.Create(q.Ref(q.Collection("Attachments"), "2"), {
            data: {
                kind: "note",
                text: "Lorem Ipsum...",
                postRef: q.Ref(q.Collection("Posts"), "1"),
            },
        })
    )
)

const setup = async () => {
    await client.query(migration1)
    await client.query(migration2)
    await client.query(seed)
}

setup()
