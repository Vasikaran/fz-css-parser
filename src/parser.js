import minify from 'fz-uglifycss';
import formator from './formator';
import { isObject, isString } from './utils';
import optimizer from './optimizer';

export default class cssParser{
    constructor(css, alignCamelCase){
        let minifiedCss = minify(css);
        this.ast = formator(minifiedCss, true, alignCamelCase);
    }

    getAST(){
        return this.ast;
    }

    objToStr(obj, selector, ignoreKeys = [], isSubStyle = false){
        let str = '';
        let keys = Object.keys(obj);
        keys.forEach(key=>{
            if (ignoreKeys.indexOf(key) === -1){
                let data = obj[key];
                if (isObject(data)){
                    str += this.objToStr(data, key, ignoreKeys, isSubStyle);
                }else if (isString(data)){
                    str += isSubStyle ? '\t' : '';
                    str += '\t' + key + ':' + data + ';\n';
                }
            }
        })
        if (str !== ''){
            str += isSubStyle ? '\t' : '';
            str = '\n' + selector +'{\n' + str + '}\n';
        }
        return str;
    }

    mediaToStr(media, styleName){
        let mediaQueries = this.ast['__media_quries'];
        let mediaDatas = mediaQueries[media];
        let str = '';
        let style = mediaDatas[styleName];
        str += this.getRaw(styleName, style, undefined, undefined, true);
        return str;
    }

    getMedia(styleName){
        let mediaKeys = this.ast['__mediaKeys_'];
        let str = '';
        let medias = mediaKeys[styleName];
        if (medias){
            medias.forEach(media=>{
                let data = this.mediaToStr(media, styleName);
                if (data !== ''){
                    str += '\n' + media + '{\n' + data + '\n}\n';
                }
            })
        }
        return str;
    }

    keyFrameToStr(name){
        let keyFrame = this.ast['__keyFrames_'][name];
        return this.getRaw(name, keyFrame, ['__raw'], keyFrame['__raw'], true);
    }

    getKeyFrames(styleName){
        let keyFrameKeys = this.ast['__keyFramesKeys_'];
        let str = ''
        let names = keyFrameKeys[styleName];
        if (names){
            names.forEach(name=>{
                str += this.keyFrameToStr(name);
            })
        }
        return str;
    }

    selectorToStr(selectors, styleName){
        let keys = Object.keys(selectors);
        let raw = '';
        keys.forEach(key=>{
            let selector = selectors[key];
            raw += this.objToStr(selector, styleName + key);
        })
        return raw;
    }

    getRaw(selector, style, ignoreKeys = ['__selectors'], prefix, isSubStyle){
        let selectors = style['__selectors'];
        selector = prefix ? prefix : selector;
        let raw = this.objToStr(style, selector, ignoreKeys, isSubStyle);
        let rawSelectors;
        rawSelectors = selectors ? this.selectorToStr(selectors, selector) : '';
        raw = raw + rawSelectors;
        return raw;
    }

    getValue(selectors, option = {}){
        let css = '';
        if (isString(selectors)){
            selectors = [selectors];
        }
        let { isClass = true, optimize = true } = option;
        selectors.forEach(selector=>{
            if (isClass){
                selector = '.' + selector;
            }else if (option.isId){
                selector = '#' + selector;
            }
            let value = this.ast[selector];
            if (value){
                let raw = this.getRaw(selector, value);
                let medias = this.getMedia(selector);
                let keyframes = this.getKeyFrames(selector);
                css += raw + medias + keyframes;
            }
        })
        if (optimize){
            let { media, keyFrame, style } = optimizer(css);
            media = this.netedObjToStr(media);
            keyFrame = this.netedObjToStr(keyFrame);
            style = this.netedObjToStr(style);
            css = style + media + keyFrame;
        }
        return css;
    }

    netedObjToStr(obj, isSubStyle = false){
        let str = '';
        let keys = Object.keys(obj);
        keys.forEach((key, count)=>{
            let data = obj[key];
            str += isSubStyle ? '\t' : '';
            if (isObject(data)){
                str +=  key + '{\n' + this.netedObjToStr(data, true);
                str += isSubStyle ? '\n\t}\n' : '\n}\n';
            }else if (isString(data)){
                str += '\t' + key + ':' + data;
                str += count === keys.length - 1 ? ';' : ';\n'
            }
        })
        return str;
    }

    getCommon(){
        let commons = this.ast['__common_'];
        let selectors = Object.keys(commons);
        let str = '';
        selectors.forEach(selector=>{
            let raw = this.getRaw(selector, commons[selector]);
            let medias = this.getMedia(selector);
            let keyframes = this.getKeyFrames(selector);
            str += raw + medias + keyframes;
        })
        return str;
    }
}
