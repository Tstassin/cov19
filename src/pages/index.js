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

  const defaultDataOptions = {
    showLine: true,
  }

  const dataSets = [
    {
      dataName: 'hospitalized',
      dataLabel: 'Hospitalized',
      dataColor: 'green'
    },
    {
      dataName: 'icu',
      dataLabel: 'ICU',
      dataColor: 'orange'
    },
    {
      dataName: 'deceased',
      dataLabel: 'Deceased',
      dataColor: 'red'
    },
  ]

  const getDataPoints = (data, dataName) => data.edges.map(dataPoint => ({ t: dataPoint.node.date, y: dataPoint.node[dataName] }))
  const getSummedDataPoints = (data, dataName) => {
    let acc = 0
    return data.edges.map(dataPoint => (
      {
        t: dataPoint.node.date,
        y: parseInt(dataPoint.node[dataName]) ? acc += parseInt(dataPoint.node[dataName]) : acc
      })
    )
  }

  const newCasesPerDay = {
    datasets: dataSets.map(({dataLabel, dataName, dataColor}) => ({
        label: dataLabel,
        data: getDataPoints(data.allCovid19Data, dataName),
        borderColor: dataColor,
        ...defaultDataOptions
      }))
  }
  const newCasesPerDaySUM = {
    datasets: dataSets.map(({dataLabel, dataName, dataColor}) => ({
        label: "TOTAL " + dataLabel,
        data: getSummedDataPoints(data.allCovid19Data, dataName),
        borderColor: dataColor,
        ...defaultDataOptions
      }))
  }

  return (
    <Layout>
      <SEO title="Home" />
      <div className="section">
        <h2 className="title is-2">New cases per day</h2>
        <Scatter data={newCasesPerDay} options={defaultOptions} redraw={true}></Scatter>
      </div>
      <div className="section">
        <h2 className="title is-2">Total cases</h2>
        <Scatter data={newCasesPerDaySUM} options={defaultOptions} redraw={true}></Scatter>
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