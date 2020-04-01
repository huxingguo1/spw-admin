export const getAllNode = (arr, name, childName) => {
  let str
  const arrs = []

  if (!arr) {
    return
  }
  if (!name) {
    name = 'appId'
  }
  if (!childName) {
    childName = 'children'
  }
  const getChild = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      var myMap = new Map()
      myMap.set(name, arr[i].appId)
      myMap.set('name', arr[i].name)
      if (arr[i][childName] && arr[i][childName].length > 0) {
        getChild(arr[i].children)
      }
      arrs.push(myMap)
    }
    str = arrs
    console.log(str)
    return str
  }

  return getChild(arr)
}
export const getAllKey = (arr, name, childName) => {
  let str
  const arrs = []
  var ceshi = []
  if (!arr) {
    return
  }
  if (!name) {
    name = 'appId'
  }
  if (!childName) {
    childName = 'children'
  }
  const getChild = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      arrs.push(arr[i].appId)
      if (arr[i][childName] && arr[i][childName].length > 0) {
        getChild(arr[i].children)
      } else {
        ceshi.push(arr[i].id)
      }
    }
    str = ceshi
    return str
  }
  return getChild(arr)
}
