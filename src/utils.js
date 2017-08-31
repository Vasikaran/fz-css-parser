let hasMediaQuery = (str)=>{
    return hasValue(str, '@media');
}

let hasOpenCurly = (str)=>{
    return hasValue(str, '{');
}

let hasCloseCurly = (str)=>{
    return hasValue(str, '}');
}

let parseStyle = (styleStr)=>{
    let styles = styleStr.split(';');
    let styleObj = {};
    styles.forEach(style=>{
        let [key, value] = style.split(':');
        styleObj[key] = value;
    })
    return styleObj;
}

let isStyle = (str)=>{
    if (str){
        return str.startsWith('.') ? true : str.startsWith('#') ? true : false;
    }
    return;
}

let hasValue = (str, key)=>{
    return str.indexOf(key) === -1 ? false : true;
}

let getSelector = (str)=>{
    if (str){
        if (str.startsWith('::')){
            return [undefined, str];
        }
    }
    let regex = /[:.+ ]/;
    let substr = str;
    let index = 0;
    if (isStyle(str)){
        substr = str.substring(1, str.length);
        index = 1;
    }
    let splitChar = substr.match(regex) && substr.match(regex)[0];
    if (splitChar){
        let styleParts = substr.split(splitChar);
        let className = styleParts.splice(0, 1);
        let selector = styleParts.join(splitChar);
        return [str.substring(0, index) + className, splitChar + selector]
    }
    return [str];
}

let updateObj = (obj, key, value)=>{
    if (obj[key]){
        let oldValue = JSON.parse(JSON.stringify(obj[key]));
        let newVale = JSON.parse(JSON.stringify(value));
        oldValue = Object.assign(oldValue, newVale);
        obj[key] = oldValue;
    }else{
        if (key.replace(/\s+/, '') !== ''){
            value = JSON.parse(JSON.stringify(value));
            obj[key] = value;
        }
    }
    return obj;
}

let updateCss = (object, key, style, isMedia=false, parseSelector)=>{
    if (parseSelector){
        let [cName, selector] = getSelector(key);
        if (!isStyle(cName) && !isMedia){
            let obj = object['__common_'];
            if (selector && cName){
                obj = updateSelectors(obj, cName, selector, style);
            }else if(!cName && selector){
                obj = updateObj(obj, selector, style);
            }else{
                obj = updateObj(obj, cName, style);
            }
        }else{
            if (selector && cName){
                object = updateSelectors(object, cName, selector, style);
            }else{
                if (key.replace(/\s+/, '') !== ''){
                    object = updateObj(object, key, style);
                }
            }
        }
    }else{
        if (key.replace(/\s+/, '') !== ''){
            object = updateObj(object, key, style);
        }
    }
    return object;
}

let updateSelectors = (obj, cName, selector, style)=>{
    obj[cName] = obj[cName] ? obj[cName] : {};
    obj[cName]['__selectors'] = obj[cName]['__selectors'] ?
    obj[cName]['__selectors'] : {};
    let tempObj = obj[cName]['__selectors'];
    obj[cName]['__selectors'] = updateObj(tempObj, selector, style);
    return obj;
}

let isUnwantedLine = (line)=>{
    if (line.startsWith('@charset')){
        return true;
    }
    return false;
}

let hasKeyFrame = (line)=>{
    if (!line.startsWith('@')){
        return false;
    }
    return hasValue(line, 'keyframes');
}

let isObject = (data)=>{
    return data && data.toString() === '[object Object]' ? true : false;
}

let isString = (data)=>{
    return data && typeof data === 'string' ? true : false;
}

let classNameFilter = (data)=>{
    let pieces = data.split('-');
    let str = pieces.splice(0, 1)[0];
    pieces.forEach(piece=>{
        if (piece !== ''){
            str += piece[0].toUpperCase() + piece.substr(1);
        }
    })
    return str;
}

export { classNameFilter, isString, isObject, hasMediaQuery, hasOpenCurly, hasCloseCurly, parseStyle, isStyle, getSelector, updateObj, updateCss, updateSelectors, isUnwantedLine, hasKeyFrame };
