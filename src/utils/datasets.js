import moment from 'moment'

const dateStandardOutputFormat = 'MMMM DD, YYYY'

const defaultDataOptions = {
    showLine: true,
}


const getDataPoints = (data, { name, dataDateName, dataDateFormat }, dataName) => (
    data[name].edges.map(({ node }) => (
        {
            t: moment(node[dataDateName], dataDateFormat).format(dateStandardOutputFormat),
            y: node[dataName]
        }
    ))
)

const getChartJSDataset = (dataSet, data) => (
    {
        datasets: dataSet.map(({ dataLabel, dataName, dataColor, type, dataNode, legend }) => (
            {
                label: dataLabel,
                dataName: dataName,
                data: getDataPoints(data, dataNode, dataName),
                dataColor: dataColor,
                borderColor: dataColor.value,
                type: type && type,
                offset: true,
                backgroundColor: type && type === 'bar' && dataColor.value,
                order: (type && type === 'bar') ? 2 : 1,
                legend: legend,
                ...defaultDataOptions
            }
        )),
        datasetsIndex: [...dataSet].reduce((current, item, index) => { current[item.dataName] = index; return current }, {})
    }
)

export default getChartJSDataset