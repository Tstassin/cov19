import React from "react"
import { graphql } from "gatsby"
import { Scatter } from "react-chartjs-2"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import "./mystyles.scss"

const IndexPage = ({ data }) => {

  const success = '#48C774'
  const warning = '#FFDD57'
  const danger = '#F14668'
  const info = 'hsl(204, 86%, 53%)'

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
    {
      dataName: 'released',
      dataLabel: 'Released',
      dataColor: info
    },
  ]

  const getDataPoints = (data, dataName) => data.edges.map(dataPoint => ({ t: dataPoint.node.date, y: dataPoint.node[dataName] }))

  const statusPerDay = {
    datasets: dataSets.map(({ dataLabel, dataName, dataColor }) => ({
      label: dataLabel,
      data: getDataPoints(data.allCovid19Data, dataName),
      borderColor: dataColor,
      ...defaultDataOptions
    }))
  }

  return (
    <Layout>
      <SEO title="Home" />
      <div className="section">
        <h2 className="title is-3 is-size-4-mobile">Covid19 Status</h2>
        <p className="subtitle is-5 is-size-6-mobile">on {[...statusPerDay.datasets[0].data].pop().t}</p>
        <div class="field is-grouped is-grouped-multiline">
          <div class="control">
            <div class="tags are-medium has-addons">
              <span class="tag is-success">Hospitalized</span>
              <span class="tag">{[...statusPerDay.datasets[0].data].pop().y}</span>
            </div>
          </div>
          <div class="control">
            <div class="tags are-medium has-addons">
              <span class="tag is-warning">ICU</span>
              <span class="tag">{[...statusPerDay.datasets[1].data].pop().y}</span>
            </div>
          </div>
          <div class="control">
            <div class="tags are-medium has-addons">
              <span class="tag is-danger">Deceased</span>
              <span class="tag">{[...statusPerDay.datasets[2].data].pop().y}</span>
            </div>
          </div>
          <div class="control">
            <div class="tags are-medium has-addons">
              <span class="tag is-info">Released</span>
              <span class="tag">{[...statusPerDay.datasets[3].data].pop().y}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <h2 className="title is-3 is-size-4-mobile">Status per day</h2>
        <p className="subtitle is-5 is-size-6-mobile">up to {[...statusPerDay.datasets[0].data].pop().t}</p>
        <Scatter data={statusPerDay} options={defaultOptions} redraw={true}></Scatter>
      
      </div>
      <div className="section">
      <h3 className="title is-5">Legend</h3>
        <ul>
          <li><b>Hospitalized</b> : # people receiving medical care in a hospital on given day</li>
          <li><b>ICU</b> : # people receiving medical care in a hospital's Intensive Care Unit on given day</li>
          <li><b>Deceased</b> : # people officially deceased with Covid-19 to given day</li>
          <li><b>Released</b> : # people officially officially cured of Covid-19 after being hospitalized</li>
        </ul>
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
      released
    }
  }
}
}
`