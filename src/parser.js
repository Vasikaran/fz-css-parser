import minify from 'fz-uglifycss';
import formator from './formator';

let cssParser = (css)=>{
    let minifiedCss = minify(css);
    return formator(minifiedCss);
}

export default cssParser;
