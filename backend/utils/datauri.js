import DataUriParser from "datauri/parser.js";
import path from "path";

const parser = new DataUriParser();

const getDataUri = (file) => {
    const extName = path.extname(file.originalname).toString();
<<<<<<< HEAD
    return parser.format(extName, file.buffer).content;
=======
    return parser.format(extName, file.buffer);
>>>>>>> d997b8b (Initial commit: project ready for deployment)
};
export default getDataUri;
