import mediaQueryFormator from './mediaQueryFormator';
import keyFrameFormator from './keyFrameFormator';
import { hasMediaQuery, isStyle, classNameFilter, hasOpenCurly, hasCloseCurly, parseStyle, updateCss, isUnwantedLine, hasKeyFrame, getSelector } from './utils';

let formator = (css, parseSelector = true, alignCamelCase = false)=>{
    css = css.replace(/{/g, '{\n');
    css = css.replace(/{/g, '{\n');
    css = css.replace(/}/g, '\n}\n');
    let lines = css.split('\n');
    let formatedObj = {
        __common_: {},
        __keyFramesKeys_: {},
        __keyFrames_: {},
        __mediaKeys_: {}
    };
    let mediaQueries = {};
    let isMedia = false;
    let isKeyFrame = false;
    let style = '';
    let key = '';
    lines.forEach(line=>{
        if (!isUnwantedLine(line)){
            if ((hasMediaQuery(line) || isMedia) && !isKeyFrame){
                if (!isMedia){
                    isMedia = true;
                }
                let result = mediaQueryFormator(line, parseSelector);
                if (result){
                    let { data, subKeys } = result;
                    let [ mediaKey ] = Object.keys(data);
                    subKeys.forEach(subKey=>{
                        if (formatedObj['__mediaKeys_'][subKey]){
                            if (formatedObj['__mediaKeys_'][subKey].indexOf(mediaKey) === -1){
                                formatedObj['__mediaKeys_'][subKey].push(mediaKey);
                            }
                        }else{
                            formatedObj['__mediaKeys_'][subKey] = [mediaKey];
                        }
                    })
                    if (mediaQueries[mediaKey]){
                        let obj = data[mediaKey];
                        let subStyles = Object.keys(mediaQueries[mediaKey]);
                        subStyles.forEach(subStyle=>{
                            let style = mediaQueries[mediaKey][subStyle];
                            let newStyle = data[mediaKey][subStyle];
                            style = Object.assign(style, newStyle);
                            obj[subStyle] = style;
                        })
                        mediaQueries[mediaKey] = obj;
                    }else{
                        mediaQueries = Object.assign(mediaQueries, data);
                    }
                    isMedia = false;
                }
            }else if ((hasKeyFrame(line) && !isMedia) || isKeyFrame){
                if (!isKeyFrame){
                    isKeyFrame = true;
                }
                let result = keyFrameFormator(line, parseSelector);
                if (result){
                    let { key, object } = result;
                    formatedObj['__keyFrames_'][key] = object[key];
                    isKeyFrame = false;
                }
            }else if (hasOpenCurly(line) && !isMedia && !isKeyFrame){
                key = line.split('{')[0];
            }else if (hasCloseCurly(line) && !isMedia && !isKeyFrame){
                let styleObj = parseStyle(style);
                let keys = key.split(',');
                keys.forEach(cName=>{
                    if (isStyle(cName) && alignCamelCase){
                        cName = classNameFilter(cName);
                    }
                    if (styleObj['-webkit-animation-name']){
                        let [ name ] = getSelector(cName);
                        let val = styleObj['-webkit-animation-name'];
                        if (!formatedObj['__keyFramesKeys_'][name]){
                            formatedObj['__keyFramesKeys_'][name] = [val];
                        }else{
                            if (formatedObj['__keyFramesKeys_'][name].indexOf(val) === -1){
                                formatedObj['__keyFramesKeys_'][name].push(val);
                            }
                        }
                    }
                    formatedObj = updateCss(formatedObj, cName, styleObj, undefined, parseSelector);
                })
                key = '';
                style = '';
            }else{
                style += line;
            }
        }
    })
    formatedObj['__media_quries'] = mediaQueries;
    return formatedObj;
}

export default formator;
