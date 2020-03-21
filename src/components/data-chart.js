import React from 'react'
import { Scatter } from 'react-chartjs-2'
import * as ChartAnnotation from "chartjs-plugin-annotation"

import { merge } from "lodash"

const dateStandardOutputFormat = 'MMMM DD, YYYY'

const minimumValidDate = 'March 1, 2020'

const defaultAnnotationOptions = {
    type: 'line',
    mode: 'vertical',
    scaleID: 'x-axis-1',
    value: "March 18, 2020",
    borderColor: ' hsl(0, 0%, 31%) ',
    borderWidth: 2,
    label: {
        enabled: true,
        content: 'content',
        position: 'top',
        yAdjust: 30,
        backgroundColor: ' hsl(0, 0%, 31%) ',
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
            ticks: {
                min: minimumValidDate
            },
        }],
    },
    legend: {
        position: 'bottom'
    },
    tooltips: {
        mode: 'index',
        intersect: false,
        callbacks: {
            title: (t, o) => (t[0].xLabel) + (o.subtitle ? ("\n" + o.subtitle) : ""),
            label: (t, o) => (
                " " + o.datasets[t.datasetIndex].label + " : " +
                (Math.round(o.datasets[t.datasetIndex].data[t.index].y*100)/100 || "0") + " " +
                "(" + getProgression(o.datasets[t.datasetIndex].data.slice(0, t.index + 1)) + ")"
            ),
        }
    },
    hover: {
        mode: 'index',
        intersect: false
    },
}

const getProgression = (data) => {
    let today
    let yesterday
    if (data.length > 0) today = data[data.length - 1].y
    if (data.length > 1) yesterday = data[data.length - 2].y
    if (!today) today = 1
    if (!yesterday) yesterday = 1
    const progressionRatio = (today - yesterday) / yesterday
    const percentage = Math.round(progressionRatio * 100)
    return ((percentage > 0) && "+") + percentage + "%"
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
                                <span className="tag has-text-weight-bold">{[...dataset.data].pop().y}
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

const DataChart = ({ title, dataset, noDataCards, events, subtitle }) => {
    let annotations = {}
    if (events) {
        annotations = {annotation: { annotations:  events.map( (event, index) => merge({}, defaultAnnotationOptions, {label: {yAdjust: (defaultAnnotationOptions.label.yAdjust * index) + 10}}, event))}}
    }

    return (
        <div className="section container">
            <h2 className="title is-3 is-size-4-mobile">{title}</h2>
            <p className="subtitle is-5 is-size-6-mobile">
            Last update {[...dataset.datasets[0].data].pop().t}
            {subtitle && <span> / {subtitle} </span>}
            </p>
            {!noDataCards && <DataCards dataset={dataset.datasets}></DataCards>}
            <br />
            <Scatter data={{...dataset, subtitle}} options={{...defaultOptions, ...annotations}} plugins={[ChartAnnotation]}></Scatter>
        </div>
    )
}
export default DataChart