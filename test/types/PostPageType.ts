import { GraphQLFaunaPageType } from "../../src/types/GraphQLFaunaPageType"
import { PostType } from "./PostType"

export const PostPageType = new GraphQLFaunaPageType({
    name: "PostPageType",
    itemType: () => PostType,
})
