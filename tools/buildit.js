const FS = require('fs');
const PATHS = require('path');

const OUTDIR = "dist";
mkdir(OUTDIR);//if(!FS.existsSync(OUTDIR)) FS.mkdirSync(OUTDIR);
const EXAMPLES_OUTDIR = PATHS.join(OUTDIR,'examples');
mkdir(EXAMPLES_OUTDIR);//if(!FS.existsSync(EXAMPLES_OUTDIR)) FS.mkdirSync(EXAMPLES_OUTDIR);

const config = {
    keywords:    "argon, aframe, augmented reality, web, javascript",
    argonaframejs: "../../argon-aframe.js",
    samples: "https://samples.argonjs.io",
};

function mkdir(dir) {
    if(!FS.existsSync(dir)) FS.mkdirSync(dir);
}
copyDirRecursive("examples","dist/examples").then(()=>{
    console.log("finished copying examples dir");
    processPage("examples/basic/index.html");
    processPage("examples/geoposition/index.html");
    processPage("examples/panorama/index.html");
    processPage("examples/vuforia/index.html");
    processPage("examples/vuforia-aframe-logo/index.html");
});

function copyDirRecursive(src,dst) {
    mkdir(dst);
    return Promise.all(FS.readdirSync(src).map((file)=>{
        const fpath = PATHS.join(src,file);
        const dpath = PATHS.join(dst,file);
        if(FS.lstatSync(fpath).isDirectory()) {
            return copyDirRecursive(fpath,dpath);
        } else {
            return copyFile(fpath,dpath);
        }
    }));
}

function copyFile(fpath,dpath) {
    return new Promise((res,rej)=>{
        const reader = FS.createReadStream(fpath);
        const writer = FS.createWriteStream(dpath);
        writer.on('finish',()=> res());
        reader.pipe(writer);
    });
}

function processPage(path) {
    const parsed = PATHS.parse(path);
    // console.log(PATHS.parse(path));

    var file = FS.readFileSync(path).toString();
    file = file.replace(/{{ site.keywords }}/g, config.keywords);
    file = file.replace(/{{ site.argonaframejs }}/g, config.argonaframejs);
    file = file.replace(/{{ site.samples }}/g,config.samples);



    const fdir = PATHS.join(OUTDIR,parsed.dir);
    if (!FS.existsSync(fdir)) FS.mkdirSync(fdir);
    const fpath = PATHS.join(OUTDIR,parsed.dir,parsed.base);
    console.log('rewrote ', fpath);

    FS.writeFileSync(fpath, file);
}

