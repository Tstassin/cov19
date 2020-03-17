import React from "react"
import { Link, graphql } from "gatsby"
import { Line, Scatter } from "react-chartjs-2"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import "./mystyles.scss"

const IndexPage = ({ data }) => {

  const defaultOptions = {
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          parser: 'DD/MM/YYYY',
          unit: 'day'
        }
      }]
    }
  }

  let acc

  let hospitalized = {
    label: 'Hospitalized',
    data: data.allCovid19Data.edges.map(dataPoint => ({ t: dataPoint.node.date, y: dataPoint.node.hospitalized })),
    borderColor: 'green',
    showLine: true
  }
  acc = 0
  let sumHospitalized = {
    label: 'TOTAL Hospitalized',
    data: data.allCovid19Data.edges.map(dataPoint => ({ t: dataPoint.node.date, y: parseInt(dataPoint.node.hospitalized) ? acc += parseInt(dataPoint.node.hospitalized) : acc })),
    borderColor: 'green',
    showLine: true
  }
  console.log(sumHospitalized)
  let icu = {
    label: 'ICU',
    data: data.allCovid19Data.edges.map(dataPoint => ({ t: dataPoint.node.date, y: dataPoint.node.icu })),
    borderColor: 'orange',
    showLine: true
  }
  acc = 0
  let sumIcu = {
    label: 'TOTAL ICU',
    data: data.allCovid19Data.edges.map(dataPoint => ({ t: dataPoint.node.date, y: parseInt(dataPoint.node.icu) ? acc += parseInt(dataPoint.node.icu) : acc })),
    borderColor: 'orange',
    showLine: true
  }
  let deceased = {
    label: 'Deceased',
    data: data.allCovid19Data.edges.map(dataPoint => ({ t: dataPoint.node.date, y: dataPoint.node.deceased })),
    borderColor: 'red',
    showLine: true
  }
  acc = 0
  let sumDeceased = {
    label: 'TOTAL Deceased',
    data: data.allCovid19Data.edges.map(dataPoint => ({ t: dataPoint.node.date, y: parseInt(dataPoint.node.deceased) ? acc += parseInt(dataPoint.node.deceased) : acc })),
    borderColor: 'red',
    showLine: true
  }
  return (
    <Layout>
      <SEO title="Home" />
      <div className="section">
        <h2 className="title is-2">New cases per day</h2>
        <Scatter data={{ datasets: [hospitalized, icu, deceased,] }} options={defaultOptions} redraw={true}></Scatter>
        </div>
      <div className="section">
        <h2 className="title is-2">Total cases</h2>
        <Scatter data={{ datasets: [sumHospitalized, sumIcu, sumDeceased,] }} options={defaultOptions} redraw={true}></Scatter>
      </div>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
query MyQuery {
  allCovid19Data {
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