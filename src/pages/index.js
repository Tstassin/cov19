import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = ({ data }) => (
  <Layout>
    {console.log(data)}
    <SEO title="Home" />
    <h1>Covid19 Status in Belgium</h1>
    
    <ul>
      {data.allData.edges.map(data => <li>{data.node.date}</li>)}
    </ul>
  </Layout>
)

export default IndexPage

export const query = graphql`
query MyQuery {
  allData {
    edges {
      node {
        cumul_cases
        cumul_tests
        daily_cases
        daily_tests
        icu
        date
        deceased
        hospitalized
      }
    }
  }
}
`