const objectToArray = (obj) => {
  const newArray = obj.reduce((accumulator, current, index) => {
    accumulator[index] = { id: current, name: current }
    return accumulator
  }, [])

  return newArray
}

const orderArrayAsc = ({ data, property }) => data.sort((a, b) => a[property] - b[property])

const orderArrayDes = ({ data, property }) => data.sort((a, b) => b[property] - a[property])

const conditionFilterAscDes = (dataCondition) => {
  const { type, data, property } = dataCondition

  if (type === 'asc') return orderArrayAsc({ data, property })
  if (type === 'des') return orderArrayDes({ data, property })
}

export { objectToArray, orderArrayDes, orderArrayAsc, conditionFilterAscDes }
