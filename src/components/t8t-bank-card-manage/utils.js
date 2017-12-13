// import division from 'src/components/t8t-division/division.json'
// import nameMaps from 'src/components/t8t-division/nameMaps.json'

export const getDivisions = function (division, pid) {
    for (let i of division) {
        if(['11', '12', '31', '50'].indexOf(pid) > -1 && pid === i.id.toString()){
              return [{ text: i.name, value: i.id.toString() }]
        }
        if (i.id.toString() === pid) {
            return i.children.map(i => {
                return { text: i.name, value: i.id.toString() }
            })
        } else if (typeof i.children !== 'undefined') {
            getDivisions(i.children, pid)
        }
    }
}

export const getProvinces = function (division) {
    return division.map(i => { return { text: i.name, value: i.id.toString() } })
}
