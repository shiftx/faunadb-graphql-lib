import { Client } from "faunadb"
import { parseJSON } from "faunadb/src/_json"

const opts =
    process.env.CI === "true"
        ? {
              secret: process.env.FAUNA_DB_SECRET,
          }
        // : {
        //       secret: "secret",
        //       scheme: "http",
        //       port: 8443,
        //       domain: "localhost",
        //   }
          :{
              secret: "fnADy3z-eMACBYYkkL8c11fu_UugKnqinbluMRCa"
          }
// @ts-ignore
export const createClient = () =>
    new Client({
        ...opts,
        observer: res => {
            if (res.responseContent.errors) {
                if (
                    res.responseContent.errors[0].description?.match(/^\{.+\}$/)
                ) {
                    console.log("FAUNA DEBUG START")
                    console.log(
                        parseJSON(res.responseContent.errors[0].description)
                    )
                    console.log("FAUNA DEBUG END")
                }
            }
        },
    })
