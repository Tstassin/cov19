import React from "react"
import { graphql } from "gatsby"
import { Scatter } from "react-chartjs-2"

import Layout from "../components/layout"
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
          unit: 'day',
        },
        offset: true,
      }]
    }
  }

  const defaultDataOptions = {
    showLine: true,
  }

  const dataBE = {
    name: 'allCovid19DataBe',
    dataDateName: 'date',
  }
  const dataITA = {
    name: 'allCovid19DataIta',
    dataDateName: 'data',
    dataDateParse: true,
  }

  const dataSetBE = [
    {
      dataName: 'deceased',
      dataLabel: 'Deceased',
      dataColor: danger,
      dataNode: dataBE,
    },
    {
      dataName: 'hospitalized',
      dataLabel: 'Hospitalized',
      dataColor: success,
      type: 'bar',
      dataNode: dataBE,
    },
    {
      dataName: 'icu',
      dataLabel: 'ICU',
      dataColor: warning,
      type: 'bar',
      dataNode: dataBE,
    },
    {
      dataName: 'released',
      dataLabel: 'Released',
      dataColor: info,
      type: 'bar',
      dataNode: dataBE,
    },
  ]

  const dataSetITA = [
    {
      dataName: 'deceduti',
      dataLabel: 'Deceduti',
      dataColor: danger,
      dataNode: dataITA,
    },
    {
      dataName: 'totale_ospedalizzati',
      dataLabel: 'Totale Ospedalizzati',
      dataColor: success,
      dataNode: dataITA,
      type: 'bar',
    },
    {
      dataName: 'terapia_intensiva',
      dataLabel: 'Terapia Intensiva',
      dataColor: warning,
      dataNode: dataITA,
      type: 'bar',
    },
    {
      dataName: 'dimessi_guariti',
      dataLabel: 'Dimessi Guariti',
      dataColor: info,
      dataNode: dataITA,
      type: 'bar',
    },
  ]


  const getDataPoints = (data, { name, dataDateParse, dataDateName }, dataName) => (
    data[name].edges.map(({ node }) => (
      { t: dataDateParse ? Date.parse(node[dataDateName]) : node[dataDateName], y: node[dataName] }
    ))
  )

  const getChartJSDataset = (dataSet, data) => (
    {
      datasets: dataSet.map(({ dataLabel, dataName, dataColor, type, dataNode }) => (
        {
          label: dataLabel,
          dataName: dataName,
          data: getDataPoints(data, dataNode, dataName),
          borderColor: dataColor,
          type: type && type,
          offset: true,
          backgroundColor: type && type === 'bar' && dataColor,
          ...defaultDataOptions
        }
      ))
    }
  )
  const statusPerDay = getChartJSDataset(dataSetBE, data)

  const statusPerDayITA = getChartJSDataset(dataSetITA, data)

  const datasetsIndex = {}
  statusPerDay.datasets.forEach((dataset, index) => datasetsIndex[dataset.dataName] = index)

  const getProgression = (data) => {
    const progressionRatio = (data[data.length - 1].y - data[data.length - 2].y) / data[data.length - 1].y
    const percentage = Math.round(progressionRatio * 100)
    return ((percentage > 0) && "+") + percentage + "%"
  }

  return (
    <Layout>
      <SEO title="Home" />
      <div className="section container">
        <h2 className="title is-3 is-size-4-mobile">Covid19 Status</h2>
        <p className="subtitle is-5 is-size-6-mobile">updated {[...statusPerDay.datasets[0].data].pop().t}</p>
        <div className="field is-grouped is-grouped-multiline">
          <div className="control">
            <div className="tags are-medium has-addons">
              <span className="tag is-success has-text-weight-semibold has-tooltip-multiline has-tooltip-right" data-tooltip="Number of people receiving medical care in hospitals on given day">
                Hospitalized
              </span>
              <span className="tag has-text-weight-bold">{[...statusPerDay.datasets[datasetsIndex['hospitalized']].data].pop().y}
                <span className="tags are-small is-size-7">&nbsp;{getProgression(statusPerDay.datasets[datasetsIndex['hospitalized']].data)}</span>
              </span>
            </div>
          </div>
          <div className="control">
            <div className="tags are-medium has-addons">
              <span className="tag is-warning has-text-weight-semibold has-tooltip-multiline has-tooltip-right" data-tooltip="Number of people receiving medical care in Intensive Care Units on given day">
                ICU
                </span>
              <span className="tag has-text-weight-bold">{[...statusPerDay.datasets[datasetsIndex['icu']].data].pop().y}
                <span className="tags are-small is-size-7">&nbsp;{getProgression(statusPerDay.datasets[datasetsIndex['icu']].data)}</span>
              </span>
            </div>
          </div>
          <div className="control">
            <div className="tags are-medium has-addons">
              <span className="tag is-info has-text-weight-semibold has-tooltip-multiline has-tooltip-right" data-tooltip="Number of people officially cured of Covid-19 after being hospitalized on given day">
                Released
              </span>
              <span className="tag has-text-weight-bold">{[...statusPerDay.datasets[datasetsIndex['released']].data].pop().y}
                <span className="tags are-small is-size-7">&nbsp;{getProgression(statusPerDay.datasets[datasetsIndex['released']].data)}</span>
              </span>
            </div>
          </div>
          <div className="control">
            <div className="tags are-medium has-addons">
              <span className="tag is-danger has-text-weight-semibold has-tooltip-multiline has-tooltip-right" data-tooltip="Total number of people officially deceased with Covid-19 up to given day">
                Deceased
              </span>
              <span className="tag has-text-weight-bold">{[...statusPerDay.datasets[datasetsIndex['deceased']].data].pop().y}
                <span className="tags are-small is-size-7">&nbsp;TOTAL</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="section container">
        <h2 className="title is-3 is-size-4-mobile">Status per day in Belgium</h2>
        <p className="subtitle is-5 is-size-6-mobile">up to {[...statusPerDay.datasets[0].data].pop().t}</p>
        <Scatter data={statusPerDay} options={defaultOptions} redraw={true}></Scatter>
      </div>
      <div className="section container">
        <h2 className="title is-3 is-size-4-mobile">Status per day in Italy (for reference)</h2>
        <p className="subtitle is-5 is-size-6-mobile">up to {new Date([...statusPerDayITA.datasets[0].data].pop().t).toDateString()}</p>
        <Scatter data={statusPerDayITA} options={defaultOptions} redraw={true}></Scatter>
      </div>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
query MyQuery {
          allCovid19DataBe {
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
allCovid19DataIta {
  edges {
    node {
      deceduti
      dimessi_guariti
      isolamento_domiciliare
      nuovi_attualmente_positivi
      ricoverati_con_sintomi
      tamponi
      terapia_intensiva
      totale_attualmente_positivi
      totale_casi
      totale_ospedalizzati
      data
    }
  }
}
}
`