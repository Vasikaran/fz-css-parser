import formator from './formator';

let concatProperties = (property, value, object)=>{
    let selectors = Object.keys(object);
    let result = {};
    let keys = [];
    selectors.forEach(selector => {
        let style = object[selector];
        let properties = Object.keys(style);
        let isCheck = false;
        properties.forEach(prop => {
            if (prop === property && style[prop] === value && !isCheck) {
                keys.push(selector);
                result[prop] = value;
                isCheck = true;
            }
        })
    })
    keys = keys.join(',');
    let obj = {
        selector: keys,
        [keys]: result
    }
    return obj;
}

let iterateObj = (object)=>{
    let selectors = Object.keys(object);
    let result = {};
    selectors.forEach(selector => {
        let style = object[selector];
        let properties = Object.keys(style);
        properties.forEach(property => {
            let data = concatProperties(property, style[property], object);
            let key = data.selector;
            let obj = data[key];
            if (result[key]) {
                let newObj = Object.assign(result[key], obj);
                result[key] = newObj;
            } else {
                result[key] = obj;
            }

        })
    })
    return result;
}

let commonOptimize = (object, isKeyFrame = false)=>{
    let keys = Object.keys(object);
    let result = {};
    keys.forEach(key=>{
        let data = key;
        if (isKeyFrame){
            data = object[key]['__raw'];
            delete object[key]['__raw'];
        }
        result[data] = iterateObj(object[key]);
    })
    return result;
}

let getStyle = (obj)=>{
    let newObj = JSON.parse(JSON.stringify(obj));
    delete newObj.__common_;
    delete newObj.__keyFramesKeys_;
    delete newObj.__keyFrames_;
    delete newObj.__mediaKeys_;
    delete newObj.__media_quries;
    return newObj;
}

let optimizer = (css)=>{
    css = css.replace(/(\r|\n|\t)/g, '');
    let tree = formator(css, false);
    let media = tree.__media_quries;
    let keyFrame = tree.__keyFrames_;
    let obj = {
        media: {},
        keyFrame: {},
        style: {}
    }
    obj['media'] = commonOptimize(media);
    obj['keyFrame'] = commonOptimize(keyFrame, true);
    let style = getStyle(tree);
    obj['style'] = iterateObj(style);
    return obj;
}

export default optimizer;
