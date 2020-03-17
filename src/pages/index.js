import React from "react"
import { Link, graphql } from "gatsby"
import { Line, Scatter } from "react-chartjs-2"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import "./mystyles.scss"

const IndexPage = ({ data }) => {

  const success = '#48C774'
  const warning = '#FFDD57'
  const danger = '#F14668'

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
      dataColor: success
    },
    {
      dataName: 'icu',
      dataLabel: 'ICU',
      dataColor: warning
    },
    {
      dataName: 'deceased',
      dataLabel: 'Deceased',
      dataColor: danger
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
    datasets: dataSets.map(({ dataLabel, dataName, dataColor }) => ({
      label: dataLabel,
      data: getDataPoints(data.allCovid19Data, dataName),
      borderColor: dataColor,
      ...defaultDataOptions
    }))
  }
  const newCasesPerDaySUM = {
    datasets: dataSets.map(({ dataLabel, dataName, dataColor }) => ({
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
        <h2 className="title is-2">Covid19 Status</h2>
        <p className="subtitle is-4">up to {[...newCasesPerDay.datasets[0].data].pop().t}</p>
        <div class="field is-grouped is-grouped-multiline">
          <div class="control">
            <div class="tags are-medium has-addons">
              <span class="tag is-success">Hospitalized</span>
              <span class="tag">
                {[...newCasesPerDaySUM.datasets[0].data].pop().y}
                <span class="tag is-size-7">&nbsp;(+{[...newCasesPerDay.datasets[0].data].pop().y})</span>
              </span>
            </div>
          </div>
          <div class="control">
            <div class="tags are-medium has-addons">
              <span class="tag is-warning">ICU</span>
              <span class="tag">
                {[...newCasesPerDaySUM.datasets[1].data].pop().y}
                <span class="tag is-size-7">&nbsp;(+{[...newCasesPerDay.datasets[1].data].pop().y})</span>
              </span>
            </div>
          </div>
          <div class="control">
            <div class="tags are-medium has-addons">
              <span class="tag is-danger">Deceased</span>
              <span class="tag">
                {[...newCasesPerDaySUM.datasets[2].data].pop().y}
                <span class="tag is-size-7">&nbsp;(+{[...newCasesPerDay.datasets[2].data].pop().y})</span>
              </span>
            </div>
          </div>
        </div>
        <div className="section">
          <h2 className="title is-2">New cases per day</h2>
          <p className="subtitle is-4">up to {[...newCasesPerDay.datasets[0].data].pop().t}</p>
          <Scatter data={newCasesPerDay} options={defaultOptions} redraw={true}></Scatter>
        </div>
        <div className="section">
          <h2 className="title is-2">Total cases</h2>
          <p className="subtitle is-4">up to {[...newCasesPerDaySUM.datasets[0].data].pop().t}</p>
          <Scatter data={newCasesPerDaySUM} options={defaultOptions} redraw={true}></Scatter>
        </div>
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