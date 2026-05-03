import path from "node:path";

import { createStream } from "rotating-file-stream";

const rotationStream = createStream("app.log", {
  size: "10M", // Rotate every 10 MegaBytes written
  interval: "1d", // Rotate daily
  compress: "gzip", // Compress rotated files
  path: path.join(__dirname, "../../../logs"),
});

export default rotationStream;
