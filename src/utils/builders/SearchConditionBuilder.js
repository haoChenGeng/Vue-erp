/**
 * Created by Carl.wu on 2017/4/26.
 */

let SearchConditionBuilder = {}

SearchConditionBuilder.build = function(search, fields) {
    if (!fields || fields.length <= 0) return search

    let condition = {}, item, itemValue, flag, flag1, flag2, item1, item2

    const dates = ['date', 'datetime'];
    const datePickers = ['daterange', 'datetimerange'];

    fields.forEach((field) => {
        if (field.name) {
            // query_mode 分single和group
            if (dates.indexOf(field.type) !== -1 && datePickers.indexOf(field.pickertype) !== -1 ) {
                flag1 = field.operator || "gte"
                item1 = (field.name) + "_" + flag1
                flag2 = field.operator || "lt"
                item2 = (field.name) + "_" + flag2

                if (search[field.endField] != null && search[field.startField] != null) {
                    condition[item1] = search[field.startField]
                    condition[item2] = search[field.endField]
                }


            } else if (field.type == 'area') {
                flag = field.operator || "eq"
                console.log(search)
                field.subNames.forEach((name) => {

                    itemValue = search[name] || null
                    item = name + "_" + flag
                    if (itemValue !== null) condition[item] = itemValue
                })


            } else {
                flag = field.operator || "eq"
                itemValue = search[field.name] || null
                item = field.name + "_" + flag
                if (itemValue !== null) condition[item] = itemValue
            }


        }
    })

    return condition
}

export default SearchConditionBuilder
