import moment from 'moment'

const dateStandardOutputFormat = 'MMMM DD, YYYY'
export {dateStandardOutputFormat}

const defaultDataOptions = {
    showLine: true,
}

const getDataPoints = (data, dataNode, dataName, filter) => {
    const { name, dataDateName, dataDateFormat, ...rest } = dataNode
    return (
        data[name].edges.map(({ node }) => {
            const date = moment(node[dataDateName], dataDateFormat).format(dateStandardOutputFormat)
            const dataPoint = {
                t: date,
                t_original: date,
                y: node[dataName],
                y_original: node[dataName],
            }
            return filter(dataPoint, dataNode, dataName)
        })
    )
}

const getChartJSDataset = (dataSet, data, filter_single = _ => _, filter_dataset = _ => _, filter_datasets = _ => _) => (
    {
        datasets: filter_datasets(
            dataSet.map(
                ({ dataLabel, dataRef, dataName, dataColor, type, dataNode, legend, greyed }) => (
                    {
                        borderColor: greyed ? '#ccc' : dataColor.value,
                        backgroundColor: type && type === 'bar' ? (greyed ? '#ddd' : dataColor.value) : 'transparent',
                        dataName: dataName,
                        dataNode: dataNode,
                        dataRef: dataRef,
                        data: filter_dataset(getDataPoints(data, dataNode, dataName, filter_single)),
                        dataColor: dataColor,
                        hoverBackgroundColor: dataColor.value,
                        label: dataLabel,
                        legend: legend,
                        offset: true,
                        order: (type && type === 'bar') ? 2 : 1,
                        type: type && type,
                        hidden: !type,
                        ...defaultDataOptions
                    }
                )
            )
        ),
        datasetsIndex: [...dataSet].reduce((current, item, index) => { current[item.dataName] = index; return current }, {})
    }
)

export default getChartJSDataset