/**
 * Created by sean.liu on 2017/3/30.
 */

/*
 * @FileName: Utils
 * @Description:
 * @Date: 2017-03-06
 * @version: 1.0
 * @author: <carl.wu@corp.to8to.com>
 */

import oMap from './maps/parentMaps.json'
import nameMap from './maps/nameMaps.json'

let GeoUtils = {
    getParentName (code, spliter) {
        spliter = spliter || "/"

        if (typeof nameMap[code] === 'undefined') {
            return null;
        }

        return this.deepLoop(code).map(function (e) {
            return nameMap[e]
        }).join(spliter)
    },
    getParentList (code) {
        if (typeof oMap[code] === 'undefined') {
            return null;
        }

        return this.deepLoop(code);
    },
    deepLoop (code, list) {
        let curList = list || [(code + "")];
        if (oMap[code]) {
            curList.unshift(oMap[code] + "");
            this.deepLoop(oMap[code], curList);
        }

        return curList;
    }
}

export default GeoUtils


