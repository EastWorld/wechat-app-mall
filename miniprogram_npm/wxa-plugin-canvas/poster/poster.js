const defaultOptions = {
    selector: '#poster'
};

function Poster(options = {}, that) {
    options = {
        ...defaultOptions,
        ...options,
    };

    const pages = getCurrentPages();
    let ctx = pages[pages.length - 1];
    if (that) ctx = that
    const poster = ctx.selectComponent(options.selector);
    delete options.selector;

    return poster;
};

Poster.create = (reset = false, that) => {
    const poster  = Poster({}, that);
    if (!poster) {
        console.error('请设置组件的id="poster"!!!');
    } else {
        return Poster({}, that).onCreate(reset);
    }
}

export default Poster;
