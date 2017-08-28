import mediaQueryFormator from './mediaQueryFormator';
import keyFrameFormator from './keyFrameFormator';
import { hasMediaQuery, hasOpenCurly, hasCloseCurly, parseStyle, updateCss, isUnwantedLine, hasKeyFrame, getSelector } from './utils';

let formator = (css)=>{
    css = css.replace(/{/g, '{\n');
    css = css.replace(/{/g, '{\n');
    css = css.replace(/}/g, '\n}\n');
    let lines = css.split('\n');
    let formatedObj = {
        __common_: {},
        __keyFramesKeys_: {},
        __keyFrames_: {}
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
                let data = mediaQueryFormator(line);
                if (data){
                    let [ mediaKey ] = Object.keys(data);
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
                let result = keyFrameFormator(line);
                if (result){
                    let { key, object } = result;
                    formatedObj['__keyFrames_'][key] = Object.assign(object);
                    isKeyFrame = false;
                }
            }else if (hasOpenCurly(line) && !isMedia && !isKeyFrame){
                key = line.split('{')[0];
            }else if (hasCloseCurly(line) && !isMedia && !isKeyFrame){
                let styleObj = parseStyle(style);
                let keys = key.split(',');
                keys.forEach(cName=>{
                    if (styleObj['-webkit-animation-name']){
                        let [ name, selector ] = getSelector(cName);
                        formatedObj['__keyFramesKeys_'][name] = {};
                        formatedObj['__keyFramesKeys_'][name]['name'] = styleObj['-webkit-animation-name'];
                        formatedObj['__keyFramesKeys_'][name]['__selectors'] = selector;
                    }
                    formatedObj = updateCss(formatedObj, cName, styleObj);
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