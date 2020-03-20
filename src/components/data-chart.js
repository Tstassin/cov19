import React from 'react'
import { Scatter } from 'react-chartjs-2'

const dateStandardOutputFormat = 'MMMM DD, YYYY'

const minimumValidDate = 'March 1, 2020'

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
            }
        }],
    },
    legend: {
        position: 'bottom'
    }
}

const getProgression = (data) => {
    const progressionRatio = (data[data.length - 1].y - data[data.length - 2].y) / data[data.length - 2].y
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

const DataChart = ({ title, dataset, noDataCards }) => {
    return (
        <div className="section container">
            <h2 className="title is-3 is-size-4-mobile">{title}</h2>
            <p className="subtitle is-5 is-size-6-mobile">Last update {[...dataset.datasets[0].data].pop().t}</p>
            {!noDataCards && <DataCards dataset={dataset.datasets}></DataCards>}
            <br />
            <Scatter data={dataset} options={defaultOptions} redraw={true} datasetKeyProvider={() => title}></Scatter>
        </div>
    )
}
export default DataChart