import React from 'react'
import { Scatter } from 'react-chartjs-2'
import * as ChartAnnotation from "chartjs-plugin-annotation"
import { merge } from "lodash"

import { useStore } from '../store/store'

const dateStandardOutputFormat = 'MMMM DD, YYYY'

const defaultAnnotationOptions = {
    type: 'line',
    mode: 'vertical',
    scaleID: 'x-axis-1',
    value: "March 18, 2020",
    borderColor: ' rgba(0,0,0,0.1) ',
    borderWidth: 2,
    label: {
        enabled: true,
        content: 'content',
        position: 'top',
        yAdjust: 30,
        backgroundColor: '#F5F5F5',
        fontFamily: "sans-serif",
        fontSize: 12,
        fontStyle: "normal",
        fontColor: "#000",
        borderColor: 'red',
    }
}

const yAxisScales = {
    linear: {
        type: 'linear',
        ticks: {
            autoSkip: true,
            min: 0,
        }
    },
    logarithmic: {
        type: 'logarithmic',
        ticks: {
            autoSkip: false,
            min: 1,
            callback: function (value, index, values) {
                if (value === 1000000) return "1.000.000"
                if (value === 100000) return "100.000"
                if (value === 10000) return "10.000"
                if (value === 1000) return "1.000"
                if (value === 100) return "100"
                if (value === 10) return "10"
                if (value === 1) return "1"
                if (value === 0) return "0"
                return null
            }
        }
    }
}

const defaultOptions = {
    scales: {
        xAxes: [{
            type: 'time',
            time: {
                unit: 'day',
                parser: dateStandardOutputFormat,
            },
            offset: true,
        }],
    },
    legend: {
        position: 'bottom'
    },
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            title: (t, o) => (t[0].xLabel),
            label: (t, o) => {
                return (
                " " + o.datasets[t.datasetIndex].dataNode.countryCode + "\t" +
                " " + o.datasets[t.datasetIndex].label + " : " +
                (Math.round(o.datasets[t.datasetIndex].data[t.index].y * 100) / 100 || "0") + " " +
                "(" + getProgression(o.datasets[t.datasetIndex].data.slice(0, t.index + 1)) + ")"
            )},
        }
    },
    hover: {
        mode: 'index',
        intersect: false
    },
    maintainAspectRatio: false,
    responsive: true,
}

const getProgression = (data) => {
    let today
    let yesterday
    if (data.length > 0) today = data[data.length - 1].y
    if (data.length > 1) yesterday = data[data.length - 2].y
    if (!today) today = 1
    if (yesterday === undefined) return "+100%"
    if (!yesterday) yesterday = 1
    const progressionRatio = (today - yesterday) / yesterday
    const percentage = Math.round(progressionRatio * 100)
    return ((percentage > 0) && "+") + percentage + "%"
}

const getMax = (datasets) => {
    const allData = datasets.map(dataset => dataset.data.map(dataPoint => dataPoint.y))
    const flattened = [].concat.apply([], allData)
    const max = Math.max(...flattened)
    const roundedMax = Math.pow(10, Math.round(max).toString().length)
    return roundedMax
}

const DataCards = ({ dataset }) => {
    return (
        <div className="field is-grouped is-grouped-multiline">
            {
                dataset.map((dataset) => {
                    return (
                        <div className="control" key={dataset.label}>
                            <div className="tags are-medium has-addons">
                                <span className={"tag has-text-weight-semibold has-tooltip-multiline has-tooltip-right " + dataset.dataColor.className} data-tooltip={dataset.legend}>
                                    {dataset.label}
                                </span>
                                <span className="tag has-text-weight-bold">{[...dataset.data].pop().y_original}
                                    <span className="tags are-small is-size-7">&nbsp;{getProgression(dataset.data)}</span>
                                </span>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

const getEventsList = (datasets) => {
    const dataNodes = datasets.map(dataset => dataset.dataNode)
    const dataNodesUnique = [...new Set(dataNodes)]
    const eventsList = []
    dataNodesUnique.forEach(({ events }) => events.forEach(event => eventsList.push(event)))
    return eventsList
}

const DataChart = ({ title, dataset, noDataCards, isLinear }) => {

    const store = useStore()

    const events = getEventsList(dataset.datasets)

    return (
        <div className="section container">
            <h2 className="title is-3 is-size-4-mobile">{title}</h2>
            <p className="subtitle is-5 is-size-6-mobile">
                Last update {[...dataset.datasets[0].data].pop().t}
            </p>
            {!noDataCards && <DataCards dataset={dataset.datasets}></DataCards>}
            <br />
            <div className="is-responsive-chart">
                <Scatter
                    data={dataset}
                    options={{
                        ...defaultOptions,
                        annotation: {
                            annotations: events.map(
                                (event, index) => ({
                                    ...defaultAnnotationOptions,
                                    ...event,
                                    label: {
                                        ...defaultAnnotationOptions.label,
                                        ...event.label,
                                        yAdjust: (defaultAnnotationOptions.label.yAdjust * index) + 10,
                                    },
                                })
                            )
                        },
                        tooltips: {
                            ...defaultOptions.tooltips,
                            callbacks: {
                                ...defaultOptions.tooltips.callbacks,
                                title: (isLinear && store.commonOrigin) ? (t, o) => ("Day " + (t[0].index + 1)) : defaultOptions.tooltips.callbacks.title
                            }
                        },
                        scales: {
                            ...defaultOptions.scales,
                            xAxes: [
                                {
                                    ...defaultOptions.scales.xAxes[0],
                                    ticks: {
                                        ...defaultOptions.scales.xAxes[0].time,
                                        callback: (isLinear && store.commonOrigin) ? (value, i, values) => ("Day " + (i + 1)) : undefined
                                    }
                                }
                            ],
                            yAxes: [
                                store.toggleLogarithmicScale
                                    ?
                                    {
                                        ...yAxisScales.logarithmic,
                                        ticks: {
                                            ...yAxisScales.logarithmic.ticks,
                                            max: getMax(dataset.datasets)
                                        }
                                    }
                                    :
                                    {
                                        ...yAxisScales.linear,
                                        ticks: {
                                            ...yAxisScales.linear.ticks,
                                            max: undefined,
                                        }
                                    }
                            ]
                        }
                    }}
                    plugins={[ChartAnnotation]}
                ></Scatter>
            </div>
        </div >
    )
}
export default DataChart