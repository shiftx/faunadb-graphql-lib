import {
    TypeInfo,
    visit,
    visitWithTypeInfo,
    isLeafType,
    GraphQLList,
    GraphQLResolveInfo,
} from "graphql"
import { Expr } from "faunadb"
import { query as q } from "faunadb-fql-lib"
import { isFaunaObjectType } from "./isFunaObjectType"

// For some reason using '_' as var does not play well. Is there some internal Fauna issue with that? Or is it reserved in Lambda as "not in use"?
const CURRENT_DOC = "__CD__"
const CURRENT_DOC_VAR = q.Var(CURRENT_DOC)

const nestedQuery = (query, field, fieldObj, isList) => {
    if (isList) return q.Map(query, q.Lambda(CURRENT_DOC, fieldObj))
    return q.Let(
        {
            [CURRENT_DOC]: query,
        },
        fieldObj
    )
}

const defaultEmbedQuery = (fieldName, isList) => {
    return q.Let(
        {
            ref: q.Select(["data", `${fieldName}Ref`], CURRENT_DOC_VAR, null),
        },
        q.If(q.IsNull(q.Var("ref")), null, q.Get(q.Var("ref")))
    )
}

const generateSelector = (name, parentType, leaf = true) => {
    if (parentType.fql?.fields?.[name]) return [name, parentType.fql?.fields?.[name](CURRENT_DOC_VAR, q)]
    if (leaf) {
        if (name === "id" || name === "ref")
            return [name, q.Select(["ref"], CURRENT_DOC_VAR, null)]
        if (name === "ts")
            return [name, q.Select(["ts"], CURRENT_DOC_VAR, null)]
    }
    return [name, q.Select(["data", name], CURRENT_DOC_VAR, null)]
}

const generateParseFn = (typeInfo, fieldName) => node => {
    const name = node.name.value
    const type = typeInfo.getType()
    const parentType = typeInfo.getParentType()
    const field = typeInfo.getFieldDef()
    // if (field.name === 'posts') {
    //     console.log(field)
    //     console.log(type)
    //     console.log(parentType.fql)
    //     // console.log
    // }
    if (!type && !field) {
        throw new Error(`No field ${name}`)
    }
    const isList = type instanceof GraphQLList
    // @ts-ignore
    const typeInList = isList ? type.ofType : null
    const isLeaf = isLeafType(type) || isLeafType(typeInList)
    const isRoot = name === fieldName
    const returnName = isRoot ? "rootFQL" : name

    return {
        name,
        type,
        parentType,
        field,
        isList,
        typeInList,
        isLeaf,
        isRoot,
        returnName,
        selectionSet: node.selectionSet,
        isFaunaObjectType: isFaunaObjectType(typeInList || type),
    }
}

export const generateFaunaQuery = (resolveInfo: GraphQLResolveInfo, query) => {
    const { operation, schema, fieldName } = resolveInfo
    const typeInfo = new TypeInfo(schema)

    const parseFieldNode = generateParseFn(typeInfo, fieldName)

    const visitor = {
        enter: {
            Field: node => {
                if (!typeInfo.getFieldDef())
                    throw new Error(`No field ${node.name.value} defined`)
            },
        },
        leave: {
            // OperationDefinition:
            // Argument:
            // Name
            SelectionSet: ({ selections, ...rest }) => {
                const fragments = selections.filter(i => i instanceof Expr)
                const maps = selections.filter(i => i instanceof Array)

                const result = maps.reduce(
                    (acc, [key, val]) => ({ ...acc, [key]: val }),
                    {}
                )

                if (fragments.length) {
                    return q.Reduce(
                        q.Lambda(
                            ["acc", "val"],
                            q.Merge(q.Var("acc"), q.Var("val"))
                        ),
                        result,
                        fragments
                    )
                }
                return result
            },
            InlineFragment: node => {
                const type = typeInfo.getType()
                return q.If(
                    // @ts-ignore
                    type.fqlTypeCheck(CURRENT_DOC_VAR, q),
                    node.selectionSet,
                    {}
                )
            },
            Field: (node, ...rest) => {
                const {
                    name,
                    field,
                    type,
                    parentType,
                    isList,
                    isLeaf,
                    isRoot,
                    isFaunaObjectType,
                    returnName,
                    selectionSet,
                } = parseFieldNode(node)
                if (isRoot && !isFaunaObjectType)
                    throw new Error("Invalid root type. Must be a FaunaGraphQL type")
                if (isLeaf)
                    return generateSelector(returnName, parentType)
                if (!isFaunaObjectType) {
                    if (selectionSet) {
                        return generateSelector(returnName, parentType)
                    } else {
                        throw new Error("How is it possibele to get here?");
                    }
                    // return generateSelector(returnName, parentType, false)
                }

                let nextQuery
                if (isRoot) nextQuery = query
                // console.log('field', name)
                // console.log('type', type)
                // console.log('rest', rest)
                // console.log('field', field, type?.fql?.fields?.[name])
                // if (field.fqlQuery)
                //     nextQuery = field.fqlQuery(CURRENT_DOC_VAR, q)
                if (parentType.fql?.fields?.[name]) {
                    nextQuery = parentType.fql?.fields?.[name](CURRENT_DOC_VAR, q)
                }
                if (!nextQuery) nextQuery = defaultEmbedQuery(name, isList)
                return [
                    returnName,
                    nestedQuery(nextQuery, field, selectionSet, isList),
                ]
            },
        },
    }

    try {
        const res = visit(operation, visitWithTypeInfo(typeInfo, visitor))
        return res.selectionSet.rootFQL
    } catch (err) {
        console.error(err)
        throw err
    }
}
